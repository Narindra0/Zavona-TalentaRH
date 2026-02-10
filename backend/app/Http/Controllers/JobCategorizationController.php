<?php

namespace App\Http\Controllers;

use App\Services\JobCategorizationService;
use App\Models\Category;
use App\Models\PendingCategory;
use Illuminate\Http\Request;

class JobCategorizationController extends Controller
{
    protected $categorizationService;

    public function __construct(JobCategorizationService $categorizationService)
    {
        $this->categorizationService = $categorizationService;
    }

    /**
     * Categorize a job title.
     */
    public function categorize(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $result = $this->categorizationService->categorize($request->title);

        return response()->json($result);
    }

    /**
     * Get all data for the categorization manager.
     */
    public function manager()
    {
        $categories = Category::with(['subCategories' => function($q) {
            $q->orderBy('name');
        }])->orderBy('name')->get();

        $pendingCount = PendingCategory::where('status', 'pending')->count();

        return response()->json([
            'categories' => $categories,
            'pending_count' => $pendingCount
        ]);
    }
}
