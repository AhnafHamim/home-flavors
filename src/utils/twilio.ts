import twilio from 'twilio';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../../.env.local') });

// Check for required environment variables
if (!process.env.TWILIO_ACCOUNT_SID) {
  throw new Error('TWILIO_ACCOUNT_SID is required in environment variables');
}
if (!process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('TWILIO_AUTH_TOKEN is required in environment variables');
}
if (!process.env.TWILIO_WHATSAPP_FROM) {
  throw new Error('TWILIO_WHATSAPP_FROM is required in environment variables');
}

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Message templates for different order statuses
const messageTemplates = {
  orderConfirmation: (orderNumber: string) => `
🎉 Thank you for your order #${orderNumber}!
We've received your order and will start preparing it shortly.
We'll keep you updated on its progress.
  `,
  orderInProgress: (orderNumber: string) => `
👨‍🍳 Order #${orderNumber} Update:
Your delicious meal is being prepared by our chefs.
Estimated preparation time: 20-30 minutes.
  `,
  orderReady: (orderNumber: string) => `
✅ Order #${orderNumber} is ready!
Your order is ready for pickup.
Please collect it from our counter.
Thank you for choosing Home Flavors!
  `,
  orderDelivered: (orderNumber: string) => `
🚀 Order #${orderNumber} Delivered!
We hope you enjoy your meal.
Please rate your experience and provide feedback.
  `,
  orderCancelled: (orderNumber: string) => `
❌ Order #${orderNumber} Cancelled
Your order has been cancelled as requested.
Any payment will be refunded within 3-5 business days.
  `
};

// Types for order status
export type OrderStatus = keyof typeof messageTemplates;

/**
 * Send a WhatsApp message using Twilio
 * @param to - The recipient's phone number in international format (e.g., +1234567890)
 * @param status - The order status determining which message template to use
 * @param orderNumber - The order number to include in the message
 * @returns Promise resolving to the message SID if successful
 */
export async function sendWhatsAppMessage(
  to: string,
  status: OrderStatus,
  orderNumber: string
): Promise<string> {
  try {
    // Validate phone number format
    if (!to.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error('Invalid phone number format. Must be in international format (e.g., +1234567890)');
    }

    // Get the message template
    const messageTemplate = messageTemplates[status];
    if (!messageTemplate) {
      throw new Error(`Invalid order status: ${status}`);
    }

    // Format the message
    const message = messageTemplate(orderNumber);

    // Send the message
    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${to}`
    });

    console.log(`WhatsApp message sent for order ${orderNumber}. Message SID: ${response.sid}`);
    return response.sid;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw new Error(`Failed to send WhatsApp message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export message templates for potential reuse
export { messageTemplates }; 