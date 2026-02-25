<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Services\AppSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppSettingsController extends Controller
{
    /**
     * Validate and cast setting value by type
     */
    private function validateAndCastValue($value, string $type)
    {
        switch ($type) {
            case 'integer':
                return (int) $value;
            case 'boolean':
                return filter_var($value, FILTER_VALIDATE_BOOLEAN);
            case 'json':
                if (is_string($value)) {
                    $decoded = json_decode($value, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        throw new \InvalidArgumentException('JSON invalide');
                    }
                    return $decoded;
                }
                return $value;
            default:
                return $value;
        }
    }

    /**
     * Afficher la page des paramètres de l'application
     */
    public function index()
    {
        $settings = AppSetting::orderBy('group')->orderBy('key')->get();
        $groupedSettings = $settings->groupBy('group');
        
        return view('admin.settings.index', compact('groupedSettings'));
    }

    /**
     * Afficher les paramètres publics pour l'API
     */
    public function publicSettings()
    {
        return response()->json(AppSettingsService::getPublicSettings());
    }

    /**
     * Mettre à jour un paramètre
     */
    public function update(Request $request, string $group, string $key)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required',
            'type' => 'sometimes|in:string,integer,boolean,json,email,url,text',
            'description' => 'sometimes|string|max:255',
            'is_public' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $value = $request->input('value');
        $type = $request->input('type', 'string');
        
        try {
            $value = $this->validateAndCastValue($value, $type);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $success = AppSettingsService::set(
            $group,
            $key,
            $value,
            $type,
            $request->input('description'),
            $request->input('is_public', false)
        );

        if ($success) {
            return response()->json([
                'message' => 'Paramètre mis à jour avec succès',
                'setting' => AppSetting::where('group', $group)->where('key', $key)->first()
            ]);
        }

        return response()->json(['error' => 'Erreur lors de la mise à jour'], 500);
    }

    /**
     * Mettre à jour plusieurs paramètres à la fois
     */
    public function bulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.group' => 'required|string|max:50',
            'settings.*.key' => 'required|string|max:100',
            'settings.*.value' => 'required',
            'settings.*.type' => 'sometimes|in:string,integer,boolean,json,email,url,text',
            'settings.*.description' => 'sometimes|string|max:255',
            'settings.*.is_public' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updated = [];
        $errors = [];

        foreach ($request->input('settings') as $settingData) {
            try {
                $value = $settingData['value'];
                $type = $settingData['type'] ?? 'string';
                
                $value = $this->validateAndCastValue($value, $type);

                $success = AppSettingsService::set(
                    $settingData['group'],
                    $settingData['key'],
                    $value,
                    $type,
                    $settingData['description'] ?? null,
                    $settingData['is_public'] ?? false
                );

                if ($success) {
                    $updated[] = "{$settingData['group']}.{$settingData['key']}";
                } else {
                    $errors[] = "Erreur lors de la mise à jour de {$settingData['group']}.{$settingData['key']}";
                }
            } catch (\InvalidArgumentException $e) {
                $errors[] = "{$settingData['group']}.{$settingData['key']}: " . $e->getMessage();
            } catch (\Exception $e) {
                $errors[] = "Erreur pour {$settingData['group']}.{$settingData['key']}: " . $e->getMessage();
            }
        }

        return response()->json([
            'message' => 'Mise à jour terminée',
            'updated' => $updated,
            'errors' => $errors,
            'total_updated' => count($updated),
            'total_errors' => count($errors)
        ]);
    }

    /**
     * Obtenir un paramètre spécifique
     */
    public function getSetting(string $group, string $key)
    {
        $setting = AppSetting::where('group', $group)->where('key', $key)->first();
        
        if (!$setting) {
            return response()->json(['error' => 'Paramètre non trouvé'], 404);
        }

        return response()->json($setting);
    }

    /**
     * Supprimer un paramètre
     */
    public function delete(string $group, string $key)
    {
        $setting = AppSetting::where('group', $group)->where('key', $key)->first();
        
        if (!$setting) {
            return response()->json(['error' => 'Paramètre non trouvé'], 404);
        }

        $setting->delete();
        AppSettingsService::clearCache($group, $key);

        return response()->json(['message' => 'Paramètre supprimé avec succès']);
    }

    /**
     * Réinitialiser les paramètres par défaut
     */
    public function resetDefaults()
    {
        AppSetting::query()->delete();
        AppSettingsService::clearAllCache();
        AppSetting::initializeDefaults();

        return response()->json(['message' => 'Paramètres réinitialisés aux valeurs par défaut']);
    }

    /**
     * Vider le cache des paramètres
     */
    public function clearCache()
    {
        AppSettingsService::clearAllCache();

        return response()->json(['message' => 'Cache des paramètres vidé']);
    }
}
