@extends('emails.layout')

@section('title', 'Suivi recrutement – Mise en relation effectuée')

@section('content')
    <!-- Subject Line Banner -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
        <tr>
            <td style="background-color: #f0f4fa; border-left: 4px solid #1a2e5a; border-radius: 0 8px 8px 0; padding: 14px 20px;">
                <p style="margin: 0; color: #1a2e5a; font-size: 15px; font-weight: 700; letter-spacing: -0.2px;">
                    {{ $mailSubject }}
                </p>
            </td>
        </tr>
    </table>

    <!-- Email Body -->
    <div style="color: #3a4a5c; font-size: 15px; line-height: 1.75;">
        {!! nl2br(e($content)) !!}
    </div>
@endsection
