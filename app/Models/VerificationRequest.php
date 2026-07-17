<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'type', 'document_path', 'skill_name', 'status', 'admin_notes'])]
class VerificationRequest extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
