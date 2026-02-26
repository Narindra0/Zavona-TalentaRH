<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\CvFile;
use Illuminate\Support\Facades\URL;

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
        'status',
        'rate_type',
        'daily_rate',
        'weekly_rate'
    ];

    protected $appends = ['signed_cv_url'];

    protected $casts = [
        'status' => 'string',
        'daily_rate' => 'decimal:2',
        'weekly_rate' => 'decimal:2',
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

    public function setRateTypeAttribute($value)
    {
        $this->attributes['rate_type'] = $value;
    }

    public function setRateAmountAttribute($value)
    {
        // Cette méthode sera appelée depuis le controller
        // pour assigner le montant au bon champ selon le type
    }

    public function getFormattedRateAttribute(): ?string
    {
        if (!$this->rate_type) {
            return null;
        }

        $rate = $this->rate_type === 'daily' ? $this->daily_rate : $this->weekly_rate;
        
        if (!$rate) {
            return null;
        }

        return number_format($rate, 2, ',', ' ') . ' Ar ' . 
               ($this->rate_type === 'daily' ? '/jour' : '/semaine');
    }



    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getSignedCvUrlAttribute(): ?string
    {
        if (!$this->id) return null;
        
        try {
            return URL::signedRoute('candidates.cv', ['candidate' => $this->id]);
        } catch (\Exception $e) {
            \Log::error("Error generating signed URL for candidate " . $this->id . ": " . $e->getMessage());
            return null;
        }
    }
}