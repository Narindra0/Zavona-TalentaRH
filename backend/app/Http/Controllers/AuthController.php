<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{


    public function register(Request $request)
    {
        $validated = $request->validate([
            'matricule' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'matricule' => $validated['matricule'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'admin', // Par défaut
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Compte créé avec succès',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            if ($request->hasSession()) {
                $request->session()->regenerate();
            }
            
            $user = Auth::user();
            return response()->json([
                'message' => 'Connexion réussie',
                'user' => $user,
            ]);
        }

        return response()->json([
            'message' => 'Identifiants incorrects.',
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        // If using sessions
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}