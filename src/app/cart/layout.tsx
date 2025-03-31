import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart - Home Flavors",
  description: "View and manage your cart items",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 