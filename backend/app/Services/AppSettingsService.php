<?php

namespace App\Services;

use App\Models\AppSetting;
use Illuminate\Support\Facades\Cache;

class AppSettingsService
{
    private static $cache = [];
    private static $cacheTime = 3600; // 1 heure

    /**
     * Obtenir une valeur de configuration
     */
    public static function get(string $group, string $key, $default = null)
    {
        $cacheKey = "app_settings.{$group}.{$key}";
        
        if (isset(self::$cache[$cacheKey])) {
            return self::$cache[$cacheKey];
        }

        $value = Cache::remember($cacheKey, self::$cacheTime, function () use ($group, $key, $default) {
            return AppSetting::getValue($group, $key, $default);
        });

        self::$cache[$cacheKey] = $value;

        return $value;
    }

    /**
     * Définir une valeur de configuration
     */
    public static function set(string $group, string $key, $value, string $type = 'string', string $description = null, bool $isPublic = false): bool
    {
        $setting = AppSetting::setValue($group, $key, $value, $type, $description, $isPublic);
        
        // Vider le cache
        self::clearCache($group, $key);
        
        return $setting !== null;
    }

    /**
     * Obtenir toutes les configurations d'un groupe
     */
    public static function getGroup(string $group): array
    {
        $cacheKey = "app_settings.{$group}";
        
        if (isset(self::$cache[$cacheKey])) {
            return self::$cache[$cacheKey];
        }

        $values = Cache::remember($cacheKey, self::$cacheTime, function () use ($group) {
            return AppSetting::getGroup($group);
        });

        self::$cache[$cacheKey] = $values;

        return $values;
    }

    /**
     * Obtenir toutes les configurations publiques
     */
    public static function getPublicSettings(): array
    {
        return Cache::remember('app_settings.public', self::$cacheTime, function () {
            return AppSetting::where('is_public', true)
                ->get()
                ->groupBy('group')
                ->map(function ($group) {
                    return $group->pluck('value', 'key');
                })
                ->toArray();
        });
    }

    /**
     * Vider le cache pour une clé spécifique
     */
    public static function clearCache(string $group, string $key): void
    {
        $cacheKey = "app_settings.{$group}.{$key}";
        unset(self::$cache[$cacheKey]);
        Cache::forget($cacheKey);
        
        $groupCacheKey = "app_settings.{$group}";
        unset(self::$cache[$groupCacheKey]);
        Cache::forget($groupCacheKey);
        
        Cache::forget('app_settings.public');
    }

    /**
     * Vider tout le cache des paramètres
     */
    public static function clearAllCache(): void
    {
        self::$cache = [];
        Cache::flush();
    }

    /**
     * Obtenir la configuration email pour Laravel
     */
    public static function getEmailConfig(): array
    {
        return [
            'from' => [
                'address' => self::get('email', 'from_address', 'contact@zavona-rh.com'),
                'name' => self::get('email', 'from_name', 'Zavona Talenta RH'),
            ],
            'reply_to' => [
                'address' => self::get('email', 'reply_to_address'),
                'name' => self::get('email', 'reply_to_name'),
            ],
            'smtp' => [
                'host' => self::get('email', 'smtp_host', 'smtp.gmail.com'),
                'port' => self::get('email', 'smtp_port', 587),
                'encryption' => self::get('email', 'smtp_encryption', 'tls'),
                'username' => self::get('email', 'smtp_username', ''),
                'password' => self::get('email', 'smtp_password', ''),
            ],
        ];
    }
}
