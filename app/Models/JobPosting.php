<?php

namespace App\Models;

use Database\Factories\JobPostingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'title', 'company', 'description', 'location', 'salary', 'type', 'status'])]
class JobPosting extends Model
{
    /** @use HasFactory<JobPostingFactory> */
    use HasFactory;

    /**
     * Get the user (employer) that created this job posting.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
