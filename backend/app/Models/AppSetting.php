<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
        'description',
        'is_public',
    ];

    protected $casts = [
        'value' => 'json',
        'is_public' => 'boolean',
    ];

    /**
     * Obtenir une valeur de configuration
     */
    public static function getValue(string $group, string $key, $default = null)
    {
        $setting = static::where('group', $group)
            ->where('key', $key)
            ->first();

        return $setting ? $setting->value : $default;
    }

    /**
     * Définir une valeur de configuration
     */
    public static function setValue(string $group, string $key, $value, string $type = 'string', string $description = null, bool $isPublic = false)
    {
        return static::updateOrCreate(
            ['group' => $group, 'key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'description' => $description,
                'is_public' => $isPublic,
            ]
        );
    }

    /**
     * Obtenir toutes les configurations d'un groupe
     */
    public static function getGroup(string $group)
    {
        return static::where('group', $group)
            ->get()
            ->pluck('value', 'key')
            ->toArray();
    }

    /**
     * Initialiser les paramètres par défaut
     */
    public static function initializeDefaults()
    {
        $defaults = [
            'email' => [
                'from_address' => ['contact@zavona-rh.com', 'email', 'Adresse email d\'expéditeur par défaut', true],
                'from_name' => ['Zavona Talenta RH', 'string', 'Nom d\'expéditeur par défaut', true],
                'reply_to_address' => [null, 'email', 'Adresse email de réponse', false],
                'reply_to_name' => [null, 'string', 'Nom pour les réponses', false],
            ],
            'company' => [
                'name' => ['Zavona Talenta RH', 'string', 'Nom de l\'entreprise', true],
                'address' => ['', 'text', 'Adresse de l\'entreprise', true],
                'phone' => ['', 'string', 'Téléphone de l\'entreprise', true],
                'website' => ['https://zavona-rh.com', 'url', 'Site web de l\'entreprise', true],
                'logo' => ['/images/logo.png', 'string', 'Chemin du logo', true],
            ],
            'application' => [
                'name' => ['Zavona Talenta RH', 'string', 'Nom de l\'application', true],
                'url' => ['http://localhost:8000', 'url', 'URL de l\'application', true],
                'locale' => ['fr', 'string', 'Langue par défaut', true],
                'timezone' => ['Europe/Paris', 'string', 'Fuseau horaire', false],
            ],
            'notifications' => [
                'email_notifications' => [true, 'boolean', 'Activer les notifications email', false],
                'sms_notifications' => [false, 'boolean', 'Activer les notifications SMS', false],
                'push_notifications' => [false, 'boolean', 'Activer les notifications push', false],
                'new_candidate_alert' => [true, 'boolean', 'Alerte nouveau candidat', false],
                'recruiter_interest_alert' => [true, 'boolean', 'Alerte intérêt recruteur', false],
            ],
            'security' => [
                'password_min_length' => [8, 'integer', 'Longueur minimale du mot de passe', false],
                'session_timeout' => [120, 'integer', 'Timeout de session (minutes)', false],
                'max_login_attempts' => [5, 'integer', 'Tentatives de connexion max', false],
                'lockout_duration' => [300, 'integer', 'Durée de verrouillage (secondes)', false],
            ],
            'features' => [
                'candidate_import' => [true, 'boolean', 'Importation de candidats', false],
                'cv_parsing' => [true, 'boolean', 'Analyse automatique de CV', false],
                'auto_categorization' => [true, 'boolean', 'Catégorisation automatique', false],
                'email_templates' => [true, 'boolean', 'Modèles d\'email', false],
                'analytics' => [false, 'boolean', 'Analytiques', false],
                'api_access' => [false, 'boolean', 'Accès API', false],
            ],
        ];

        foreach ($defaults as $group => $settings) {
            foreach ($settings as $key => $config) {
                static::setValue($group, $key, $config[0], $config[1], $config[2], $config[3]);
            }
        }
    }
}
