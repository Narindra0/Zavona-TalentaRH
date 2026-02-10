<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\SubCategory;
use App\Models\PendingCategory;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PendingCategoryController extends Controller
{
    /**
     * List all pending categorizations.
     */
    public function index()
    {
        return response()->json(PendingCategory::where('status', 'pending')->latest()->get());
    }

    /**
     * Approve a categorization suggestion.
     */
    public function approve(Request $request, $id)
    {
        $request->validate([
            'category_name' => 'required|string|max:255',
            'subcategory_name' => 'required|string|max:255',
        ]);

        $pending = PendingCategory::findOrFail($id);

        return DB::transaction(function () use ($request, $pending) {
            // 1. Find or create the category
            $category = Category::firstOrCreate(['name' => $request->category_name]);

            // 2. Find or create the subcategory
            $subCategory = SubCategory::firstOrCreate([
                'category_id' => $category->id,
                'name' => $request->subcategory_name
            ]);

            // 3. Mark suggestion as approved
            $pending->update([
                'status' => 'approved',
                'suggested_category' => $request->category_name,
                'suggested_subcategory' => $request->subcategory_name
            ]);

            // 4. Retro-compatibility: Update all candidates with this exact title
            Candidate::where('position_searched', $pending->original_title)
                ->whereHas('category', function($q) {
                    $q->where('name', 'À classifier');
                })
                ->update([
                    'category_id' => $category->id,
                    'sub_category_id' => $subCategory->id
                ]);

            return response()->json([
                'message' => 'Catégorisation approuvée et mise à jour des candidats effectuée.',
                'category' => $category,
                'sub_category' => $subCategory
            ]);
        });
    }

    /**
     * Reject a categorization suggestion.
     */
    public function reject($id)
    {
        $pending = PendingCategory::findOrFail($id);
        $pending->update(['status' => 'rejected']);

        return response()->json(['message' => 'Suggestion rejetée.']);
    }
}
