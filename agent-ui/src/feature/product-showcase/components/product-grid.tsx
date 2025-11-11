'use client';

import { useState } from 'react';
import type { Product } from '@/src/types/product';
import { ProductCard } from './product-card';
import { ProductDetailModal } from './product-detail-modal';
import { cn } from '@/src/lib/utils';

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
  className?: string;
}

export function ProductGrid({
  products,
  title = 'Premium Product Showcase',
  description = 'Explore our carefully curated collection with detailed product information and seamless shopping experience.',
  className,
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!products || products.length === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        <p className="text-gray-500 dark:text-gray-400">No products available</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Featured Product Label */}
      {products.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Featured Product
          </h2>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={setSelectedProduct}
          />
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
