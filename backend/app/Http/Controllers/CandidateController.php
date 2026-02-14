<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Services\CandidateService;
use App\Http\Resources\CandidateResource;
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
        // Validation des paramètres de requête pour éviter les injections/erreurs
        $request->validate([
            'status' => 'nullable|in:ACTIVE,HIRED,ARCHIVED',
        ]);

        $query = Candidate::with(['category', 'subCategory', 'skills']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $candidates = $query->latest()->get();
        return CandidateResource::collection($candidates);
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
        
        // Si admin/authentifié, on charge les intérêts (le masquage est géré par CandidateResource)
        if (auth('sanctum')->check()) {
            $candidate->load('recruiterInterests');
        }
        
        return new CandidateResource($candidate);
    }

    public function viewCv(Candidate $candidate)
    {
        $cvFile = $candidate->cvFiles()->first();

        if (!$cvFile || !Storage::disk('public')->exists($cvFile->file_path)) {
            return response()->json(['message' => 'CV introuvable'], 404);
        }

        $content = Storage::disk('public')->get($cvFile->file_path);
        
        return response($content, 200, [
            'Content-Type' => 'application/pdf',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, OPTIONS',
            'Access-Control-Allow-Headers' => '*',
            'Access-Control-Expose-Headers' => 'Content-Length',
            'Cache-Control' => 'no-cache, private',
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