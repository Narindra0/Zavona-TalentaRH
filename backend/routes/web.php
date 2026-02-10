<?php

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

// The admin routes should probably be moved to api.php or adjusted here for JSON responses
// For now, let's keep it simple and just return JSON for the dashboard
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Welcome to the Admin Dashboard API']);
    });
});