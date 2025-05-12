
/**
 * Payment related types for the RentInLondon4U application
 */

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type PaymentMethod = 'stripe' | 'paypal' | 'manual';

export interface Payment {
  id: string;
  subscriptionId?: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  invoiceId?: string;
  createdAt: string;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
}

export interface PaypalCheckoutSession {
  id: string;
  approvalUrl: string;
}
