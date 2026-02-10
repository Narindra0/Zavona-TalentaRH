<?php

namespace App\Mail;

use App\Models\RecruiterInterest;
use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;

class RecruiterContactedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $interest;
    public $content;
    public $mailSubject;
    public $senderEmail;

    public function __construct(RecruiterInterest $interest)
    {
        $this->interest = $interest;
        $template = EmailTemplate::where('name', 'recruiter_contacted')->first();

        if (!$template) {
            // Fallback or generic content if template is missing
            $this->mailSubject = "Mise en relation avec un talent";
            $this->content = "Bonjour, nous avons bien reçu votre intérêt. Un consultant va vous contacter.";
            $this->senderEmail = config('mail.from.address');
        } else {
            $this->mailSubject = $this->replaceVariables($template->subject);
            $this->content = $this->replaceVariables($template->body);
            $this->senderEmail = $template->sender_email ?? config('mail.from.address');
        }
    }

    protected function replaceVariables($text)
    {
        $variables = [
            '{recruiter_name}' => $this->interest->recruiter_name ?? $this->interest->email,
            '{talent_name}' => $this->interest->candidate->first_name . ' ' . $this->interest->candidate->last_name,
            '{company}' => $this->interest->company_name,
        ];

        return str_replace(array_keys($variables), array_values($variables), $text);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: $this->senderEmail,
            subject: $this->mailSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.recruiter_contacted',
            with: [
                'mailSubject' => $this->mailSubject,
                'content' => $this->content,
            ],
        );
    }
}
