<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\RecruiterInterestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);

// Public API routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}/sub-categories', [CategoryController::class, 'getSubCategories']);
Route::get('/candidates', [CandidateController::class, 'index']);
Route::get('/candidates/{candidate}', [CandidateController::class, 'show']); // Rendu public pour la page profil
Route::get('/candidates/{candidate}/cv', [CandidateController::class, 'viewCv'])->name('candidates.cv')->middleware('signed'); 
Route::post('/candidates', [CandidateController::class, 'store']); // Déplacé ici pour être public
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/categorize-job', [\App\Http\Controllers\JobCategorizationController::class, 'categorize']);
Route::post('/parse-cv', [\App\Http\Controllers\CvParserController::class, 'parse']);

// Recruiter Interests
Route::post('/candidates/{candidate}/interest', [RecruiterInterestController::class, 'store']);
Route::post('/candidates/{candidate}/uninterest', [RecruiterInterestController::class, 'destroy']); // Using POST to allow body with email

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Categories & Sub-categories
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::post('/categories/find-or-create', [CategoryController::class, 'findOrCreate']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    Route::post('/categories/{category}/sub-categories', [CategoryController::class, 'storeSubCategory']);
    Route::post('/sub-categories/find-or-create', [SubCategoryController::class, 'findOrCreate']);
    Route::delete('/sub-categories/{subCategory}', [CategoryController::class, 'destroySubCategory']);

    // Candidates
    Route::put('/candidates/{candidate}', [CandidateController::class, 'update']);
    Route::delete('/candidates/{candidate}', [CandidateController::class, 'destroy']);
    Route::post('/candidates/{candidate}/add-cv', [CandidateController::class, 'addCv']);
    Route::patch('/candidates/{candidate}/update-status', [CandidateController::class, 'updateStatus']);

    // Skills
    Route::post('/skills', [SkillController::class, 'store']);
    Route::post('/skills/find-or-create', [SkillController::class, 'findOrCreate']);
    Route::put('/skills/{skill}', [SkillController::class, 'update']);
    Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);

    // Categorization Manager
    Route::get('/admin/categories/manager', [\App\Http\Controllers\JobCategorizationController::class, 'manager']);
    Route::apiResource('/categories', CategoryController::class)->except(['index', 'show']); // manager handles list
    Route::apiResource('/sub-categories', SubCategoryController::class)->only(['store', 'update', 'destroy']);
    Route::post('/sub-categories/find-or-create', [\App\Http\Controllers\SubCategoryController::class, 'findOrCreate']);

    // Pending Categorizations
    Route::get('/pending-categories', [\App\Http\Controllers\PendingCategoryController::class, 'index']);
    Route::post('/pending-categories/{id}/approve', [\App\Http\Controllers\PendingCategoryController::class, 'approve']);
    Route::post('/pending-categories/{id}/reject', [\App\Http\Controllers\PendingCategoryController::class, 'reject']);

    // Admin Talent Offers
    Route::get('/admin/recruiter-interests', [RecruiterInterestController::class, 'index']);
    Route::patch('/admin/recruiter-interests/{interest}/status', [RecruiterInterestController::class, 'updateStatus']);

    // Email Configuration
    Route::get('/admin/email-templates', [\App\Http\Controllers\EmailTemplateController::class, 'index']);
    Route::get('/admin/email-templates/{template}', [\App\Http\Controllers\EmailTemplateController::class, 'show']);
    Route::put('/admin/email-templates/{template}', [\App\Http\Controllers\EmailTemplateController::class, 'update']);
    Route::post('/admin/email-templates/{template}/test', [\App\Http\Controllers\EmailTemplateController::class, 'sendTest']);
});
