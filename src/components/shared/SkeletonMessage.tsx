import { cn } from '@/lib/utils';

interface SkeletonMessageProps {
  align: 'left' | 'right';
}

export function SkeletonMessage({ align }: SkeletonMessageProps) {
  return (
    <div
      className={cn(
        'flex animate-pulse flex-col gap-2',
        align === 'right' ? 'items-end' : 'items-start',
      )}
    >
      <div className="bg-muted h-3 w-20 rounded" />
      <div className="bg-muted h-12 w-48 rounded-lg" />
    </div>
  );
}
