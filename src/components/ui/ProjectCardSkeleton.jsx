import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { PROJECT_CARD_HEIGHT } from '@/components/ui/ProjectCard';

export default function ProjectCardSkeleton({ className = '' }) {
  return (
    <Card className={`flex flex-col gap-3 ${PROJECT_CARD_HEIGHT} ${className}`}>
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="mt-auto flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>
    </Card>
  );
}
