import { NextResponse } from 'next/server';
import { processPayment } from '@/utils/square';
import { notifyOwner } from '@/utils/twilio';
import { OrderItem, CustomerDetails } from '@/utils/twilio';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceId, orderItems, customerDetails } = body;

    if (!sourceId || !orderItems || !customerDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const total = orderItems.reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0
    );

    // Generate order number
    const orderNumber = `ORD${Math.random().toString().slice(2, 8)}`;

    // Process payment
    const paymentResult = await processPayment({
      amount: total,
      currency: 'USD',
      orderId: orderNumber,
      sourceId
    });

    // If payment successful, notify owner
    if (paymentResult.payment?.status === 'COMPLETED') {
      await notifyOwner(
        orderNumber,
        orderItems,
        total,
        customerDetails
      );

      return NextResponse.json({
        success: true,
        orderNumber,
        paymentId: paymentResult.payment.id
      });
    }

    return NextResponse.json(
      { error: 'Payment failed', details: paymentResult },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
} 