interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export default function Skeleton({ className = '', variant = 'rectangular', width, height }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`
        relative overflow-hidden bg-surface-2 ${variantClasses[variant]} ${className}
      `}
      style={{ width, height }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-surface-3/50 to-transparent" />
    </div>
  );
}
