<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use App\Models\RecruiterInterest;
use App\Mail\RecruiterContactedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailTemplateController extends Controller
{
    public function index()
    {
        return response()->json(EmailTemplate::all());
    }

    public function show(EmailTemplate $template)
    {
        return response()->json($template);
    }

    public function update(Request $request, EmailTemplate $template)
    {
        $request->validate([
            'sender_email' => 'nullable|email|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $template->update($request->only('sender_email', 'subject', 'body'));

        return response()->json([
            'message' => 'Template mis à jour avec succès.',
            'template' => $template
        ]);
    }

    public function sendTest(Request $request, EmailTemplate $template)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Create a dummy RecruiterInterest for testing
        $dummyInterest = new RecruiterInterest([
            'company_name' => 'ENTREPRISE TEST',
            'recruiter_name' => 'RECRUTEUR TEST',
            'email' => $request->email,
            'status' => 'CONTACTED'
        ]);
        
        // Mock a candidate relationship for the test email
        $dummyInterest->candidate = new \App\Models\Candidate([
            'first_name' => 'TALENT',
            'last_name' => 'TEST'
        ]);

        Mail::to($request->email)->send(new RecruiterContactedMail($dummyInterest));

        return response()->json(['message' => 'Email de test envoyé avec succès (vérifiez les logs si en local).']);
    }
}
