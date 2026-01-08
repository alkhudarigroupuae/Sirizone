'use client';

import React, { useEffect } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CLIENT_ID, createPayPalOrder, capturePayPalPayment } from '@/lib/payment';

export default function PayPalPayment({
  amount,
  currency = 'USD',
  vendorId,
  onSuccess,
  onError
}: {
  amount: number;
  currency?: string;
  vendorId?: string;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
}) {
  const initialOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: currency,
    intent: 'capture',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        }}
        createOrder={async () => {
          try {
            const { orderId } = await createPayPalOrder(amount, currency, vendorId);
            return orderId;
          } catch (error) {
            console.error('Error creating order:', error);
            throw error;
          }
        }}
        onApprove={async (data) => {
          try {
            const details = await capturePayPalPayment(data.orderID);
            onSuccess(details);
          } catch (error) {
            console.error('Error capturing payment:', error);
            if (onError) onError(error);
          }
        }}
        onError={(err) => {
          console.error('PayPal Error:', err);
          if (onError) onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
}
