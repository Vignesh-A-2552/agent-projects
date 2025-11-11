import { cn } from '@/src/lib/utils';
import { CheckCircle2, Sparkles, Tag } from 'lucide-react';

interface ProductBadgeProps {
  type: 'sale' | 'new' | 'verified' | string;
  className?: string;
}

const badgeConfig = {
  sale: {
    label: 'Sale',
    icon: Tag,
    className: 'bg-red-500 text-white',
  },
  new: {
    label: 'New',
    icon: Sparkles,
    className: 'bg-blue-500 text-white',
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle2,
    className: 'bg-green-500 text-white',
  },
};

export function ProductBadge({ type, className }: ProductBadgeProps) {
  const config = badgeConfig[type as keyof typeof badgeConfig] || {
    label: type,
    icon: Tag,
    className: 'bg-gray-500 text-white',
  };

  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </div>
  );
}
