<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicePackage extends Model
{
    use HasFactory;

    protected $table = 'service_packages';

    protected $fillable = [
        'service_id',
        'name',
        'price',
        'description',
        'delivery_days',
        'popular',
        'features',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'popular' => 'boolean',
        ];
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
