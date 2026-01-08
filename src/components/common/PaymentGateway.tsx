'use client';

import React, { useState } from 'react';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';
import MockPayment from './MockPayment';
import { STRIPE_PUBLIC_KEY, PAYPAL_CLIENT_ID } from '@/lib/payment';

export default function PaymentGateway({
  amount,
  vendorId,
  onSuccess
}: {
  amount: number;
  vendorId?: string;
  onSuccess: (paymentDetails: any) => void;
}) {
  const stripeReady = Boolean(STRIPE_PUBLIC_KEY);
  const paypalReady = Boolean(PAYPAL_CLIENT_ID);
  const hasRealGateway = stripeReady || paypalReady;
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'paypal' | 'mock'>(
    stripeReady ? 'stripe' : paypalReady ? 'paypal' : 'mock'
  );

  return (
    <div className="payment-gateway">
      <h4 className="mb-4">اختر طريقة الدفع</h4>
      
      <div className="payment-methods mb-4">
        <div className="btn-group w-100" role="group">
          {stripeReady && (
            <button
              type="button"
              className={`btn ${selectedMethod === 'stripe' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedMethod('stripe')}
            >
              <i className="fa-brands fa-cc-stripe"></i> بطاقة ائتمان
            </button>
          )}
          {paypalReady && (
            <button
              type="button"
              className={`btn ${selectedMethod === 'paypal' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedMethod('paypal')}
            >
              <i className="fa-brands fa-paypal"></i> PayPal
            </button>
          )}
          {!hasRealGateway && (
            <button
              type="button"
              className={`btn ${selectedMethod === 'mock' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedMethod('mock')}
            >
              وضع تجريبي
            </button>
          )}
        </div>
      </div>

      <div className="payment-form">
        {selectedMethod === 'stripe' && stripeReady && (
          <StripePayment
            amount={amount}
            onSuccess={() => onSuccess({ method: 'stripe', amount })}
          />
        )}

        {selectedMethod === 'paypal' && paypalReady && (
          <PayPalPayment
            amount={amount}
            vendorId={vendorId}
            onSuccess={(details) => onSuccess({ method: 'paypal', ...details })}
            onError={(error) => console.error('Payment error:', error)}
          />
        )}

        {selectedMethod === 'mock' && !hasRealGateway && (
          <MockPayment
            amount={amount}
            onSuccess={(details) => onSuccess({ method: 'mock', ...details })}
          />
        )}
      </div>

      <div className="payment-security mt-4 text-center">
        <small className="text-muted">
          <i className="fa-solid fa-lock"></i> جميع المعاملات آمنة ومشفرة
          {!hasRealGateway && ' (وضع تجربة بلا خصم فعلي)'}
        </small>
      </div>
    </div>
  );
}
