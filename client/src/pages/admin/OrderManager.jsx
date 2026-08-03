import { useState, useEffect } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import api from '../../api/axios';
import { OrderFilters } from '../../components/admin/OrderFilters';
import { RefundModal } from '../../components/admin/RefundModal';
import toast from 'react-hot-toast';

export const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateStart: '',
    dateEnd: ''
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const fetchOrders = async () => {
    setIsFetching(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      // Backend currently doesn't process date filters directly in our simple getOrders, 
      // but we will fetch all matching status and filter locally for search/date to save time.
      
      const { data } = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(data.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters.status]); // Refetch if status changes. Search/Date handled locally for speed on small datasets.

  const handleStatusOverride = async (orderId, newStatus) => {
    if (!window.confirm(`Force change status to ${newStatus.toUpperCase()}?`)) return;
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Status updated');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error('Failed to force update status');
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return toast.error('No orders to export');
    
    const headers = ['Order ID', 'Date', 'Customer', 'Status', 'Total', 'Items'];
    const rows = filteredOrders.map(o => [
      o._id,
      new Date(o.createdAt).toISOString(),
      o.guestName || o.customer?.firstName || 'Guest',
      o.status,
      o.total.toFixed(2),
      o.items.map(i => `${i.quantity}x ${i.name}`).join('; ')
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `brewline_orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Local filtering for search and dates
  const filteredOrders = orders.filter(o => {
    // Search
    const searchMatch = !filters.search || 
      o._id.includes(filters.search) || 
      (o.guestName || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (o.guestEmail || '').toLowerCase().includes(filters.search.toLowerCase());
      
    // Dates
    const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
    const dateStartMatch = !filters.dateStart || orderDate >= filters.dateStart;
    const dateEndMatch = !filters.dateEnd || orderDate <= filters.dateEnd;
    
    return searchMatch && dateStartMatch && dateEndMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-info/10 text-info border-info/20';
      case 'preparing': return 'bg-warning/10 text-warning border-warning/20';
      case 'ready_for_pickup': return 'bg-success/10 text-success border-success/20';
      case 'completed': return 'bg-surface-variant text-on-surface border-outline';
      case 'cancelled': 
      case 'refunded': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-surface-variant text-on-surface border-outline';
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">Order History</h1>
        <p className="text-on-surface-variant">View all orders, process refunds, and force status overrides.</p>
      </div>

      <div className="bg-surface rounded-card border border-outline flex flex-col min-h-0 flex-1">
        
        <OrderFilters filters={filters} setFilters={setFilters} onExport={handleExportCSV} />

        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Table */}
          <div className={`flex-1 overflow-y-auto transition-all duration-300 ${selectedOrder ? 'hidden lg:block lg:w-2/3' : 'w-full'}`}>
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-variant border-b border-outline z-10 shadow-sm">
                <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {isFetching ? (
                  <tr><td colSpan="6" className="p-8 text-center text-on-surface-variant">Loading orders...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-on-surface-variant">No orders found.</td></tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr 
                      key={order._id} 
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-surface-variant/30 transition-colors cursor-pointer group ${selectedOrder?._id === order._id ? 'bg-primary/5' : ''}`}
                    >
                      <td className="p-4 font-mono text-sm">{order._id.slice(-6).toUpperCase()}</td>
                      <td className="p-4 text-sm text-on-surface-variant">
                        {new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-4 font-bold text-sm">
                        {order.guestName || order.customer?.firstName || 'Guest'}
                      </td>
                      <td className="p-4 font-bold text-primary">${order.total.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <ChevronRight size={18} className="text-on-surface-variant group-hover:text-primary transition-colors ml-auto" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Slide-over Detail Panel */}
          {selectedOrder && (
            <div className="w-full lg:w-1/3 border-l border-outline bg-surface-variant/20 flex flex-col h-full animate-in slide-in-from-right-8 duration-200">
              <div className="p-4 border-b border-outline flex justify-between items-center bg-surface sticky top-0">
                <div>
                  <h3 className="font-headline font-bold text-lg">Order Details</h3>
                  <p className="text-xs font-mono text-on-surface-variant">#{selectedOrder._id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-surface-variant rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Status & Actions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Current Status</span>
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  {/* Manual Override */}
                  <div className="bg-surface p-3 rounded-md border border-outline space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Manual Override</label>
                    <select 
                      className="w-full bg-surface-variant text-sm border border-outline rounded p-2 focus:ring-1 focus:ring-primary"
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusOverride(selectedOrder._id, e.target.value)}
                    >
                      <option value="pending_payment">Pending Payment</option>
                      <option value="paid">Paid</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready_for_pickup">Ready for Pickup</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  {['paid', 'preparing', 'ready_for_pickup', 'completed'].includes(selectedOrder.status) && (
                    <button 
                      onClick={() => setShowRefundModal(true)}
                      className="w-full py-2 bg-error/10 text-error font-bold text-sm rounded-md hover:bg-error/20 transition-colors border border-error/20"
                    >
                      Process Refund via Stripe
                    </button>
                  )}
                </div>

                <hr className="border-outline" />

                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Customer Info</h4>
                  <div className="bg-surface p-3 rounded-md border border-outline text-sm space-y-1">
                    <p><span className="text-on-surface-variant">Name:</span> {selectedOrder.guestName || selectedOrder.customer?.firstName}</p>
                    <p><span className="text-on-surface-variant">Email:</span> {selectedOrder.guestEmail || selectedOrder.customer?.email}</p>
                    {selectedOrder.guestPhone && <p><span className="text-on-surface-variant">Phone:</span> {selectedOrder.guestPhone}</p>}
                  </div>
                </div>

                <hr className="border-outline" />

                {/* Items */}
                <div>
                  <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Items Ordered</h4>
                  <ul className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {item.quantity}
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-bold">{item.name}</p>
                          {item.selectedOptions && Object.entries(item.selectedOptions).map(([group, opt]) => (
                            <p key={group} className="text-xs text-on-surface-variant">- {opt.name}</p>
                          ))}
                        </div>
                        <div className="font-bold text-sm">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <hr className="border-outline" />

                {/* Totals */}
                <div className="bg-surface p-3 rounded-md border border-outline space-y-1 text-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount ({selectedOrder.promoCode})</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-outline">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {selectedOrder.paymentIntentId && (
                  <div className="text-xs text-center text-on-surface-variant">
                    Stripe PI: {selectedOrder.paymentIntentId}
                  </div>
                )}
                
              </div>
            </div>
          )}

        </div>
      </div>

      {showRefundModal && (
        <RefundModal 
          order={selectedOrder}
          onClose={() => setShowRefundModal(false)}
          onSuccess={() => {
            setShowRefundModal(false);
            fetchOrders();
            setSelectedOrder(prev => ({ ...prev, status: 'refunded' }));
          }}
        />
      )}

    </div>
  );
};
