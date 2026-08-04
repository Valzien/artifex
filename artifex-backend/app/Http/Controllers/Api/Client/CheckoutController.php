<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Order;
use App\Models\Service;
use App\Services\NotificationService;
use App\Services\TransactionService;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function paymentMethods()
    {
        return response()->json([
            'data' => [
                ['id' => 'bank_transfer', 'name' => 'Transfer Bank', 'icon' => 'Landmark'],
                ['id' => 'e_wallet', 'name' => 'E-Wallet', 'icon' => 'Smartphone'],
                ['id' => 'credit_card', 'name' => 'Kartu Kredit', 'icon' => 'CreditCard'],
            ]
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'type' => 'sometimes|in:package,custom',
            'serviceId' => 'required|exists:services,id',
            'packageId' => 'required_if:type,package|exists:service_packages,id',
            'customMin' => 'required_if:type,custom|numeric|min:0',
            'customMax' => 'required_if:type,custom|numeric|min:0',
            'message' => 'nullable|string',
            'paymentMethod' => 'required|string',
        ]);

        $type = $validated['type'] ?? 'package';
        $service = Service::with('packages')->findOrFail($validated['serviceId']);

        if ($type === 'custom') {
            $customMin = (float) $validated['customMin'];
            $customMax = (float) $validated['customMax'];
            $dp = round($customMin * 0.4, 2);

            $order = Order::create([
                'order_code' => 'ORD-' . strtoupper(uniqid()),
                'client_id' => auth()->id(),
                'freelancer_id' => $service->user_id,
                'service_id' => $service->id,
                'package_name' => 'Custom',
                'type' => 'custom',
                'custom_min' => $customMin,
                'custom_max' => $customMax,
                'price' => $dp,
                'status' => 'pending',
                'message' => 'DP 40% dibayar di muka, harga final disepakati di chat.',
                'deadline' => now()->addDays($service->delivery_days),
            ]);

            $description = "DP 40% {$service->title} (Custom)";
        } else {
            $package = $service->packages->firstWhere('id', $validated['packageId']);
            if (!$package) {
                return response()->json(['message' => 'Paket tidak ditemukan'], 422);
            }

            $order = Order::create([
                'order_code' => 'ORD-' . strtoupper(uniqid()),
                'client_id' => auth()->id(),
                'freelancer_id' => $service->user_id,
                'service_id' => $service->id,
                'package_name' => $package->name,
                'type' => 'package',
                'price' => $package->price,
                'status' => 'pending',
                'message' => $validated['message'] ?? null,
                'deadline' => now()->addDays($package->delivery_days),
            ]);

            $description = "Pembayaran {$service->title} - {$package->name}";
        }

        TransactionService::recordPayment(
            $order->client_id,
            $order->freelancer_id,
            $order->id,
            $description,
            $order->price,
            $validated['paymentMethod'],
        );

        $conversation = Conversation::firstOrCreate(
            ['client_id' => auth()->id(), 'freelancer_id' => $service->user_id],
            ['last_message' => null, 'last_message_at' => now()],
        );
        if (!$conversation->order_id) {
            $conversation->update(['order_id' => $order->id]);
        }

        NotificationService::send(
            $order->freelancer_id,
            'new_order',
            'Pesanan Baru',
            'Kamu menerima pesanan baru: ' . $order->package_name . ' (' . $service->title . ') dari ' . auth()->user()->name . '.',
            '/freelancer/orders',
        );

        return response()->json([
            'data' => [
                'orderId' => $order->id,
                'orderCode' => $order->order_code,
                'type' => $order->type,
                'price' => $order->price,
                'conversationId' => $conversation->id,
            ],
            'message' => 'Pesanan berhasil dibuat'
        ], 201);
    }
}
