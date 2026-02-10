<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    /**
     * Store a newly created subcategory.
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'keywords' => 'nullable|array'
        ]);

        $subCategory = SubCategory::create($request->all());

        return response()->json([
            'message' => 'Sous-catégorie créée avec succès.',
            'data' => $subCategory->load('category')
        ], 201);
    }

    /**
     * Update the specified subcategory.
     */
    public function update(Request $request, SubCategory $subCategory)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'keywords' => 'nullable|array',
            'category_id' => 'sometimes|required|exists:categories,id',
        ]);

        $subCategory->update($request->all());

        return response()->json([
            'message' => 'Sous-catégorie mise à jour avec succès.',
            'data' => $subCategory->load('category')
        ]);
    }

    /**
     * Remove the specified subcategory.
     */
    public function destroy(SubCategory $subCategory)
    {
        $subCategory->delete();
        return response()->json(['message' => 'Sous-catégorie supprimée avec succès.']);
    }

    /**
     * Find or create a subcategory.
     */
    public function findOrCreate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $subCategory = SubCategory::firstOrCreate(
            ['name' => $request->name, 'category_id' => $request->category_id]
        );

        return response()->json($subCategory);
    }
}
