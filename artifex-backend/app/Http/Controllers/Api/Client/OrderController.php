<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Order::where('client_id', $user->id)
            ->with(['freelancer:id,name,avatar', 'service:id,title', 'conversation:id,order_id'])
            ->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->get()->map(function ($order) {
            return [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'serviceName' => $order->service->title ?? 'Unknown Service',
                'type' => $order->type,
                'customMin' => $order->custom_min,
                'customMax' => $order->custom_max,
                'dealPrice' => $order->deal_price,
                'conversationId' => $order->conversation?->id,
                'price' => $order->price,
                'status' => $order->status,
                'message' => $order->message,
                'createdAt' => $order->created_at,
                'deadline' => $order->deadline,
                'deliverables' => $order->deliverables ?? [],
                'freelancer' => [
                    'id' => $order->freelancer->id,
                    'name' => $order->freelancer->name,
                    'avatar' => $order->freelancer->avatar,
                ],
            ];
        });

        return response()->json(['data' => $orders]);
    }

    public function show($id)
    {
        $order = Order::where('client_id', auth()->id())
            ->with(['freelancer:id,name,avatar,location,response_time', 'service:id,title,delivery_days', 'conversation:id,order_id'])
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'serviceName' => $order->service->title ?? 'Unknown Service',
                'type' => $order->type,
                'customMin' => $order->custom_min,
                'customMax' => $order->custom_max,
                'dealPrice' => $order->deal_price,
                'conversationId' => $order->conversation?->id,
                'price' => $order->price,
                'status' => $order->status,
                'message' => $order->message,
                'packageName' => $order->package_name,
                'createdAt' => $order->created_at,
                'deadline' => $order->deadline,
                'deliverables' => $order->deliverables ?? [],
                'reviewed' => $order->reviews()->exists(),
                'freelancer' => [
                    'id' => $order->freelancer->id,
                    'name' => $order->freelancer->name,
                    'avatar' => $order->freelancer->avatar,
                    'location' => $order->freelancer->location,
                    'responseTime' => $order->freelancer->response_time,
                ],
                'service' => [
                    'id' => $order->service->id,
                    'title' => $order->service->title,
                    'deliveryDays' => $order->service->delivery_days,
                ],
            ],
        ]);
    }
}
