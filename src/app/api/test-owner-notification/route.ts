import { NextRequest, NextResponse } from 'next/server';
import { notifyOwner, OrderItem, CustomerDetails } from '@/utils/twilio';
import { randomUUID } from 'crypto';

// Type for request body
interface RequestBody {
  orderItems: OrderItem[];
  customerDetails: CustomerDetails;
}

export async function POST(request: NextRequest) {
  console.log('=== TEST NOTIFICATION ENDPOINT HIT ===');
  
  try {
    // Parse request body
    const body: RequestBody = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { orderItems, customerDetails } = body;

    // Validate required fields
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        { error: 'At least one order item is required' },
        { status: 400 }
      );
    }

    if (!customerDetails?.name || !customerDetails?.phone) {
      return NextResponse.json(
        { error: 'Customer name and phone are required' },
        { status: 400 }
      );
    }

    // Calculate total
    const total = orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Generate test order number
    const orderNumber = `TEST-${randomUUID().slice(0, 8)}`;
    console.log('Generated order number:', orderNumber);

    try {
      // Send WhatsApp notification
      console.log('Sending notification with:', {
        orderNumber,
        itemsCount: orderItems.length,
        total,
        customerName: customerDetails.name
      });

      await notifyOwner(orderNumber, orderItems, total, customerDetails);
      console.log('Notification sent successfully');

      return NextResponse.json({
        success: true,
        message: 'Test notification sent successfully',
        orderNumber,
        notificationDetails: {
          items: orderItems,
          total,
          customerDetails
        }
      });
    } catch (notifyError: any) {
      console.error('Error sending notification:', {
        message: notifyError.message,
        stack: notifyError.stack
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to send notification',
          details: notifyError.message 
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
        error: 'Server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 