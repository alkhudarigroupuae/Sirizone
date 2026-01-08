'use client';

import React, { useState } from 'react';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';

export default function PaymentGateway({
  amount,
  vendorId,
  onSuccess
}: {
  amount: number;
  vendorId?: string;
  onSuccess: (paymentDetails: any) => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'paypal'>('stripe');

  return (
    <div className="payment-gateway">
      <h4 className="mb-4">اختر طريقة الدفع</h4>
      
      <div className="payment-methods mb-4">
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className={`btn ${selectedMethod === 'stripe' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedMethod('stripe')}
          >
            <i className="fa-brands fa-cc-stripe"></i> بطاقة ائتمان
          </button>
          <button
            type="button"
            className={`btn ${selectedMethod === 'paypal' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedMethod('paypal')}
          >
            <i className="fa-brands fa-paypal"></i> PayPal
          </button>
        </div>
      </div>

      <div className="payment-form">
        {selectedMethod === 'stripe' && (
          <StripePayment
            amount={amount}
            onSuccess={() => onSuccess({ method: 'stripe', amount })}
          />
        )}

        {selectedMethod === 'paypal' && (
          <PayPalPayment
            amount={amount}
            vendorId={vendorId}
            onSuccess={(details) => onSuccess({ method: 'paypal', ...details })}
            onError={(error) => console.error('Payment error:', error)}
          />
        )}
      </div>

      <div className="payment-security mt-4 text-center">
        <small className="text-muted">
          <i className="fa-solid fa-lock"></i> جميع المعاملات آمنة ومشفرة
        </small>
      </div>
    </div>
  );
}
