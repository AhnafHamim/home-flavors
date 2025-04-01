import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { notifyOwner } from '@/utils/twilio';
import { squareClient } from '@/utils/square';

// Define types for request body
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
}

interface PaymentRequestBody {
  sourceId: string;
  orderItems: OrderItem[];
  customerDetails: CustomerDetails;
}

export async function POST(request: Request) {
  try {
    const body: PaymentRequestBody = await request.json();
    const { sourceId, orderItems, customerDetails } = body;

    if (!sourceId || !orderItems || !customerDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Generate unique order reference
    const orderReference = `ORD${Date.now().toString().slice(-8)}`;

    // Create payment with Square
    try {
      const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
      if (!locationId) {
        throw new Error('Square location ID is not configured');
      }

      console.log('Creating Square Order...');
      
      // First create the order in Square
      const orderResponse = await squareClient.orders.create({
        idempotencyKey: randomUUID(),
        order: {
          locationId,
          referenceId: orderReference,
          lineItems: orderItems.map(item => ({
            name: item.name,
            quantity: item.quantity.toString(),
            basePriceMoney: {
              amount: BigInt(Math.round(item.price * 100)), // Convert to cents
              currency: 'USD'
            }
          })),
          state: 'OPEN'
        }
      });

      if (!orderResponse.order?.id) {
        throw new Error('Failed to create Square order');
      }

      const squareOrderId = orderResponse.order.id;
      console.log('Square Order created:', { squareOrderId, orderReference });

      // Now process the payment
      console.log('Processing payment:', {
        orderId: squareOrderId,
        amount: totalAmount,
        locationId
      });

      const payment = await squareClient.payments.create({
        sourceId,
        idempotencyKey: randomUUID(),
        amountMoney: {
          amount: BigInt(Math.round(totalAmount * 100)), // Convert to cents and round
          currency: 'USD'
        },
        locationId,
        orderId: squareOrderId,
        note: `Order for ${customerDetails.name}`
      });

      // Notify owner about the new order
      await notifyOwner(orderReference, orderItems, totalAmount, customerDetails);

      return NextResponse.json({
        success: true,
        orderId: orderReference,
        squareOrderId,
        paymentId: payment.payment?.id,
        status: payment.payment?.status
      });
    } catch (error: any) {
      console.error('Square API error:', error);
      
      if (error?.errors) {
        return NextResponse.json(
          { 
            error: 'Order/Payment processing failed',
            details: error.errors.map((e: { code: string; detail: string }) => ({
              code: e.code,
              detail: e.detail
            }))
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Order/Payment processing failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 