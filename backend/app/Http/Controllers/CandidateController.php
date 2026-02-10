<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Category;
use App\Models\Skill;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $query = Candidate::with(['category', 'subCategory', 'skills']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $candidates = $query->latest()->get();
        return response()->json($candidates);
    }

    // Removal of create method

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'position_searched' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'contract_type' => 'nullable|string|in:CDI,CDD,Stage',
            'experience_level' => 'required|in:débutant,junior,intermédiaire,senior,expert',
            'description' => 'nullable|string',
            'skills' => 'array',
            'skills.*' => 'exists:skills,id',
            'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        Log::info('Tentative de création de candidat', $request->except(['cv_file']));

        $candidate = Candidate::create($request->except(['skills', 'cv_file']));

        if ($request->has('skills')) {
            $candidate->skills()->attach($request->skills);
        }

        if ($request->hasFile('cv_file')) {
            Log::info('Fichier CV détecté : ' . $request->file('cv_file')->getClientOriginalName());
            $path = $request->file('cv_file')->store('cv_files', 'public');
            Log::info('Fichier CV stocké à : ' . $path);
            
            $candidate->cvFiles()->create([
                'file_path' => $path,
                'source' => 'MANUAL',
                'parsed' => false,
            ]);
        } else {
            Log::warning('Aucun fichier CV détecté dans la requête CandidateController@store');
        }

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

    // Removal of edit method

    public function update(Request $request, Candidate $candidate)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'position_searched' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'contract_type' => 'nullable|string|in:CDI,CDD,Stage',
            'experience_level' => 'required|in:débutant,junior,intermédiaire,senior,expert',
            'description' => 'nullable|string',
            'status' => 'nullable|in:PENDING,ACTIVE,HIRED,ARCHIVED',
            'skills' => 'array',
            'skills.*' => 'exists:skills,id',
            'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $candidate->update($request->except(['skills', 'cv_file']));

        $candidate->skills()->sync($request->skills ?? []);

        if ($request->hasFile('cv_file')) {
            $path = $request->file('cv_file')->store('cv_files', 'public');
            
            $candidate->cvFiles()->create([
                'file_path' => $path,
                'source' => 'MANUAL',
                'parsed' => false,
            ]);
        }

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

        if ($request->hasFile('cv_file')) {
            $path = $request->file('cv_file')->store('cv_files', 'public');
            
            $candidate->cvFiles()->create([
                'file_path' => $path,
                'source' => 'MANUAL',
                'parsed' => false,
            ]);
        }

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
        foreach ($candidate->cvFiles as $cvFile) {
            Storage::disk('public')->delete($cvFile->file_path);
        }
        
        $candidate->delete();

        return response()->json([
            'message' => 'Candidat supprimé avec succès.'
        ]);
    }
}