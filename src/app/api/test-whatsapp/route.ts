import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, OrderStatus, messageTemplates } from '@/utils/twilio';

// Type for request body
type RequestBody = {
  to: string;
  status: OrderStatus;
  orderNumber?: string;
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json() as RequestBody;
    const { to, status, orderNumber } = body;

    // Validate required fields
    if (!to) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Order status is required' },
        { status: 400 }
      );
    }

    // Validate status is a valid template type
    if (!Object.keys(messageTemplates).includes(status)) {
      return NextResponse.json(
        { 
          error: 'Invalid status',
          validStatuses: Object.keys(messageTemplates)
        },
        { status: 400 }
      );
    }

    // Use provided order number or generate a test one
    const finalOrderNumber = orderNumber || `TEST${Date.now().toString().slice(-6)}`;

    try {
      // Send WhatsApp message using the specified template
      const messageSid = await sendWhatsAppMessage(
        to,
        status,
        finalOrderNumber
      );

      return NextResponse.json({
        success: true,
        messageSid,
        message: 'WhatsApp message sent successfully',
        details: {
          to: `whatsapp:${to}`,
          status,
          orderNumber: finalOrderNumber,
          template: messageTemplates[status](finalOrderNumber).trim()
        }
      });
    } catch (error) {
      // Handle WhatsApp sending errors
      if (error instanceof Error) {
        return NextResponse.json(
          { 
            error: error.message,
            type: 'WhatsAppError'
          },
          { status: 400 }
        );
      }
      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    // Handle general errors
    console.error('Error in test-whatsapp route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        type: 'ServerError'
      },
      { status: 500 }
    );
  }
} 