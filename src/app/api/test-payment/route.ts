import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { notifyOwner } from '@/utils/twilio';
import { squareClient } from '@/utils/square';

// TypeScript interfaces
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
}

interface TestPaymentRequest {
  orderItems: OrderItem[];
  customerDetails: CustomerDetails;
}

export async function POST(request: Request) {
  console.log('=== TEST PAYMENT ENDPOINT HIT ===');
  
  try {
    console.log('Parsing request body...');
    const body: TestPaymentRequest = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { orderItems, customerDetails } = body;

    // Validate required fields
    console.log('Validating fields...');
    if (!orderItems?.length) {
      console.log('Error: No order items provided');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          details: 'Order items are required'
        },
        { status: 400 }
      );
    }

    if (!customerDetails?.name || !customerDetails?.phone) {
      console.log('Error: Missing customer details');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          details: 'Customer name and phone are required'
        },
        { status: 400 }
      );
    }

    // Calculate total amount
    console.log('Calculating total amount...');
    const amount = orderItems.reduce(
      (total: number, item: OrderItem) => total + item.price * item.quantity,
      0
    );
    console.log('Total amount:', amount);

    // Generate order number first
    const orderNumber = `ORD${Date.now().toString().slice(-8)}`;
    console.log('Generated order number:', orderNumber);

    try {
      // Process payment with Square using test card nonce
      console.log('Processing payment with Square...', {
        orderId: orderNumber,
        amount: amount,
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
      });

        const payment = await squareClient.payments.create({
        sourceId: 'cnon:card-nonce-ok', // Square's test card nonce
        idempotencyKey: randomUUID(),
        amountMoney: {
          amount: BigInt(Math.round(amount * 100)), // Convert to cents
          currency: 'USD',
        },
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
        orderId: orderNumber,
        note: 'Test payment using card-nonce-ok',
      });

      console.log('Square payment response:', JSON.stringify(payment, null, 2));

      if (payment.payment) {
        // Payment successful
        const paymentResult = payment.payment;
        console.log('Payment successful, preparing to send notification');

        // Log environment variables (without sensitive data)
        console.log('Environment check:', {
          hasTwilioSid: !!process.env.TWILIO_ACCOUNT_SID,
          hasTwilioToken: !!process.env.TWILIO_AUTH_TOKEN,
          hasTwilioFrom: !!process.env.TWILIO_WHATSAPP_FROM,
          hasOwnerNumber: !!process.env.OWNER_WHATSAPP_NUMBER
        });

        // Send WhatsApp notification
        console.log('Sending notification with:', {
          orderNumber,
          itemsCount: orderItems.length,
          amount,
          customerName: customerDetails.name
        });
        
        try {
          await notifyOwner(orderNumber, orderItems, amount, customerDetails);
          console.log('Notification sent successfully');
        } catch (notifyError: any) {
          console.error('Error sending notification:', {
            message: notifyError.message,
            stack: notifyError.stack
          });
          // Continue with the response even if notification fails
        }

        return NextResponse.json({
          success: true,
          message: 'Test payment processed successfully',
          orderNumber,
          paymentDetails: {
            id: paymentResult.id,
            status: paymentResult.status,
            amount: amount,
            currency: 'USD',
            createdAt: paymentResult.createdAt,
          },
          customerDetails,
          orderItems,
        });
      } else {
        console.log('Payment creation failed - no payment in result');
        throw new Error('Payment creation failed');
      }
    } catch (error: any) {
      console.error('Square payment error:', {
        message: error.message,
        stack: error.stack
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment processing failed',
          details: error.message || 'Unknown payment error'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server error:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error',
        details: error.message || 'Unknown server error'
      },
      { status: 500 }
    );
  }
} 