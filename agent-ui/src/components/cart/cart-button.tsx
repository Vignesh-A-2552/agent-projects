'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { useCartStore } from '@/src/store/cart-store';
import { cn } from '@/src/lib/utils';

interface CartButtonProps {
  onClick: () => void;
  className?: string;
}

export function CartButton({ onClick, className }: CartButtonProps) {
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('relative', className)}
      onClick={onClick}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Button>
  );
}
