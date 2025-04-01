import { SquareClient, SquareEnvironment } from 'square';

// Validate Square configuration
const accessToken = process.env.SQUARE_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('Square access token is not configured');
}

// Initialize Square client
const squareClient = new SquareClient({
  token: accessToken,
  environment: process.env.NODE_ENV === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox
});

export interface PaymentDetails {
  amount: number;
  orderId: string;
  sourceId: string; // Payment source ID from Square's Web Payment form
}

/**
 * Process a payment using Square
 * @param paymentDetails Payment information including amount and source ID
 * @returns Payment result from Square
 */
export async function processPayment(paymentDetails: PaymentDetails) {
  try {
    const { amount, orderId, sourceId } = paymentDetails;

    // Convert amount to smallest currency unit (cents)
    const amountInCents = Math.round(amount * 100);

    const payment = await squareClient.payments.create({
      sourceId,
      idempotencyKey: `${orderId}-${Date.now()}`, // Prevent duplicate payments
      amountMoney: {
        amount: BigInt(amountInCents),
        currency: 'USD'
      },
      orderId,
      autocomplete: true // Immediately capture the payment
    });

    return payment;
  } catch (error: any) {
    if (error?.errors) {
      console.error('Square API Error:', {
        message: error.message,
        errors: error.errors
      });
      throw error;
    }
    console.error('Error processing Square payment:', error);
    throw new Error('Payment processing failed');
  }
}

// Export the Square client for potential reuse
export { squareClient }; 