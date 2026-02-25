<?php

namespace App\Providers;

use App\Services\AppSettingsService;
use Illuminate\Support\ServiceProvider;

class AppSettingsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Fusionner la configuration des paramètres de l'application
        $this->mergeConfigFrom(
            config_path('app-settings.php'), 
            'app-settings'
        );

        // Charger les paramètres depuis la base de données et les fusionner
        if (app()->environment() !== 'testing' && $this->app->bound('db')) {
            $this->loadSettingsFromDatabase();
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Publier la configuration si nécessaire
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../../config/app-settings.php' => config_path('app-settings.php'),
            ], 'app-settings');
        }
    }

    /**
     * Charger les paramètres depuis la base de données
     */
    private function loadSettingsFromDatabase(): void
    {
        try {
            // Remplacer les valeurs de configuration par celles de la base de données
            $settings = AppSettingsService::getPublicSettings();
            
            foreach ($settings as $group => $values) {
                config(["app-settings.{$group}" => array_merge(
                    config("app-settings.{$group}", []),
                    $values
                )]);
            }

            // Mettre à jour la configuration mail avec les valeurs de la base de données
            $emailConfig = AppSettingsService::getEmailConfig();
            config(['mail.from' => $emailConfig['from']]);
            
            if ($emailConfig['reply_to']['address']) {
                config(['mail.reply_to' => $emailConfig['reply_to']]);
            }

        } catch (\Exception $e) {
            // En cas d'erreur (par exemple si la table n'existe pas encore),
            // on utilise les valeurs par défaut du fichier de configuration
            logger()->warning('Impossible de charger les paramètres depuis la base de données: ' . $e->getMessage());
        }
    }
}
