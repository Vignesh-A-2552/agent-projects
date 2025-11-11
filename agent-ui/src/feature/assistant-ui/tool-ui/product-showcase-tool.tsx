'use client';

import { useState, useEffect } from 'react';
import { ProductGrid } from '@/src/feature/product-showcase/components/product-grid';
import type { Product } from '@/src/types/product';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Button } from '@/src/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ThreadPrimitive } from '@assistant-ui/react';

interface ProductShowcaseToolProps {
  args?: {
    products?: Product[];
    follow_up_question?: string | null;
  };
  products?: Product[];
  isLoading?: boolean;
}

export function ProductShowcaseTool({ args, products, isLoading }: ProductShowcaseToolProps) {
  const [parsedProducts, setParsedProducts] = useState<Product[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);

  useEffect(() => {
    // Try to get products from args first, then from products prop
    const productsData = args?.products || products;
    const followUp = args?.follow_up_question;

    if (productsData && Array.isArray(productsData)) {
      console.log('ProductShowcaseTool received products:', productsData);
      setParsedProducts(productsData);
    }

    if (followUp) {
      console.log('ProductShowcaseTool received follow_up_question:', followUp);
      setFollowUpQuestion(followUp);
    }
  }, [args, products]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!parsedProducts || parsedProducts.length === 0) {
    console.log('ProductShowcaseTool: No products to display');
    return null;
  }

  return (
    <div className="my-4 space-y-6">
      <ProductGrid products={parsedProducts} />

      {/* Follow-up Question Section */}
      {followUpQuestion && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Need more help?
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {followUpQuestion}
              </p>
              <ThreadPrimitive.Suggestion
                prompt={followUpQuestion}
                send
                asChild
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                >
                  Ask this question
                </Button>
              </ThreadPrimitive.Suggestion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
