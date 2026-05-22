import Skeleton from '@/components/ui/Skeleton';

interface ContentLoaderProps {
  type?: 'card' | 'list' | 'chart' | 'profile' | 'chat';
  count?: number;
}

export default function ContentLoader({ type = 'card', count = 3 }: ContentLoaderProps) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="w-10 h-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-4">
            <Skeleton variant="circular" className="w-10 h-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="glass-card p-5 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" className="w-20 h-20" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'chat') {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] space-y-2 ${i % 2 === 0 ? 'items-end' : 'items-start'}`}>
              <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-48' : 'w-64'} rounded-2xl`} />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
