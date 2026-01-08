/**
 * Payment Integration - Stripe & PayPal
 * نظام الدفع المتكامل
 */

// Stripe Configuration
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

// PayPal Configuration
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || '';

/**
 * Create Stripe Payment Intent
 */
export async function createStripePayment(amount: number, currency: string = 'USD', metadata?: any) {
  try {
    const response = await fetch('/api/payment/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw error;
  }
}

/**
 * Create PayPal Order
 */
export async function createPayPalOrder(amount: number, currency: string = 'USD', vendorId?: string) {
  try {
    const response = await fetch('/api/payment/paypal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        vendorId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal order');
    }

    return await response.json();
  } catch (error) {
    console.error('PayPal order error:', error);
    throw error;
  }
}

/**
 * Capture PayPal Payment
 */
export async function capturePayPalPayment(orderId: string) {
  try {
    const response = await fetch('/api/payment/paypal/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId })
    });

    if (!response.ok) {
      throw new Error('Failed to capture PayPal payment');
    }

    return await response.json();
  } catch (error) {
    console.error('PayPal capture error:', error);
    throw error;
  }
}

/**
 * Split payment to vendor (for marketplace)
 * توزيع الدفعة على البائع
 */
export async function splitPaymentToVendor(
  paymentId: string,
  vendorId: string,
  amount: number,
  commission: number = 0.15 // 15% commission default
) {
  const vendorAmount = amount * (1 - commission);
  const platformFee = amount * commission;

  try {
    const response = await fetch('/api/payment/split', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        vendorId,
        vendorAmount,
        platformFee
      })
    });

    if (!response.ok) {
      throw new Error('Failed to split payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment split error:', error);
    throw error;
  }
}

/**
 * Get vendor payment methods
 */
export async function getVendorPaymentMethods(vendorId: string) {
  try {
    const response = await fetch(`/api/vendor/${vendorId}/payment-methods`);
    
    if (!response.ok) {
      throw new Error('Failed to get payment methods');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return {
      stripe: false,
      paypal: false
    };
  }
}
