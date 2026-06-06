// Mock Razorpay — simulates payment flow without real payment processing.
// No API keys needed.

export interface CreateOrderParams {
  amountInr: number;
  credits: number;
  userId: string;
}

export async function createOrder(_params: CreateOrderParams) {
  // Return a mock Razorpay order
  return {
    id: "order_mock_" + Date.now(),
    amount: _params.amountInr * 100,
    currency: "INR",
    receipt: `credits_${_params.credits}_${_params.userId}_${Date.now()}`,
  };
}

export function verifyPaymentSignature(
  _orderId: string,
  _paymentId: string,
  _signature: string
): boolean {
  // Always return true in mock mode
  return true;
}

export const CREDIT_PACKS = [
  { credits: 5, price: 99, label: "Starter" },
  { credits: 12, price: 199, label: "Popular", recommended: true },
  { credits: 35, price: 499, label: "Business" },
];
