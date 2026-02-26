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

    /**
     * Helper method for standardized JSON responses.
     */
    private function jsonResponse(string $message, mixed $data = null, int $status = 200): \Illuminate\Http\JsonResponse
    {
        $response = ['message' => $message];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        return response()->json($response, $status);
    }

    public function index(Request $request)
    {
        // Validation des paramètres de requête
        $request->validate([
            'status' => 'nullable|in:PENDING,ACTIVE,HIRED,ARCHIVED',
            'search' => 'nullable|string|max:255',
            'contract_type' => 'nullable|string|in:CDI,CDD,STAGE,Prestataire,TOUS',
        ]);

        $query = Candidate::with(['category', 'subCategory', 'skills']);

        // Filtrage par statut (défaut ACTIVE pour la liste publique)
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filtrage par type de contrat
        if ($request->has('contract_type') && $request->contract_type !== 'TOUS') {
            $query->where('contract_type', $request->contract_type);
        }

        // Recherche textuelle multi-colonnes
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('position_searched', 'like', "%{$search}%")
                  ->orWhereHas('category', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('skills', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $candidates = $query->latest()->paginate(10);
        return CandidateResource::collection($candidates);
    }

    public function store(StoreCandidateRequest $request)
    {
        $candidate = $this->candidateService->createCandidate(
            $request->validated(),
            $request->file('cv_file')
        );

        return $this->jsonResponse(
            'Candidat créé avec succès.',
            $candidate->load(['category', 'subCategory', 'skills', 'cvFiles']),
            201
        );
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

        return $this->jsonResponse(
            'Candidat mis à jour avec succès.',
            $candidate->load(['category', 'subCategory', 'skills', 'cvFiles'])
        );
    }

    public function addCv(Request $request, Candidate $candidate)
    {
        $request->validate([
            'cv_file' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $this->candidateService->storeCv($candidate, $request->file('cv_file'));

        return $this->jsonResponse(
            'CV ajouté avec succès.',
            $candidate->load('cvFiles')
        );
    }

    public function updateStatus(Request $request, Candidate $candidate)
    {
        $request->validate([
            'status' => 'required|in:PENDING,ACTIVE,HIRED,ARCHIVED',
        ]);

        $candidate->update(['status' => $request->status]);

        return $this->jsonResponse(
            'Statut mis à jour avec succès.',
            $candidate
        );
    }

    public function stats()
    {
        $stats = Candidate::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = "ACTIVE" THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = "HIRED" THEN 1 ELSE 0 END) as hired,
                SUM(CASE WHEN status = "ARCHIVED" THEN 1 ELSE 0 END) as archived,
                SUM(CASE WHEN status = "PENDING" THEN 1 ELSE 0 END) as pending
            ')
            ->first()
            ->toArray();

        return response()->json($stats);
    }

    public function destroy(Candidate $candidate)
    {
        $this->candidateService->deleteCandidate($candidate);

        return $this->jsonResponse('Candidat supprimé avec succès.');
    }
}