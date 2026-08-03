import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, Tag } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PromoCodeForm } from '../../components/admin/PromoCodeForm';
import toast from 'react-hot-toast';

export const PromoManager = () => {
  const [promos, setPromos] = useState([]);
  const [search, setSearch] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  
  const fetchPromos = async () => {
    setIsFetching(true);
    try {
      const { data } = await api.get('/admin/promo-codes');
      setPromos(data.data);
    } catch (err) {
      toast.error('Failed to load promo codes');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleAddNew = () => {
    setEditingPromo(null);
    setShowForm(true);
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setShowForm(true);
  };

  const handleDelete = async (promo) => {
    if (!window.confirm(`Are you sure you want to delete promo code ${promo.code}?`)) return;
    try {
      await api.delete(`/admin/promo-codes/${promo._id}`);
      toast.success('Promo code deleted');
      fetchPromos();
    } catch (err) {
      toast.error('Failed to delete promo code');
    }
  };
  
  const toggleStatus = async (promo) => {
    try {
      await api.put(`/admin/promo-codes/${promo._id}`, { ...promo, isActive: !promo.isActive });
      toast.success(`Promo code ${promo.isActive ? 'deactivated' : 'activated'}`);
      fetchPromos();
    } catch (err) {
      toast.error('Failed to update promo status');
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const filteredPromos = promos.filter(p => p.code.toLowerCase().includes(search.toLowerCase()));

  const getStatusBadge = (promo) => {
    const isExpired = new Date(promo.expiryDate) < new Date();
    const isMaxedOut = promo.maxUses && promo.usedCount >= promo.maxUses;
    
    if (!promo.isActive) return <span className="px-2 py-1 bg-surface-variant text-on-surface-variant text-xs font-bold rounded-full">Inactive</span>;
    if (isExpired) return <span className="px-2 py-1 bg-error/10 text-error text-xs font-bold rounded-full">Expired</span>;
    if (isMaxedOut) return <span className="px-2 py-1 bg-error/10 text-error text-xs font-bold rounded-full">Maxed Out</span>;
    
    return <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-full">Active</span>;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface">Promo Codes</h1>
          <p className="text-on-surface-variant">Create and manage discounts for your customers.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={18} /> Create Promo Code
        </Button>
      </div>

      <div className="bg-surface rounded-card border border-outline overflow-hidden">
        <div className="p-4 border-b border-outline flex gap-4 bg-surface-variant/30">
          <div className="w-full max-w-md">
            <Input 
              icon={Search} 
              placeholder="Search codes..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline bg-surface-variant/50 text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {isFetching ? (
                <tr><td colSpan="6" className="p-8 text-center text-on-surface-variant">Loading promos...</td></tr>
              ) : filteredPromos.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-on-surface-variant border-2 border-dashed border-outline m-4 rounded-md">No promo codes found.</td></tr>
              ) : (
                filteredPromos.map(promo => (
                  <tr key={promo._id} className="hover:bg-surface-variant/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary tracking-wider bg-primary/10 px-2 py-1 rounded">
                          {promo.code}
                        </span>
                        <button onClick={() => copyToClipboard(promo.code)} className="text-on-surface-variant hover:text-primary transition-colors">
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-on-surface">
                      {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `$${promo.discountValue.toFixed(2)} OFF`}
                      {promo.minOrderValue > 0 && <div className="text-xs text-on-surface-variant font-normal">Min. ${promo.minOrderValue}</div>}
                    </td>
                    <td className="p-4 text-sm">
                      <span className="font-bold text-on-surface">{promo.usedCount}</span>
                      <span className="text-on-surface-variant"> / {promo.maxUses || '∞'}</span>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {new Date(promo.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(promo)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toggleStatus(promo)} 
                          className="px-3 py-1.5 text-xs font-bold border border-outline rounded-md hover:bg-surface-variant transition-colors"
                        >
                          {promo.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleEdit(promo)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(promo)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <PromoCodeForm 
          promo={editingPromo} 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            fetchPromos();
          }} 
        />
      )}

    </div>
  );
};
