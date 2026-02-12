<?php

namespace App\Http\Controllers;

use App\Services\CvParserService;
use Illuminate\Http\Request;

class CvParserController extends Controller
{
    protected $cvParserService;

    public function __construct(CvParserService $cvParserService)
    {
        $this->cvParserService = $cvParserService;
    }

    /**
     * Parse a CV file and return extracted data.
     */
    public function parse(Request $request)
    {
        $request->validate([
            'cv_file' => 'required|file|mimes:pdf|max:2048',
        ]);

        $file = $request->file('cv_file');
        
        // The pathname points to the temporary file
        $result = $this->cvParserService->parse($file->getPathname());

        \Log::info('CV Parsing Result:', $result);

        return response()->json($result);
    }
}
