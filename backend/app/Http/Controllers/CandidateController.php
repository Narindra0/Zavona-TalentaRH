<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Services\CandidateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidateController extends Controller
{
    protected $candidateService;

    public function __construct(CandidateService $candidateService)
    {
        $this->candidateService = $candidateService;
    }

    public function index(Request $request)
    {
        $query = Candidate::with(['category', 'subCategory', 'skills']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $candidates = $query->latest()->get();
        return response()->json($candidates);
    }

    public function store(StoreCandidateRequest $request)
    {
        $candidate = $this->candidateService->createCandidate(
            $request->validated(),
            $request->file('cv_file')
        );

        return response()->json([
            'message' => 'Candidat créé avec succès.',
            'data' => $candidate->load(['category', 'subCategory', 'skills', 'cvFiles'])
        ], 201);
    }

    public function show(Candidate $candidate)
    {
        $candidate->load(['category', 'subCategory', 'skills', 'cvFiles']);
        
        // Confidentialité : Masquer les données de contact uniquement pour la vue publique
        if (!auth('sanctum')->check()) {
            $candidate->email = 'Contactez-nous via ZANOVA';
            $candidate->phone = 'Contactez-nous via ZANOVA';
        } else {
            // Si admin/authentifié, on charge les intérêts
            $candidate->load('recruiterInterests');
        }
        
        return response()->json($candidate);
    }

    public function viewCv(Candidate $candidate)
    {
        $cvFile = $candidate->cvFiles()->first();

        if (!$cvFile || !Storage::disk('public')->exists($cvFile->file_path)) {
            return response()->json(['message' => 'CV introuvable'], 404);
        }

        $path = Storage::disk('public')->path($cvFile->file_path);
        
        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="CV_' . $candidate->last_name . '.pdf"',
        ]);
    }

    public function update(UpdateCandidateRequest $request, Candidate $candidate)
    {
        $candidate = $this->candidateService->updateCandidate(
            $candidate,
            $request->validated(),
            $request->file('cv_file')
        );

        return response()->json([
            'message' => 'Candidat mis à jour avec succès.',
            'data' => $candidate->load(['category', 'subCategory', 'skills', 'cvFiles'])
        ]);
    }

    public function addCv(Request $request, Candidate $candidate)
    {
        $request->validate([
            'cv_file' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $this->candidateService->storeCv($candidate, $request->file('cv_file'));

        return response()->json([
            'message' => 'CV ajouté avec succès.',
            'data' => $candidate->load('cvFiles')
        ]);
    }

    public function updateStatus(Request $request, Candidate $candidate)
    {
        $request->validate([
            'status' => 'required|in:ACTIVE,HIRED,ARCHIVED',
        ]);

        $candidate->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Statut mis à jour avec succès.',
            'data' => $candidate
        ]);
    }

    public function destroy(Candidate $candidate)
    {
        $this->candidateService->deleteCandidate($candidate);

        return response()->json([
            'message' => 'Candidat supprimé avec succès.'
        ]);
    }
}