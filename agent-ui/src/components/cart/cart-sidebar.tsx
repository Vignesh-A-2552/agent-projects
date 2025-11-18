"use client";

import { useState } from "react";
import { ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { useCartStore } from "@/src/store/cart-store";
import { CartItem } from "./cart-item";
import { CheckoutModal } from "@/src/components/checkout/checkout-modal";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

export function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
  const { items, total, itemCount, clearCart } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const shipping: number = 0;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
    setIsCheckoutOpen(true);
  };

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
    onClose();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-md"
        >
          <SheetHeader className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <SheetTitle className="text-lg font-semibold">
                Shopping Cart
                {itemCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                )}
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <ShoppingBag className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-700" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Your cart is empty
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Add some products to get started
                </p>
                <Button onClick={onClose}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${index}`}>
                    <CartItem item={item} />
                    {index < items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}

                {items.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                  >
                    Clear Cart
                  </Button>
                )}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600 dark:text-green-500">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="h-12 w-full text-base"
                size="lg"
                onClick={handleCheckout}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Checkout
              </Button>

              <Button variant="outline" className="w-full" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={handleCheckoutClose} />
    </>
  );
}
