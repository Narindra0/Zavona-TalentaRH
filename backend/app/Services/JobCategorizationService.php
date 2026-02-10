<?php

namespace App\Services;

use App\Models\Category;
use App\Models\SubCategory;
use App\Models\PendingCategory;
use Illuminate\Support\Str;

class JobCategorizationService
{
    /**
     * Categorize a job title and return category and sub-category IDs.
     */
    public function categorize(string $title): array
    {
        $normalizedTitle = $this->normalize($title);
        $bestMatch = null;
        $maxScore = 0;

        // Fetch all sub-categories with keywords from database
        $subCategories = SubCategory::with('category')->whereNotNull('keywords')->get();

        foreach ($subCategories as $subCategory) {
            $score = 0;
            $keywords = $subCategory->keywords ?: [];
            
            foreach ($keywords as $keyword) {
                $normalizedKeyword = $this->normalize($keyword);
                if (Str::contains($normalizedTitle, $normalizedKeyword)) {
                    $score += count(explode(' ', $normalizedKeyword)) * 10;
                }
            }

            if ($score > $maxScore) {
                $maxScore = $score;
                $bestMatch = $subCategory;
            }
        }

        if ($bestMatch) {
            return [
                'category_id' => $bestMatch->category_id,
                'sub_category_id' => $bestMatch->id,
                'category_name' => $bestMatch->category->name,
                'sub_category_name' => $bestMatch->name,
                'is_suggested' => false
            ];
        }

        // Handle unknown titles
        return $this->handleUnknownTitle($title);
    }

    /**
     * Handle unknown titles by suggesting a category and logging for admin validation.
     */
    protected function handleUnknownTitle(string $title): array
    {
        $suggestedCategory = "À classifier";
        $suggestedSubcategory = $title;
        
        $normalizedTitle = Str::lower($title);
        
        // Logical Parent Suggestion (Basic)
        if (Str::contains($normalizedTitle, ['dev', 'code', 'prog', 'web', 'data', 'cloud', 'system', 'admin'])) {
            $suggestedCategory = "Développement Informatique";
        } elseif (Str::contains($normalizedTitle, ['design', 'graph', 'ux', 'ui', 'motion', 'crea'])) {
            $suggestedCategory = "Design & Création";
        } elseif (Str::contains($normalizedTitle, ['rh', 'recrut', 'ressources', 'human', 'paye', 'formation'])) {
            $suggestedCategory = "Ressources Humaines";
        } elseif (Str::contains($normalizedTitle, ['commercia', 'vente', 'business', 'vendeur', 'client'])) {
            $suggestedCategory = "Commercial & Vente";
        } elseif (Str::contains($normalizedTitle, ['marketing', 'comm', 'manager', 'social', 'media'])) {
            $suggestedCategory = "Marketing & Communication";
        } elseif (Str::contains($normalizedTitle, ['finance', 'compta', 'audit', 'banque', 'eco'])) {
            $suggestedCategory = "Finance & Comptabilité";
        }

        // Log suggestion if not already logged (avoid duplicates for pending)
        PendingCategory::firstOrCreate(
            ['original_title' => $title, 'status' => 'pending'],
            [
                'suggested_category' => $suggestedCategory,
                'suggested_subcategory' => $suggestedSubcategory,
            ]
        );

        // Assign to "À classifier" temporarily
        $defaultCategory = Category::where('name', 'À classifier')->first();
        $defaultSubCategory = SubCategory::where('category_id', $defaultCategory?->id)->first();

        return [
            'category_id' => $defaultCategory?->id,
            'sub_category_id' => $defaultSubCategory?->id,
            'category_name' => $defaultCategory?->name,
            'sub_category_name' => $defaultSubCategory?->name,
            'is_suggested' => true,
            'suggested_category' => $suggestedCategory,
            'suggested_subcategory' => $suggestedSubcategory
        ];
    }

    protected function normalize(string $text): string
    {
        $text = mb_strtolower($text, 'UTF-8');
        // Simple transiliteration
        $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
        $text = preg_replace('/[^a-z0-9 ]/', ' ', $text);
        return trim($text);
    }
}
