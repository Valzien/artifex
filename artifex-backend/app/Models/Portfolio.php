<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'image',
        'media',
    ];

    protected function casts(): array
    {
        return [
            'media' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
