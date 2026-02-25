<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email de Test</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
            🎉 Email de Test Réussi
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
            {{ $app_name }}
        </p>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none;">
        
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
            <h2 style="color: #166534; margin: 0 0 10px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Configuration Email Opérationnelle
            </h2>
            <p style="color: #166534; margin: 0; font-size: 14px;">
                Votre système d'envoi d'emails est correctement configuré et fonctionne parfaitement !
            </p>
        </div>

        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">Détails du test</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #6b7280; width: 140px;">
                    Date et heure
                </td>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb;">
                    {{ $timestamp }}
                </td>
            </tr>
            <tr>
                <td style="padding: 12px; background: white; border: 1px solid #e5e7eb; font-weight: 600; color: #6b7280;">
                    Application
                </td>
                <td style="padding: 12px; background: white; border: 1px solid #e5e7eb;">
                    {{ $app_name }}
                </td>
            </tr>
            <tr>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; color: #6b7280;">
                    Transport
                </td>
                <td style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb;">
                    {{ config('mail.default') }}
                </td>
            </tr>
        </table>

        <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                Prochaines étapes
            </h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
                <li>Vous pouvez maintenant envoyer des emails aux candidats et recruteurs</li>
                <li>Configurez vos modèles d'email personnalisés</li>
                <li>Testez différents scénarios d'envoi</li>
            </ul>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin: 0;">
            {{ $content }}
        </p>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 30px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
            Cet email a été généré automatiquement par
        </p>
        <p style="color: #1f2937; margin: 0; font-weight: 600; font-size: 16px;">
            {{ $app_name }}
        </p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                Si vous ne souhaitez plus recevoir ces emails, veuillez contacter votre administrateur système.
            </p>
        </div>
    </div>

</body>
</html>
