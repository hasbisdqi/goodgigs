<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->profileRules($this->user()->id), [
            'bio' => ['nullable', 'string', 'max:1000'],
            'address' => ['nullable', 'string', 'max:255'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:50'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_worker_active' => ['boolean'],
            'is_employer_active' => ['boolean'],
        ]);
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $isWorkerActive = $this->has('is_worker_active') ? $this->boolean('is_worker_active') : $this->user()->is_worker_active;
            $isEmployerActive = $this->has('is_employer_active') ? $this->boolean('is_employer_active') : $this->user()->is_employer_active;

            if (! $isWorkerActive && ! $isEmployerActive) {
                $validator->errors()->add(
                    'is_worker_active',
                    'Anda harus mengaktifkan setidaknya satu profil (Penyedia Jasa atau Pemberi Kerja).'
                );
            }
        });
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('skills') && is_string($this->skills)) {
            $skills = array_filter(array_map('trim', explode(',', $this->skills)));
            $this->merge([
                'skills' => empty($skills) ? null : array_values($skills),
            ]);
        }
    }
}
