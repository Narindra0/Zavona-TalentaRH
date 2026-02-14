<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\RecruiterInterest;
use Illuminate\Http\Request;

class RecruiterInterestController extends Controller
{
    /**
     * Store a new recruiter interest.
     * Public route.
     */
    public function store(Request $request, Candidate $candidate)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'recruiter_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $interest = RecruiterInterest::create([
            'candidate_id' => $candidate->id,
            'company_name' => $request->company_name,
            'recruiter_name' => $request->recruiter_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => 'PENDING',
        ]);

        return response()->json([
            'message' => 'Intérêt enregistré avec succès.',
            'interest' => $interest
        ], 201);
    }

    /**
     * Remove a recruiter interest.
     * Public route (based on candidate and email to identify the recruiter).
     */
    public function destroy(Request $request, Candidate $candidate)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        RecruiterInterest::where('candidate_id', $candidate->id)
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Intérêt retiré avec succès.'
        ]);
    }

    /**
     * List all recruiter interests for the admin.
     * Protected route.
     */
    public function index(Request $request)
    {
        $query = RecruiterInterest::with('candidate');

        if ($request->has('status') && $request->status !== 'ALL') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                  ->orWhere('recruiter_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('candidate', function($q2) use ($search) {
                      $q2->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        $interests = $query->latest()->paginate(10);

        return response()->json($interests);
    }

    /**
     * Update the status of a recruiter interest.
     * Protected route.
     */
    public function updateStatus(Request $request, RecruiterInterest $interest)
    {
        $request->validate([
            'status' => 'required|string|in:PENDING,CONTACTED,HIRED,REJECTED',
        ]);

        $interest->update([
            'status' => $request->status,
        ]);

        // Automatisation : Si l'intérêt est mis à "HIRED" (Placé), 
        // mettre à jour le candidat associé en "HIRED" (Recruté)
        if ($request->status === 'HIRED') {
            $interest->candidate()->update(['status' => 'HIRED']);
        }

        return response()->json([
            'message' => 'Statut mis à jour avec succès.',
            'interest' => $interest->load('candidate')
        ]);
    }
}
