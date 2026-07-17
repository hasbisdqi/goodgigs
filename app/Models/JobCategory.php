<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(JobCategory::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(JobCategory::class, 'parent_id');
    }

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }
}
