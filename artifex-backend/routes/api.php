<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Api\Client\ChatController as ClientChatController;
use App\Http\Controllers\Api\Client\CheckoutController as ClientCheckoutController;
use App\Http\Controllers\Api\Client\CartController as ClientCartController;
use App\Http\Controllers\Api\Client\ProductCheckoutController as ClientProductCheckoutController;
use App\Http\Controllers\Api\Client\DashboardController as ClientDashboardController;
use App\Http\Controllers\Api\Client\FavoriteController as ClientFavoriteController;
use App\Http\Controllers\Api\Client\NotificationController as ClientNotificationController;
use App\Http\Controllers\Api\Client\OrderController as ClientOrderController;
use App\Http\Controllers\Api\Client\ProfileController as ClientProfileController;
use App\Http\Controllers\Api\Client\SettingController as ClientSettingController;
use App\Http\Controllers\Api\Client\TransactionController as ClientTransactionController;
use App\Http\Controllers\Api\Client\ReviewController as ClientReviewController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\AnalyticsController as AdminAnalyticsController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Api\Admin\WithdrawalController as AdminWithdrawalController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\Freelancer\DashboardController as FreelancerDashboardController;
use App\Http\Controllers\Api\Freelancer\EarningController as FreelancerEarningController;
use App\Http\Controllers\Api\Freelancer\OrderController as FreelancerOrderController;
use App\Http\Controllers\Api\Freelancer\PortfolioController as FreelancerPortfolioController;
use App\Http\Controllers\Api\Freelancer\ProductController as FreelancerProductController;
use App\Http\Controllers\Api\Freelancer\ReviewController as FreelancerReviewController;
use App\Http\Controllers\Api\Freelancer\NotificationController as FreelancerNotificationController;
use App\Http\Controllers\Api\Freelancer\ServiceController as FreelancerServiceController;
use App\Http\Controllers\Api\Freelancer\SettingController as FreelancerSettingController;
use App\Http\Controllers\Api\Freelancer\AnalyticsController as FreelancerAnalyticsController;
use App\Http\Controllers\Api\Freelancer\ChatController as FreelancerChatController;
use App\Http\Controllers\Api\FreelancerController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}/detail', [ServiceController::class, 'detail']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

Route::get('/freelancers', [FreelancerController::class, 'index']);
Route::get('/freelancers/{id}', [FreelancerController::class, 'show']);

Route::get('/faq', [FaqController::class, 'index']);

Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/portfolio/{id}', [PortfolioController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::post('/contact', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/upload', [UploadController::class, 'store']);
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

Route::middleware(['auth:sanctum', 'role:client'])->prefix('client')->group(function () {
    Route::get('/dashboard', [ClientDashboardController::class, 'index']);
    Route::get('/profile', [ClientProfileController::class, 'index']);
    Route::put('/profile', [ClientProfileController::class, 'update']);
    Route::put('/settings', [ClientSettingController::class, 'updatePassword']);
    Route::delete('/settings', [ClientSettingController::class, 'destroy']);
    Route::get('/orders', [ClientOrderController::class, 'index']);
    Route::get('/orders/{id}', [ClientOrderController::class, 'show']);
    Route::post('/orders/{orderId}/review', [ClientReviewController::class, 'store']);
    Route::get('/favorites', [ClientFavoriteController::class, 'index']);
    Route::post('/favorites/{serviceId}', [ClientFavoriteController::class, 'toggle']);
    Route::get('/notifications', [ClientNotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [ClientNotificationController::class, 'markRead']);
    Route::put('/notifications/read-all', [ClientNotificationController::class, 'markAllRead']);
    Route::get('/transactions', [ClientTransactionController::class, 'index']);
    Route::get('/chat/conversations', [ClientChatController::class, 'conversations']);
    Route::post('/chat/conversations', [ClientChatController::class, 'startConversation']);
    Route::get('/chat/{id}/messages', [ClientChatController::class, 'messages']);
    Route::post('/chat/{id}/messages', [ClientChatController::class, 'sendMessage']);
    Route::post('/chat/{conversationId}/messages/{messageId}/pay', [ClientChatController::class, 'payMessage']);
    Route::get('/checkout/payment-methods', [ClientCheckoutController::class, 'paymentMethods']);
    Route::post('/checkout', [ClientCheckoutController::class, 'create']);

    Route::get('/cart', [ClientCartController::class, 'index']);
    Route::post('/cart', [ClientCartController::class, 'add']);
    Route::delete('/cart/{id}', [ClientCartController::class, 'remove']);
    Route::delete('/cart', [ClientCartController::class, 'clear']);
    Route::post('/cart/checkout', [ClientCartController::class, 'checkout']);

    Route::post('/product-checkout', [ClientProductCheckoutController::class, 'checkout']);
    Route::get('/product-orders', [ClientProductCheckoutController::class, 'orders']);
    Route::get('/download/{token}', [ClientProductCheckoutController::class, 'download']);
});

Route::middleware(['auth:sanctum', 'role:freelancer'])->prefix('freelancer')->group(function () {
    Route::get('/dashboard', [FreelancerDashboardController::class, 'index']);
    Route::apiResource('services', FreelancerServiceController::class);
    Route::apiResource('products', FreelancerProductController::class);
    Route::apiResource('portfolio', FreelancerPortfolioController::class)->except(['show']);
    Route::get('/orders', [FreelancerOrderController::class, 'index']);
    Route::get('/orders/{id}', [FreelancerOrderController::class, 'show']);
    Route::put('/orders/{id}/status', [FreelancerOrderController::class, 'updateStatus']);
    Route::post('/orders/{id}/deliverable', [FreelancerOrderController::class, 'storeDeliverable']);
    Route::get('/earnings', [FreelancerEarningController::class, 'index']);
    Route::get('/reviews', [FreelancerReviewController::class, 'index']);
    Route::get('/notifications', [FreelancerNotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [FreelancerNotificationController::class, 'markRead']);
    Route::put('/notifications/read-all', [FreelancerNotificationController::class, 'markAllRead']);
    Route::get('/analytics', [FreelancerAnalyticsController::class, 'index']);
    Route::get('/chat/conversations', [FreelancerChatController::class, 'conversations']);
    Route::get('/chat/{id}/messages', [FreelancerChatController::class, 'messages']);
    Route::post('/chat/{id}/messages', [FreelancerChatController::class, 'sendMessage']);
    Route::put('/settings', [FreelancerSettingController::class, 'updatePassword']);
    Route::delete('/settings', [FreelancerSettingController::class, 'destroy']);
    Route::post('/withdrawals', [FreelancerEarningController::class, 'storeWithdrawal']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
    Route::get('/services', [AdminServiceController::class, 'index']);
    Route::put('/services/{id}/status', [AdminServiceController::class, 'updateStatus']);
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
    Route::get('/analytics', [AdminAnalyticsController::class, 'index']);
    Route::get('/categories', [AdminCategoryController::class, 'index']);
    Route::post('/categories', [AdminCategoryController::class, 'store']);
    Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);
    Route::get('/faqs', [AdminFaqController::class, 'index']);
    Route::post('/faqs', [AdminFaqController::class, 'store']);
    Route::put('/faqs/{id}', [AdminFaqController::class, 'update']);
    Route::delete('/faqs/{id}', [AdminFaqController::class, 'destroy']);
    Route::get('/withdrawals', [AdminWithdrawalController::class, 'index']);
    Route::put('/withdrawals/{id}/status', [AdminWithdrawalController::class, 'updateStatus']);
    Route::get('/contact-messages', [AdminContactController::class, 'index']);
    Route::put('/contact-messages/{id}/read', [AdminContactController::class, 'markRead']);
    Route::delete('/contact-messages/{id}', [AdminContactController::class, 'destroy']);
});
