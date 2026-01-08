'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STRIPE_PUBLIC_KEY, createStripePayment } from '@/lib/payment';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

function CheckoutForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <PaymentElement />
      
      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="rts-btn btn-primary w-100 mt-4"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function StripePayment({
  amount,
  onSuccess
}: {
  amount: number;
  onSuccess: () => void;
}) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    initializePayment();
  }, [amount]);

  const initializePayment = async () => {
    setLoading(true);
    try {
      const { clientSecret } = await createStripePayment(amount);
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !clientSecret) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}
