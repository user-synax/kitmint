import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}) {
  return (
    <div className="border border-dashed border-[#1F2937] rounded-lg p-12 text-center w-full animate-fade-in">
      {Icon && <Icon className="w-6 h-6 text-[#6B7280] mx-auto mb-3" />}
      <h3 className="text-[#F9FAFB] font-semibold mb-1 text-lg">{title}</h3>
      <p className="text-[#9CA3AF] text-sm mb-6 max-w-xs mx-auto">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button asChild className="bg-primary hover:bg-primary-hover text-white">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
