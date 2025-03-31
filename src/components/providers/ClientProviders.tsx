'use client';

import React from 'react';
import { CartProvider } from "@/context/CartContext";
import Layout from "@/components/layout/Layout";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CartProvider>
      <Layout>{children}</Layout>
    </CartProvider>
  );
} 