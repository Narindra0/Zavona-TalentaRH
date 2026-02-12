<?php

namespace App\Services;

use Smalot\PdfParser\Parser;
use Illuminate\Support\Str;

class CvParserService
{
    protected $parser;

    public function __construct()
    {
        $this->parser = new Parser();
    }

    /**
     * Parse a CV file and extract basic information.
     */
    public function parse($filePath): array
    {
        if (!file_exists($filePath)) {
            return ['error' => 'File does not exist'];
        }

        try {
            $pdf = $this->parser->parseFile($filePath);
            
            // Try extracting text
            $text = $pdf->getText();
            $pages = $pdf->getPages();
            
            \Log::info("PDF Extraction - Pages: " . count($pages) . ", Text length: " . strlen($text));

            // Fallback: Try page by page and inspect objects
            if (empty(trim($text)) && count($pages) > 0) {
                \Log::info("Main getText() empty, inspecting pages...");
                foreach ($pages as $i => $page) {
                    $pageText = $page->getText();
                    \Log::info("Page $i getText() length: " . strlen($pageText));
                    
                    // Try getTextArray() to see fragments
                    $textArray = $page->getTextArray();
                    \Log::info("Page $i getTextArray() count: " . count($textArray));
                    
                    if (empty(trim($pageText)) && !empty($textArray)) {
                        $pageText = implode(' ', $textArray);
                        \Log::info("Recovered text from getTextArray() (length: " . strlen($pageText) . ")");
                    }
                    
                    $text .= $pageText . "\n";
                    
                    // Inspect XObjects on the page for hidden text
                    foreach ($page->getXObjects() as $xObject) {
                        $details = $xObject->getDetails();
                        if (($details['Subtype'] ?? '') === 'Form') {
                            $text .= $xObject->getText() . "\n";
                        }
                    }
                }
            }

            if (empty(trim($text))) {
                \Log::warning("Zero text extracted after diagnostics. Final raw_text check.");
            }

            $text = trim($text);
            $cleanText = preg_replace('/\s+/', ' ', $text);
            $lines = array_filter(array_map('trim', explode("\n", $text)));
            
            \Log::info("Extracted result:", [
                'first_name' => $this->extractFirstName($lines),
                'email' => $this->extractEmail($cleanText),
                'snippet' => substr($cleanText, 0, 100)
            ]);

            return [
                'first_name' => $this->extractFirstName($lines),
                'last_name' => $this->extractLastName($lines),
                'email' => $this->extractEmail($cleanText),
                'phone' => $this->extractPhone($cleanText),
                'position' => $this->extractPosition($lines),
                'skills' => $this->extractSkills($cleanText, $lines),
                'raw_text' => mb_convert_encoding(substr($text, 0, 2000), 'UTF-8', 'UTF-8')
            ];
        } catch (\Exception $e) {
            \Log::error("PDF Parsing Exception: " . $e->getMessage());
            return [
                'error' => 'Failed to parse PDF'
            ];
        }
    }

    protected function extractSkills($text, $lines): array
    {
        $extractedSkills = [];
        
        // 1. Match against known skills in DB
        try {
            $knownSkills = \App\Models\Skill::all();
            foreach ($knownSkills as $skill) {
                // Case insensitive matching with word boundaries
                if (preg_match('/\b' . preg_quote($skill->name, '/') . '\b/i', $text)) {
                    $extractedSkills[] = [
                        'value' => $skill->id,
                        'label' => $skill->name
                    ];
                }
            }
        } catch (\Exception $e) {
            \Log::error("Error matching skills from DB: " . $e->getMessage());
        }

        // 2. Look for the "COMPÉTENCES" block to find new skills
        $skillsBlock = [];
        $isInSkillsSection = false;
        foreach ($lines as $line) {
            if (preg_match('/COMPÉTENCES/i', $line)) {
                $isInSkillsSection = true;
                continue;
            }
            if ($isInSkillsSection) {
                // Stop if we hit another section
                if (preg_match('/(FORMATION|EXPÉRIENCE|LANGUES|CENTRES|COORDONNÉES)/i', $line)) {
                    $isInSkillsSection = false;
                    break;
                }
                // Only take meaningful lines
                if (strlen($line) > 2 && strlen($line) < 40) {
                    $skillsBlock[] = trim($line);
                }
            }
        }

        // Add skills from the block if they are not already in extractedSkills
        foreach ($skillsBlock as $skillName) {
            $exists = false;
            foreach ($extractedSkills as $skill) {
                if (strtolower($skill['label']) === strtolower($skillName)) {
                    $exists = true;
                    break;
                }
            }
            if (!$exists) {
                $extractedSkills[] = [
                    'value' => $skillName, // For CreatableSelect, value can be the name if it's new
                    'label' => $skillName,
                    'isNew' => true
                ];
            }
        }

        return $extractedSkills;
    }

    protected function extractEmail($text): ?string
    {
        preg_match('/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/i', $text, $matches);
        return $matches[0] ?? null;
    }

    protected function extractPhone($text): ?string
    {
        // Flexible regex for French, international, and US-like formats (like 123-456-7890)
        preg_match('/(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]?\d{2}){4}|(?:\d{3}[\s.-]?){2}\d{4}/', $text, $matches);
        return $matches[0] ?? null;
    }

    protected function extractFirstName($lines): ?string
    {
        $candidates = [];
        foreach ($lines as $line) {
            $line = trim($line);
            if (preg_match('/(FORMATION|EXPÉRIENCE|COMPÉTENCES|LANGUES|CENTRES|COORDONNÉES|LOISIRS|PROJET)/i', $line)) continue;
            
            // Match "First Name LAST NAME" or "First Name Second Name"
            if (preg_match('/^([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][a-zàâäéèêëïîôöùûüÿç-]+)\s+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s]+)$/u', $line, $matches)) {
                return $matches[1];
            }
        }
        
        // Fallback: search for any TitleCase word that isn't a known noise word
        foreach ($lines as $line) {
            $line = trim($line);
            if (strlen($line) < 3) continue;
            if (preg_match('/(FORMATION|EXPÉRIENCE|COMPÉTENCES|LANGUES|CENTRES|COORDONNÉES|LOISIRS|PROJET|Lecture|Randonnée|Gym|Sport|Musique)/i', $line)) continue;
            
            if (preg_match('/^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][a-zàâäéèêëïîôöùûüÿç-]+$/u', $line, $matches)) {
                return $matches[0];
            }
        }
        
        return null;
    }

    protected function extractLastName($lines): ?string
    {
        foreach ($lines as $line) {
            $line = trim($line);
            if (preg_match('/(FORMATION|EXPÉRIENCE|COMPÉTENCES|LANGUES|CENTRES|COORDONNÉES|LOISIRS)/i', $line)) continue;

            // Match "First Name LAST NAME"
            if (preg_match('/^([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][a-zàâäéèêëïîôöùûüÿç-]+)\s+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s]{2,})$/u', $line, $matches)) {
                return trim($matches[2]);
            }
            // Match "FIRST NAME Last Name"
            if (preg_match('/^([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s]{2,})\s+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][a-zàâäéèêëïîôöùûüÿç-]+)$/u', $line, $matches)) {
                return trim($matches[1]);
            }
            // Match "Name NAME"
            if (preg_match('/^([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][a-zàâäéèêëïîôöùûüÿç-]+)\s+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][a-zàâäéèêëïîôöùûüÿç-]+)$/u', $line, $matches)) {
                return $matches[2];
            }
        }
        
        return null;
    }

    protected function extractPosition($lines): ?string
    {
        // Typical job titles in French/English
        $keywords = '(Développeur|Ingénieur|Manager|Consultant|Chef|Technicien|Expert|Analyste|Design|Comptable|Assistant|Commerce|Directeur|Spécialiste|Chargé|Chargée)';
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (strlen($line) > 5 && strlen($line) < 60) {
                if (preg_match('/' . $keywords . '/i', $line)) {
                    // Avoid matching section headers or contact info
                    if (!preg_match('/(EXPÉRIENCE|FORMATION|COMPÉTENCES|PROJET|@|:|http)/i', $line)) {
                        return $line;
                    }
                    // Specific case for "Chargée de Projet" etc.
                    if (preg_match('/^' . $keywords . '\s+(de|du|en)\s+/i', $line)) {
                        return $line;
                    }
                }
            }
        }
        return null;
    }
}
