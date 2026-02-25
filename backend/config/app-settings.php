<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Paramètres de l'application Zavona Talenta RH
    |--------------------------------------------------------------------------
    |
    | Ces paramètres peuvent être modifiés via l'interface d'administration
    | et sont stockés en base de données pour permettre une gestion facile
    | par les équipes RH et les administrateurs.
    |
    */

    'email' => [
        'from_address' => env('MAIL_FROM_ADDRESS', 'contact@zavona-rh.com'),
        'from_name' => env('MAIL_FROM_NAME', 'Zavona Talenta RH'),
        'reply_to_address' => env('MAIL_REPLY_TO_ADDRESS', null),
        'reply_to_name' => env('MAIL_REPLY_TO_NAME', null),
    ],

    'company' => [
        'name' => env('COMPANY_NAME', 'Zavona Talenta RH'),
        'address' => env('COMPANY_ADDRESS', ''),
        'phone' => env('COMPANY_PHONE', ''),
        'website' => env('COMPANY_WEBSITE', 'https://zavona-rh.com'),
        'logo' => env('COMPANY_LOGO', '/images/logo.png'),
    ],

    'application' => [
        'name' => env('APP_NAME', 'Zavona Talenta RH'),
        'url' => env('APP_URL', 'http://localhost:8000'),
        'locale' => env('APP_LOCALE', 'fr'),
        'timezone' => env('APP_TIMEZONE', 'Europe/Paris'),
    ],

    'notifications' => [
        'email_notifications' => true,
        'sms_notifications' => false,
        'push_notifications' => false,
        'new_candidate_alert' => true,
        'recruiter_interest_alert' => true,
    ],

    'security' => [
        'password_min_length' => 8,
        'session_timeout' => 120, // minutes
        'max_login_attempts' => 5,
        'lockout_duration' => 300, // seconds
    ],

    'features' => [
        'candidate_import' => true,
        'cv_parsing' => true,
        'auto_categorization' => true,
        'email_templates' => true,
        'analytics' => false,
        'api_access' => false,
    ],
];
