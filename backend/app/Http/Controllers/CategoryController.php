<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('subCategories')->get();
        return response()->json($categories);
    }

    // Removal of create method as it is not needed for API

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create($request->only('name'));

        return response()->json([
            'message' => 'Catégorie créée avec succès.',
            'data' => $category
        ], 201);
    }

    // Removal of edit method as it is not needed for API

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update($request->only('name'));

        return response()->json([
            'message' => 'Catégorie mise à jour avec succès.',
            'data' => $category
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json([
            'message' => 'Catégorie supprimée avec succès.'
        ]);
    }
    public function storeSubCategory(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $subCategory = $category->subCategories()->create($request->only('name'));

        return response()->json([
            'message' => 'Sous-catégorie ajoutée avec succès.',
            'data' => $subCategory
        ], 201);
    }

    public function destroySubCategory(SubCategory $subCategory)
    {
        $subCategory->delete();
        return response()->json([
            'message' => 'Sous-catégorie supprimée avec succès.'
        ]);
    }
    public function getSubCategories($category)
    {
        $subCategories = SubCategory::where('category_id', $category)->get();
        return response()->json($subCategories);
    }

    public function findOrCreate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::firstOrCreate(
            ['name' => $request->name]
        );

        return response()->json($category);
    }
}