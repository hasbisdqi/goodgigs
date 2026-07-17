<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobProgressUpdate extends Model
{
    protected $fillable = [
        'job_posting_id',
        'user_id',
        'message',
        'image_path',
    ];

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
