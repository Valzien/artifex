<?php

use App\Http\Controllers\R2ProxyController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/r2/{path}', [R2ProxyController::class, 'show'])->where('path', '.*');
