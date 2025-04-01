import { NextResponse } from 'next/server';
import { processPayment } from '@/utils/square';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceId, amount, currency, orderId } = body;

    const paymentResult = await processPayment({
      sourceId,
      amount,
      currency,
      orderId,
    });

    return NextResponse.json(paymentResult);
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment processing failed' },
      { status: 400 }
    );
  }
} 