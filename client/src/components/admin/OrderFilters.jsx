import { Search, Filter, Download } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const OrderFilters = ({ filters, setFilters, onExport }) => {
  return (
    <div className="p-4 border-b border-outline bg-surface-variant/30 flex flex-wrap gap-4 items-end">
      
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Search</label>
        <Input 
          icon={Search} 
          placeholder="Order #, Name, Email..." 
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        />
      </div>

      <div className="w-48">
        <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Status</label>
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <select 
            className="w-full pl-10 pr-4 py-2.5 bg-surface text-on-surface border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-[46px] appearance-none cursor-pointer"
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="paid">Paid (New)</option>
            <option value="preparing">Preparing</option>
            <option value="ready_for_pickup">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">From</label>
          <Input 
            type="date"
            value={filters.dateStart}
            onChange={e => setFilters(f => ({ ...f, dateStart: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">To</label>
          <Input 
            type="date"
            value={filters.dateEnd}
            onChange={e => setFilters(f => ({ ...f, dateEnd: e.target.value }))}
          />
        </div>
      </div>

      <Button variant="outline" onClick={onExport} className="h-[46px] gap-2 shrink-0">
        <Download size={18} /> Export CSV
      </Button>

    </div>
  );
};
