<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'location',
        'bio',
        'avatar',
        'is_online',
        'specialty',
        'skills',
        'languages',
        'response_time',
        'last_delivery',
        'member_since',
        'repeat_clients',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'skills' => 'array',
            'languages' => 'array',
            'is_online' => 'boolean',
            'repeat_clients' => 'integer',
        ];
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function clientOrders()
    {
        return $this->hasMany(Order::class, 'client_id');
    }

    public function freelancerOrders()
    {
        return $this->hasMany(Order::class, 'freelancer_id');
    }

    public function portfolios()
    {
        return $this->hasMany(Portfolio::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'user_id');
    }

    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'freelancer_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function clientConversations()
    {
        return $this->hasMany(Conversation::class, 'client_id');
    }

    public function freelancerConversations()
    {
        return $this->hasMany(Conversation::class, 'freelancer_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function productOrders()
    {
        return $this->hasMany(ProductOrder::class);
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    public function isFreelancer(): bool
    {
        return $this->role === 'freelancer';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
