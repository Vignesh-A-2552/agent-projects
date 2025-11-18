'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import type { CartItem as CartItemType } from '@/src/types/product';
import { useCartStore } from '@/src/store/cart-store';
import { cn } from '@/src/lib/utils';

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

export function CartItem({ item, className }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.product.id);
  };

  const itemTotal = item.product.discount_price * item.quantity;

  return (
    <div className={cn('flex gap-3 sm:gap-4 py-3 sm:py-4', className)}>
      {/* Product Image */}
      <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
              {item.product.name}
            </h4>

            {/* Selected Options */}
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
              {item.selectedColor && (
                <p>Color: {item.selectedColor}</p>
              )}
              {item.selectedStorage && (
                <p>Storage: {item.selectedStorage}</p>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400 hover:text-red-500 flex-shrink-0"
            onClick={handleRemove}
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-2 gap-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Item Total */}
          <div className="text-right flex-shrink-0">
            <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
              ${itemTotal.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ${item.product.discount_price.toFixed(2)} each
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
