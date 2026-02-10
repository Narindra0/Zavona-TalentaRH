<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\CvFile;

class Candidate extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'position_searched',
        'category_id',
        'sub_category_id',
        'contract_type',
        'experience_level',
        'description',
        'status'
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'candidate_skills');
    }

    public function cvFiles(): HasMany
    {
        return $this->hasMany(CvFile::class);
    }

    public function recruiterInterests(): HasMany
    {
        return $this->hasMany(RecruiterInterest::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}