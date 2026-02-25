<?php

use App\Http\Controllers\Admin\AppSettingsController;
use App\Http\Controllers\Admin\EmailConfigController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'ZTRH API is running',
        'status' => 'success'
    ]);
});

Route::get('/login', function() {
    return response()->json(['message' => 'Please login via the frontend application'], 401);
})->name('login');

// Routes publiques pour les paramètres
Route::get('/settings/public', [AppSettingsController::class, 'publicSettings']);

// The admin routes should probably be moved to api.php or adjusted here for JSON responses
// For now, let's keep it simple and just return JSON for the dashboard
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Welcome to the Admin Dashboard API']);
    });
    
    // Routes pour la gestion des paramètres applicatifs
    Route::prefix('settings')->group(function () {
        Route::get('/', [AppSettingsController::class, 'index']);
        Route::get('/{group}/{key}', [AppSettingsController::class, 'getSetting']);
        Route::put('/{group}/{key}', [AppSettingsController::class, 'update']);
        Route::delete('/{group}/{key}', [AppSettingsController::class, 'delete']);
        Route::post('/bulk-update', [AppSettingsController::class, 'bulkUpdate']);
        Route::post('/reset-defaults', [AppSettingsController::class, 'resetDefaults']);
        Route::post('/clear-cache', [AppSettingsController::class, 'clearCache']);
    });
    
    // Routes pour la configuration email
    Route::prefix('email-config')->group(function () {
        Route::get('/', [EmailConfigController::class, 'index']);
        Route::post('/test-connection', [EmailConfigController::class, 'testConnection']);
        Route::post('/send-test', [EmailConfigController::class, 'sendTestEmail']);
        Route::get('/current-config', [EmailConfigController::class, 'getCurrentConfig']);
        Route::get('/presets', [EmailConfigController::class, 'getProviderPresets']);
        Route::post('/apply-preset/{provider}', [EmailConfigController::class, 'applyPreset']);
    });
});