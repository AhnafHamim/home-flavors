'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CheckoutPaymentForm from '@/components/CheckoutPaymentForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle empty cart redirect
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const handlePaymentSubmit = async (token: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: token,
          orderItems: items,
          customerDetails: {
            name,
            phone,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        router.push(`/checkout/confirmation?orderNumber=${data.orderNumber}`);
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      console.error('Payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything while redirecting for empty cart
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="space-y-6">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          <div className="mb-4">
            <div className="text-lg font-medium">
              Total Amount: ${totalPrice.toFixed(2)}
            </div>
          </div>
          <CheckoutPaymentForm
            onError={setError}
            onSubmit={handlePaymentSubmit}
            isLoading={isLoading}
          />
          {error && (
            <div className="text-red-500 text-sm mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 