<?php

namespace App\Services;

use App\Models\Candidate;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CandidateService
{
    /**
     * Create a new candidate.
     */
    public function createCandidate(array $data, ?UploadedFile $cvFile = null): Candidate
    {
        if (app()->environment(['local', 'testing'])) {
            Log::info('Tentative de création de candidat via CandidateService', collect($data)->except(['cv_file', 'skills'])->toArray());
        }

        // Gérer les champs de tarification
        $candidateData = $this->processRateData($data);

        $candidate = Candidate::create($candidateData);

        if (isset($data['skills'])) {
            $candidate->skills()->attach($data['skills']);
        }

        if ($cvFile) {
            $this->storeCv($candidate, $cvFile);
        }

        return $candidate;
    }

    /**
     * Update an existing candidate.
     */
    public function updateCandidate(Candidate $candidate, array $data, ?UploadedFile $cvFile = null): Candidate
    {
        // Gérer les champs de tarification
        $candidateData = $this->processRateData($data);

        $candidate->update($candidateData);

        if (isset($data['skills'])) {
            $candidate->skills()->sync($data['skills']);
        }

        if ($cvFile) {
            $this->storeCv($candidate, $cvFile);
        }

        return $candidate;
    }

    /**
     * Process rate data to assign the correct fields based on rate type
     */
    private function processRateData(array $data): array
    {
        $processedData = collect($data)->except(['skills', 'cv_file'])->toArray();

        // Si c'est un prestataire avec des informations de tarification
        if (isset($data['contract_type']) && $data['contract_type'] === 'Prestataire') {
            if (isset($data['rate_type']) && isset($data['rate_amount'])) {
                if ($data['rate_type'] === 'daily') {
                    $processedData['daily_rate'] = $data['rate_amount'];
                    $processedData['weekly_rate'] = null;
                } elseif ($data['rate_type'] === 'weekly') {
                    $processedData['weekly_rate'] = $data['rate_amount'];
                    $processedData['daily_rate'] = null;
                }
            }
        } else {
            // Si ce n'est pas un prestataire, on réinitialise les champs de tarification
            $processedData['daily_rate'] = null;
            $processedData['weekly_rate'] = null;
            $processedData['rate_type'] = null;
        }

        return $processedData;
    }

    /**
     * Store a CV file for a candidate.
     */
    public function storeCv(Candidate $candidate, UploadedFile $file): void
    {
        if (app()->environment(['local', 'testing'])) {
            Log::info('Fichier CV détecté : ' . $file->getClientOriginalName());
        }
        $path = $file->store('cv_files', 'public');
        if (app()->environment(['local', 'testing'])) {
            Log::info('Fichier CV stocké à : ' . $path);
        }
        
        $candidate->cvFiles()->create([
            'file_path' => $path,
            'source' => 'MANUAL',
            'parsed' => false,
        ]);
    }

    /**
     * Delete a candidate and associated files.
     */
    public function deleteCandidate(Candidate $candidate): bool
    {
        foreach ($candidate->cvFiles as $cvFile) {
            Storage::disk('public')->delete($cvFile->file_path);
        }
        
        return $candidate->delete();
    }
}
