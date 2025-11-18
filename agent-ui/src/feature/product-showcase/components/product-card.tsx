'use client';

import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import { StarRating } from '@/src/components/ui/star-rating';
import { ProductBadge } from '@/src/components/ui/product-badge';
import type { Product } from '@/src/types/product';
import { useCartStore } from '@/src/store/cart-store';
import * as m from 'motion/react-m';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onViewDetails, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <m.div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-shadow hover:shadow-lg cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.badges.map((badge) => (
              <ProductBadge key={badge} type={badge} />
            ))}
          </div>
        )}

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute right-2 bottom-2 bg-white/90 hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900 transition-opacity',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleToggleFavorite}
        >
          <Heart
            className={cn(
              'h-5 w-5',
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
            )}
          />
        </Button>

        {/* Stock Status */}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-md bg-red-500 px-4 py-2 text-sm font-bold text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 space-y-2">
        {/* Category */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {product.main_category} • {product.sub_category}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <StarRating
          rating={product.ratings}
          size="sm"
          showNumber
          reviewCount={product.review_count}
        />

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-500">
            ${product.discount_price.toFixed(2)}
          </span>
          {product.price > product.discount_price && (
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Shipping */}
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {product.shipping}
        </p>

        {/* Recent Purchases */}
        {product.recent_purchases && (
          <p className="text-xs text-blue-600 dark:text-blue-400">
            {product.recent_purchases} customers bought this in the last 24 hours
          </p>
        )}

        {/* Add to Cart Button */}
        <Button
          className="w-full mt-3 h-10 sm:h-11 text-sm sm:text-base"
          onClick={handleAddToCart}
          disabled={!product.in_stock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </m.div>
  );
}
