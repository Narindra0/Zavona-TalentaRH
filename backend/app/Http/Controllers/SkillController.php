<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::latest()->get();
        return response()->json($skills);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:skills',
        ]);

        $skill = Skill::create($request->only('name'));

        return response()->json([
            'message' => 'Compétence créée avec succès.',
            'data' => $skill
        ], 201);
    }

    public function update(Request $request, Skill $skill)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:skills,name,' . $skill->id,
        ]);

        $skill->update($request->only('name'));

        return response()->json([
            'message' => 'Compétence mise à jour avec succès.',
            'data' => $skill
        ]);
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();

        return response()->json([
            'message' => 'Compétence supprimée avec succès.'
        ]);
    }
    public function findOrCreate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $skill = Skill::firstOrCreate(
            ['name' => $request->name]
        );

        return response()->json($skill);
    }
}