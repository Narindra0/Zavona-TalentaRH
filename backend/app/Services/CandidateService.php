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

        $candidate = Candidate::create(collect($data)->except(['skills', 'cv_file'])->toArray());

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
        $candidate->update(collect($data)->except(['skills', 'cv_file'])->toArray());

        if (isset($data['skills'])) {
            $candidate->skills()->sync($data['skills']);
        }

        if ($cvFile) {
            $this->storeCv($candidate, $cvFile);
        }

        return $candidate;
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
