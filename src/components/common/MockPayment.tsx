"use client";

import React from "react";

export default function MockPayment({
  amount,
  currency = "USD",
  onSuccess
}: {
  amount: number;
  currency?: string;
  onSuccess: (details: any) => void;
}) {
  const handleMockPay = () => {
    const fakeDetails = {
      id: `test_${Date.now()}`,
      amount,
      currency,
      status: "succeeded",
    };
    onSuccess(fakeDetails);
  };

  return (
    <div className="alert alert-info">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span>وضع تجربة — لا يتم خصم فعلي.</span>
        <span className="badge bg-secondary">Test</span>
      </div>
      <button className="btn btn-primary w-100" onClick={handleMockPay}>
        إتمام الدفع التجريبي ({amount.toFixed(2)} {currency})
      </button>
    </div>
  );
}
