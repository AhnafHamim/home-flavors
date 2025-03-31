'use client';

import React, { useState } from 'react';
import { HiMinus, HiPlus, HiX } from 'react-icons/hi';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);

  const handleRemoveItem = (id: string) => {
    setAnimatingItemId(id);
    setTimeout(() => {
      removeFromCart(id);
      setAnimatingItemId(null);
    }, 300);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <Link
          href="/"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 ${
              animatingItemId === item.id ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
            }`}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
              <p className="text-orange-600 font-medium">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="text-gray-500 hover:text-orange-600 transition-colors p-1"
                  aria-label="Decrease quantity"
                >
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="text-sm w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="text-gray-500 hover:text-orange-600 transition-colors p-1"
                  aria-label="Increase quantity"
                >
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label="Remove item"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium text-gray-900">Subtotal</span>
          <span className="text-2xl font-bold text-orange-600">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Cart
          </button>
          <Link
            href="/checkout"
            className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
} 