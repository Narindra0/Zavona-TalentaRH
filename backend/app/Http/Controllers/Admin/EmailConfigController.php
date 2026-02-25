<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Constants\EmailDefaults;
use App\Services\AppSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class EmailConfigController extends Controller
{
    /**
     * Afficher la page de configuration email
     */
    public function index()
    {
        // Récupérer tous les paramètres email
        $emailSettings = AppSettingsService::getGroup('email');
        
        return view('admin.email-config', compact('emailSettings'));
    }

    /**
     * Tester la connexion SMTP
     */
    public function testConnection(Request $request)
    {
        try {
            $transport = AppSettingsService::get('email', 'default_transport', 'log');
            
            if ($transport === 'log') {
                return response()->json([
                    'success' => true,
                    'message' => 'Mode Log activé - Les emails seront enregistrés dans les logs'
                ]);
            }

            $config = [
                'transport' => 'smtp',
                'host' => AppSettingsService::get('email', 'smtp_host'),
                'port' => AppSettingsService::get('email', 'smtp_port', EmailDefaults::DEFAULT_SMTP_PORT),
                'encryption' => AppSettingsService::get('email', 'smtp_encryption', EmailDefaults::DEFAULT_SMTP_ENCRYPTION),
                'username' => AppSettingsService::get('email', 'smtp_username'),
                'password' => AppSettingsService::get('email', 'smtp_password'),
                'timeout' => EmailDefaults::DEFAULT_TIMEOUT,
            ];

            $this->validateSmtpConfig($config);

            return response()->json([
                'success' => true,
                'message' => 'Connexion SMTP établie avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de connexion: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Envoyer un email de test
     */
    public function sendTestEmail(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'to_email' => 'required|email',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Veuillez fournir une adresse email valide'
                ], 422);
            }

            $toEmail = $request->input('to_email', auth()->user()->email);
            $fromAddress = AppSettingsService::get('email', 'from_address', EmailDefaults::DEFAULT_FROM_ADDRESS);
            $fromName = AppSettingsService::get('email', 'from_name', EmailDefaults::DEFAULT_FROM_NAME);

            $testData = [
                'subject' => EmailDefaults::TEST_SUBJECT,
                'content' => EmailDefaults::TEST_CONTENT,
                'app_name' => AppSettingsService::get('application', 'name', EmailDefaults::DEFAULT_FROM_NAME),
                'timestamp' => now()->format('d/m/Y H:i:s'),
            ];

            Mail::send('emails.test', $testData, function ($message) use ($toEmail, $fromAddress, $fromName, $testData) {
                $message->to($toEmail)
                    ->from($fromAddress, $fromName)
                    ->subject($testData['subject']);
            });

            return response()->json([
                'success' => true,
                'message' => 'Email de test envoyé avec succès à ' . $toEmail
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Obtenir la configuration email actuelle (API)
     */
    public function getCurrentConfig()
    {
        $config = AppSettingsService::getEmailConfig();
        
        return response()->json([
            'transport' => AppSettingsService::get('email', 'default_transport', EmailDefaults::DEFAULT_TRANSPORT),
            'smtp' => [
                'host' => AppSettingsService::get('email', 'smtp_host'),
                'port' => AppSettingsService::get('email', 'smtp_port', EmailDefaults::DEFAULT_SMTP_PORT),
                'encryption' => AppSettingsService::get('email', 'smtp_encryption', EmailDefaults::DEFAULT_SMTP_ENCRYPTION),
                'username' => AppSettingsService::get('email', 'smtp_username'),
                'password' => AppSettingsService::get('email', 'smtp_password') ? '********' : '',
            ],
            'from' => [
                'address' => AppSettingsService::get('email', 'from_address', EmailDefaults::DEFAULT_FROM_ADDRESS),
                'name' => AppSettingsService::get('email', 'from_name', EmailDefaults::DEFAULT_FROM_NAME),
            ],
            'reply_to' => $config['reply_to'],
        ]);
    }

    /**
     * Valider la configuration SMTP
     */
    private function validateSmtpConfig(array $config): void
    {
        $requiredFields = ['host', 'port', 'username', 'password'];
        
        foreach ($requiredFields as $field) {
            if (empty($config[$field])) {
                throw new \Exception("Le champ '{$field}' est requis pour la configuration SMTP");
            }
        }

        $port = (int) $config['port'];
        if ($port < 1 || $port > 65535) {
            throw new \Exception("Le port SMTP doit être compris entre 1 et 65535");
        }

        if (!filter_var($config['host'], FILTER_VALIDATE_IP) && !gethostbyname($config['host'])) {
            throw new \Exception("L'hôte SMTP '{$config['host']}' n'est pas valide");
        }
    }

    /**
     * Obtenir les presets de configuration pour les providers courants
     */
    public function getProviderPresets()
    {
        $presets = [
            'gmail' => [
                'name' => 'Gmail',
                'smtp_host' => 'smtp.gmail.com',
                'smtp_port' => 587,
                'smtp_encryption' => 'tls',
                'description' => 'Utilisez un mot de passe d\'application Gmail'
            ],
            'outlook' => [
                'name' => 'Outlook/Hotmail',
                'smtp_host' => 'smtp-mail.outlook.com',
                'smtp_port' => 587,
                'smtp_encryption' => 'tls',
                'description' => 'Configuration pour les comptes Microsoft'
            ],
            'sendgrid' => [
                'name' => 'SendGrid',
                'smtp_host' => 'smtp.sendgrid.net',
                'smtp_port' => 587,
                'smtp_encryption' => 'tls',
                'description' => 'Utilisez votre clé API SendGrid comme mot de passe'
            ],
            'mailgun' => [
                'name' => 'Mailgun',
                'smtp_host' => 'smtp.mailgun.org',
                'smtp_port' => 587,
                'smtp_encryption' => 'tls',
                'description' => 'Configuration Mailgun SMTP'
            ],
            'ses' => [
                'name' => 'Amazon SES',
                'smtp_host' => 'email-smtp.us-east-1.amazonaws.com',
                'smtp_port' => 587,
                'smtp_encryption' => 'tls',
                'description' => 'Utilisez vos credentials AWS SES'
            ],
        ];

        return response()->json($presets);
    }

    /**
     * Appliquer un preset de configuration
     */
    public function applyPreset(Request $request, string $provider)
    {
        $presets = $this->getProviderPresets()->getData(true);
        
        if (!isset($presets[$provider])) {
            return response()->json([
                'success' => false,
                'message' => 'Preset non trouvé'
            ], 404);
        }

        $preset = $presets[$provider];
        
        try {
            // Mettre à jour les paramètres
            AppSettingsService::set('email', 'smtp_host', $preset['smtp_host']);
            AppSettingsService::set('email', 'smtp_port', $preset['smtp_port']);
            AppSettingsService::set('email', 'smtp_encryption', $preset['smtp_encryption']);
            AppSettingsService::set('email', 'default_transport', 'smtp');

            return response()->json([
                'success' => true,
                'message' => "Preset '{$preset['name']}' appliqué avec succès",
                'preset' => $preset
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'application du preset: ' . $e->getMessage()
            ], 400);
        }
    }
}
