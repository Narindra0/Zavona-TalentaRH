<?php

namespace App\Constants;

class EmailDefaults
{
    public const DEFAULT_FROM_ADDRESS = 'contact@zavona-rh.com';
    public const DEFAULT_FROM_NAME = 'Zavona Talenta RH';
    public const DEFAULT_SMTP_HOST = 'smtp.gmail.com';
    public const DEFAULT_SMTP_PORT = 587;
    public const DEFAULT_SMTP_ENCRYPTION = 'tls';
    public const DEFAULT_TRANSPORT = 'log';
    public const DEFAULT_TIMEOUT = 30;
    
    public const TEST_SUBJECT = 'Email de test - Zavona Talenta RH';
    public const TEST_CONTENT = 'Ceci est un email de test pour vérifier que votre configuration email fonctionne correctement.';
    
    /**
     * Get all default email settings
     */
    public static function getAll(): array
    {
        return [
            'from_address' => self::DEFAULT_FROM_ADDRESS,
            'from_name' => self::DEFAULT_FROM_NAME,
            'smtp_host' => self::DEFAULT_SMTP_HOST,
            'smtp_port' => self::DEFAULT_SMTP_PORT,
            'smtp_encryption' => self::DEFAULT_SMTP_ENCRYPTION,
            'default_transport' => self::DEFAULT_TRANSPORT,
            'timeout' => self::DEFAULT_TIMEOUT,
        ];
    }
}
