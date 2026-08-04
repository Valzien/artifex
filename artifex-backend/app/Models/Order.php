<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'client_id',
        'freelancer_id',
        'service_id',
        'package_name',
        'type',
        'custom_min',
        'custom_max',
        'deal_price',
        'price',
        'status',
        'message',
        'deadline',
        'deliverables',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
            'deliverables' => 'array',
        ];
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function conversation()
    {
        return $this->hasOne(Conversation::class, 'order_id');
    }

    public function reviews()
    {
        return $this->hasOne(Review::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
