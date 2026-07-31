<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'username', 'email', 'password', 'active_mode', 'bio', 'address', 'skills', 'latitude', 'longitude', 'is_identity_verified', 'verified_skills', 'is_worker_active', 'is_employer_active', 'role', 'avatar', 'title', 'rating', 'reviews_count', 'total_earnings', 'badge_status', 'kyc_status', 'kyc_id_path', 'kyc_selfie_path'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the value of the model's route key.
     */
    public function getRouteKey()
    {
        return $this->username ?: 'u-'.$this->id;
    }

    /**
     * Retrieve the model for a bound value.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     * @return Model|null
     */
    public function resolveRouteBinding($value, $field = null)
    {
        if (preg_match('/^u-(\d+)$/', $value, $matches)) {
            return $this->where('id', $matches[1])->firstOrFail();
        }

        $user = $this->where('username', $value)->first();
        if ($user) {
            return $user;
        }

        if (is_numeric($value)) {
            return $this->where('id', $value)->firstOrFail();
        }

        abort(404);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'skills' => 'array',
            'is_identity_verified' => 'boolean',
            'verified_skills' => 'array',
            'is_worker_active' => 'boolean',
            'is_employer_active' => 'boolean',
            'rating' => 'decimal:1',
            'total_earnings' => 'decimal:2',
        ];
    }

    /**
     * Get the job postings created by this user.
     */
    public function jobPostings(): HasMany
    {
        return $this->hasMany(JobPosting::class);
    }

    /**
     * Check if the user is in employer mode.
     */
    public function isEmployer(): bool
    {
        return $this->active_mode === 'employer' && $this->is_employer_active;
    }

    /**
     * Check if the user is in worker mode.
     */
    public function isWorker(): bool
    {
        return $this->active_mode === 'worker' && $this->is_worker_active;
    }

    /**
     * Check if the user has activated their employer profile.
     */
    public function hasEmployerProfile(): bool
    {
        return $this->is_employer_active;
    }

    /**
     * Check if the user has activated their worker profile.
     */
    public function hasWorkerProfile(): bool
    {
        return $this->is_worker_active;
    }

    public function workerAttendanceSessions(): HasMany
    {
        return $this->hasMany(AttendanceSession::class, 'worker_id');
    }

    public function employerAttendanceSessions(): HasMany
    {
        return $this->hasMany(AttendanceSession::class, 'employer_id');
    }

    /**
     * Get the user's computed badge status based on rating.
     */
    public function getComputedBadgeAttribute()
    {
        if ($this->badge_status) {
            return $this->badge_status; // Explicit override
        }

        if ($this->reviews_count > 0) {
            if ($this->rating >= 4.5) {
                return 'GG'; // Good Gig / Great Job
            } elseif ($this->rating < 3.0) {
                return 'BAD GIGS'; // Poor Performance / Ghosting
            }
        }

        return null;
    }

    protected $appends = ['computed_badge'];
}
