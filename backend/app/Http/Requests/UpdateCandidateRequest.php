<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCandidateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'position_searched' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'contract_type' => 'nullable|string|in:CDI,CDD,Stage',
            'experience_level' => 'required|in:débutant,junior,intermédiaire,senior,expert',
            'description' => 'nullable|string',
            'status' => 'nullable|in:PENDING,ACTIVE,HIRED,ARCHIVED',
            'skills' => 'array',
            'skills.*' => 'exists:skills,id',
            'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ];
    }
}
