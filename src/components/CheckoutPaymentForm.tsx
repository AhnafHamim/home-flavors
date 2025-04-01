'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Square: any;
  }
}

interface CheckoutPaymentFormProps {
  onError: (error: string) => void;
  onSubmit: (token: string) => Promise<void>;
  isLoading: boolean;
}

export default function CheckoutPaymentForm({ onError, onSubmit, isLoading }: CheckoutPaymentFormProps) {
  const cardRef = useRef<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const loadSquareScript = async () => {
      try {
        // Check if script is already loaded
        if (window.Square) {
          return;
        }

        // Load Square.js
        const script = document.createElement('script');
        script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
        script.async = true;

        const loadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Square SDK'));
        });

        document.head.appendChild(script);
        await loadPromise;
      } catch (error) {
        throw new Error('Failed to load Square SDK');
      }
    };

    const initializeSquare = async () => {
      try {
        await loadSquareScript();

        // Wait for Square to be fully loaded
        if (!window.Square) {
          throw new Error('Square SDK not loaded');
        }

        // Initialize payments
        const payments = window.Square.payments(
          process.env.NEXT_PUBLIC_SQUARE_APP_ID,
          process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
        );

        // Clean up existing card if it exists
        if (cardRef.current) {
          await cardRef.current.destroy();
          cardRef.current = null;
        }

        // Create and attach card
        const cardElement = document.getElementById('card-container');
        if (isSubscribed && cardElement) {
          const card = await payments.card();
          await card.attach(cardElement);
          cardRef.current = card;
          setIsInitializing(false);
        }
      } catch (error) {
        console.error('Error initializing Square payment form:', error);
        if (isSubscribed) {
          onError('Failed to initialize payment form');
          setIsInitializing(false);
        }
      }
    };

    initializeSquare();

    return () => {
      isSubscribed = false;
      if (cardRef.current) {
        cardRef.current.destroy();
      }
    };
  }, [onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardRef.current) {
      onError('Payment form not initialized');
      return;
    }

    try {
      const result = await cardRef.current.tokenize();
      if (result.status === 'OK') {
        await onSubmit(result.token);
      } else {
        throw new Error(result.errors[0].message);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative min-h-[150px] bg-white rounded-md">
        {isInitializing ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-md">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : null}
        <div 
          id="card-container" 
          className={`p-4 border rounded-md ${isInitializing ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || isInitializing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
} 