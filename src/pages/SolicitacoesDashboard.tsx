import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { RequestDashboard } from '@/components/requests/RequestDashboard';
import { useRequests } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import { useRequestPermissions } from '@/hooks/useRequestPermissions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { RequestFilters } from '@/types/request';

export default function SolicitacoesDashboard() {
  const [filters, setFilters] = useState<RequestFilters>({});
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const { data: allRequests } = useRequests({});
  const user = useUIStore((s) => s.user);
  const permissions = useRequestPermissions(user?.role, user?.id);

  const visibleAll = useMemo(() => {
    let list = allRequests ?? [];
    if (!permissions.canViewAllRequests && user) {
      list = list.filter((r) => r.requesterId === user.id);
    }
    if (dateFrom) {
      list = list.filter((r) => new Date(r.createdAt) >= dateFrom);
    }
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      list = list.filter((r) => new Date(r.createdAt) <= end);
    }
    return list;
  }, [allRequests, permissions.canViewAllRequests, user, dateFrom, dateTo]);

  const handleDashboardFilter = (f: Partial<RequestFilters>) => {
    setFilters((prev) => ({ ...prev, ...f }));
  };

  const clearDates = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        actions={
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[160px] justify-start text-left font-normal',
                    !dateFrom && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Data início'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[160px] justify-start text-left font-normal',
                    !dateTo && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Data fim'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {(dateFrom || dateTo) && (
              <Button variant="ghost" size="icon" onClick={clearDates} className="h-9 w-9">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        }
      />
      <RequestDashboard requests={visibleAll} onFilterChange={handleDashboardFilter} />
    </div>
  );
}
