import { Card } from '@/components/ui/card';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Complaint } from '@/types/supplier';
import { format } from 'date-fns';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick: (c: Complaint) => void;
}

export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  return (
    <Card
      className="p-4 border-border hover:bg-card-hover transition-colors cursor-pointer"
      onClick={() => onClick(complaint)}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{complaint.supplierName}</span>
        <PriorityBadge priority={complaint.priority} />
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{complaint.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge status={complaint.status} />
          <span className="text-xs text-muted-foreground">{complaint.assetType}</span>
        </div>
        <span className="text-xs text-muted-foreground">{format(new Date(complaint.createdAt), 'dd/MM/yyyy')}</span>
      </div>
    </Card>
  );
}
