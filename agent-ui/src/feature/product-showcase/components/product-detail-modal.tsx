'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Separator } from '@/src/components/ui/separator';
import { StarRating } from '@/src/components/ui/star-rating';
import { ProductBadge } from '@/src/components/ui/product-badge';
import { ImageCarousel } from '@/src/components/ui/image-carousel';
import type { Product } from '@/src/types/product';
import { useCartStore } from '@/src/store/cart-store';
import {
  ShoppingCart,
  CreditCard,
  Heart,
  Share2,
  Package,
  Truck,
  RotateCcw,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [selectedStorage, setSelectedStorage] = useState(product.storage?.[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const savings = product.price - product.discount_price;

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedStorage);
  };

  const handleBuyNow = () => {
    addItem(product, selectedColor, selectedStorage);
    // TODO: Navigate to checkout
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Images */}
          <div>
            <ImageCarousel images={product.images} alt={product.name} />
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <ProductBadge key={badge} type={badge} />
                ))}
              </div>
            )}

            {/* Category */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {product.main_category} • {product.sub_category}
            </p>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <StarRating
              rating={product.ratings}
              size="md"
              showNumber
              reviewCount={product.review_count}
            />

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-500">
                  ${product.discount_price.toFixed(2)}
                </span>
                {product.price > product.discount_price && (
                  <span className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-sm text-green-600 dark:text-green-500 font-medium">
                  Save ${savings.toFixed(2)}
                </p>
              )}
            </div>

            <Separator />

            {/* Stock and Shipping Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-green-600" />
                <span className={product.in_stock ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {product.in_stock
                    ? `In Stock (${product.stock_quantity} available)`
                    : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Truck className="h-4 w-4" />
                <span>{product.shipping}</span>
              </div>

              {product.return_policy && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <RotateCcw className="h-4 w-4" />
                  <span>{product.return_policy}</span>
                </div>
              )}

              {product.warranty && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4" />
                  <span>{product.warranty}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Color:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                      className="min-w-[100px]"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {product.storage && product.storage.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Storage:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.storage.map((storage) => (
                    <Button
                      key={storage}
                      variant={selectedStorage === storage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedStorage(storage)}
                      className="min-w-[80px]"
                    >
                      {storage}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Premium smartphone with advanced camera system and cutting-edge performance.
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
              </div>
            )}

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Key Features:
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
              >
                <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
                size="lg"
                onClick={handleBuyNow}
                disabled={!product.in_stock}
              >
                <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Buy Now
              </Button>

              <div className="flex gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      isFavorite ? 'fill-red-500 text-red-500' : ''
                    )}
                  />
                </Button>
                <Button variant="outline" size="icon" className="flex-1">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Ask about this product:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  What are the specs?
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Is it in stock?
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  What&apos;s the warranty?
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Any discounts?
                </Button>
              </div>
            </div>

            {/* Customer Activity */}
            {product.recent_purchases && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  {product.recent_purchases} customers bought this in the last 24 hours
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
