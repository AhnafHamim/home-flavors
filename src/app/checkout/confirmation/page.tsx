'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HiCheckCircle, HiHome, HiPhone, HiClock, HiIdentification } from 'react-icons/hi';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const orderTime = new Date().toLocaleTimeString();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success Icon and Main Message */}
      <div className="text-center mb-10">
        <div className="mb-6">
          <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Successfully Placed!
        </h1>
        <p className="text-lg text-gray-600">
          Thank you for choosing Home Flavors
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <HiIdentification className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium text-gray-900">#{orderNumber}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Order Time:</span>
            <span className="font-medium text-gray-900">{orderTime}</span>
          </div>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-orange-50 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HiPhone className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Order Updates & Support</h2>
        </div>
        <p className="text-gray-600 mb-4">
          For order updates or any questions, you can contact us via WhatsApp:
        </p>
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">WhatsApp Support</p>
            <p className="text-orange-600 font-medium">+1 (415) 523-8886</p>
          </div>
          <div className="text-xs text-gray-500">
            Available 9 AM - 10 PM
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Please include your order number #{orderNumber} in your message
        </p>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HiClock className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-600">Order Received</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <p className="text-sm text-gray-400">Preparing</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <p className="text-sm text-gray-400">Ready for Pickup</p>
          </div>
        </div>
      </div>

      {/* Return to Home Button */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <HiHome className="w-5 h-5" />
          Return to Menu
        </Link>
      </div>
    </div>
  );
} 