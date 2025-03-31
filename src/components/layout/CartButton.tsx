'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { HiMinus, HiPlus, HiX } from 'react-icons/hi';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartButton() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close cart when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
        aria-label="Shopping cart"
      >
        <BsCart3 className="w-6 h-6" />
        {isMounted && totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
            {totalItems}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-200"
          style={{ zIndex: 40 }}
        />
      )}

      {/* Cart Preview Modal */}
      <div 
        ref={cartRef}
        className={`absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 transition-all duration-200 transform ${
          isCartOpen ? 'translate-y-0 opacity-100 z-50' : 'translate-y-4 opacity-0 -z-10'
        }`}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close cart"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!isMounted ? (
            <div className="p-4 text-center text-gray-500">
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 animate-fade-in"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-orange-600">${item.price.toFixed(2)}</p>
                  </div>
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
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-2 p-1"
                      aria-label="Remove item"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isMounted && items.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex justify-between mb-4">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm font-medium text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              href="/cart"
              className="block w-full bg-orange-500 text-white text-center px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              onClick={() => setIsCartOpen(false)}
            >
              View Cart & Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 