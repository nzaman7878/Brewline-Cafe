import { CheckCircle2, Circle } from 'lucide-react';

const STATUS_ORDER = ['pending_payment', 'paid', 'preparing', 'ready_for_pickup', 'completed'];

const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  paid: 'Order Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded'
};

export const OrderTimeline = ({ status }) => {
  if (['cancelled', 'refunded'].includes(status)) {
    return (
      <div className="p-4 bg-error/10 text-error rounded-md text-center font-bold">
        Order {STATUS_LABELS[status]}
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(status);
  
  // We only show steps from Paid to Completed
  const steps = STATUS_ORDER.slice(1);
  const adjustedIndex = currentIndex - 1; // because we sliced out pending_payment

  return (
    <div className="relative flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:justify-between py-6">
      {steps.map((step, index) => {
        const isCompleted = index < adjustedIndex;
        const isCurrent = index === adjustedIndex;
        const isPending = index > adjustedIndex;

        return (
          <div key={step} className="flex flex-row sm:flex-col items-center relative z-10 group flex-1">
            
            {/* Desktop Horizontal Line */}
            {index !== steps.length - 1 && (
              <div className={`hidden sm:block absolute top-5 left-1/2 w-full h-1 -z-10 ${isCompleted ? 'bg-primary' : 'bg-outline'}`} />
            )}
            
            {/* Mobile Vertical Line */}
            {index !== steps.length - 1 && (
              <div className={`sm:hidden absolute top-10 left-4 w-1 h-full -z-10 ${isCompleted ? 'bg-primary' : 'bg-outline'}`} />
            )}

            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
              ${isCompleted ? 'bg-primary text-on-primary' : 
                isCurrent ? 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-surface' : 
                'bg-surface-variant text-on-surface-variant border-2 border-outline'}`}
            >
              {isCompleted ? <CheckCircle2 size={24} /> : 
               isCurrent ? (
                 <>
                   <Circle size={20} className="fill-current" />
                   <span className="absolute w-10 h-10 rounded-full bg-primary/40 animate-ping" />
                 </>
               ) : 
               <Circle size={16} />}
            </div>
            
            <div className="ml-4 sm:ml-0 sm:mt-4 text-left sm:text-center">
              <p className={`font-bold ${isCurrent ? 'text-primary' : isPending ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                {STATUS_LABELS[step]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
