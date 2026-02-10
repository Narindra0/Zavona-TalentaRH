<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{


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