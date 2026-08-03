import { OrderCard } from './OrderCard';

export const OrderColumn = ({ title, status, orders, icon: Icon }) => {
  return (
    <div className="flex-1 min-w-[300px] flex flex-col bg-surface-variant/30 rounded-card border border-outline overflow-hidden h-[calc(100vh-140px)]">
      {/* Column Header */}
      <div className="bg-surface p-4 border-b border-outline flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={20} className="text-primary" />}
          <h2 className="font-headline font-bold text-lg text-on-surface">{title}</h2>
        </div>
        <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-1 rounded-full">
          {orders.length}
        </span>
      </div>

      {/* Scrollable Cards Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {orders.length === 0 ? (
          <div className="h-full flex items-center justify-center text-on-surface-variant text-sm p-4 text-center border-2 border-dashed border-outline rounded-md">
            No orders in this stage
          </div>
        ) : (
          orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};
