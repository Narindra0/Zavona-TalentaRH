<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isAdmin = auth('sanctum')->check();

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            // Masking sensitive data for guests
            'email' => $isAdmin ? $this->email : 'Contactez-nous via ZANOVA',
            'phone' => $isAdmin ? $this->phone : 'Contactez-nous via ZANOVA',
            'position_searched' => $this->position_searched,
            'description' => $this->description,
            'status' => $this->status,
            'contract_type' => $this->contract_type,
            'experience_level' => $this->experience_level,
            'category_id' => $this->category_id,
            'sub_category_id' => $this->sub_category_id,
            'category' => $this->whenLoaded('category'),
            'sub_category' => $this->whenLoaded('subCategory'),
            'skills' => $this->whenLoaded('skills'),
            'cv_files' => $this->whenLoaded('cvFiles'),
            'recruiter_interests' => $isAdmin ? $this->whenLoaded('recruiterInterests') : [],
            'signed_cv_url' => $this->signed_cv_url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
