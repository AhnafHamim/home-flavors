import { NextRequest, NextResponse } from 'next/server';
import { notifyOwner, CustomerDetails, OrderItem } from '@/utils/twilio';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { sourceId, orderItems, customerDetails } = body;

    // Validate required fields
    if (!customerDetails?.name || !customerDetails?.phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    // Calculate total
    const total = orderItems.reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0
    );

    // Generate order number
    const orderNumber = `ORD${Math.random().toString().slice(2, 8)}`;

    try {
      // Send notification to owner
      await notifyOwner(
        orderNumber,
        orderItems,
        total,
        customerDetails
      );

      // Here you would typically:
      // 1. Save the order to your database
      // 2. Send confirmation WhatsApp message to customer

      return NextResponse.json({
        success: true,
        orderNumber,
        message: 'Order placed successfully',
        customerPhone: process.env.TWILIO_WHATSAPP_FROM // Send Twilio number for updates
      });
    } catch (error) {
      console.error('Error processing order:', error);
      return NextResponse.json(
        { 
          error: 'Failed to process order',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in checkout route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 