<?php

namespace App\Models;

use Database\Factories\EndorsementFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['endorser_id', 'endorsee_id'])]
class Endorsement extends Model
{
    /** @use HasFactory<EndorsementFactory> */
    use HasFactory;

    public function endorser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'endorser_id');
    }

    public function endorsee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'endorsee_id');
    }
}
