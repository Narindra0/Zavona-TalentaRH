<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Zanova Talenta RH')</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 32px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">

                    <!-- Header with Logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a2e5a 0%, #243b6e 100%); padding: 32px 40px; text-align: center;">
                            <img src="{{ $message->embed(public_path('images/Logo-ZTRH.png')) }}" alt="Zanova Talenta RH" width="220" style="max-width: 220px; height: auto; display: inline-block;" />
                        </td>
                    </tr>

                    <!-- Accent Bar -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #e8952e 0%, #f0a944 50%, #e8952e 100%);"></td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-top: 1px solid #e8ecf1; padding-top: 24px;">
                                        <p style="margin: 0 0 8px 0; color: #1a2e5a; font-size: 14px; font-weight: 700;">
                                            Zanova Talenta RH
                                        </p>
                                        <p style="margin: 0 0 4px 0; color: #8896ab; font-size: 12px; line-height: 1.6;">
                                            Votre partenaire en recrutement et gestion des talents
                                        </p>
                                        <p style="margin: 12px 0 0 0; color: #b0bec5; font-size: 11px;">
                                            Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

                <!-- Bottom Branding -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                    <tr>
                        <td style="padding: 20px 0; text-align: center;">
                            <p style="margin: 0; color: #b0bec5; font-size: 11px;">
                                &copy; {{ date('Y') }} Zanova Talenta RH — Tous droits réservés
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
