import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MenuItemForm } from '../../components/admin/MenuItemForm';
import toast from 'react-hot-toast';

export const MenuManager = () => {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const fetchMenu = async () => {
    setIsFetching(true);
    try {
      const { data } = await api.get('/menu');
      setMenu(data.data);
    } catch (err) {
      toast.error('Failed to load menu');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name}? This cannot be undone.`)) return;
    
    try {
      await api.delete(`/admin/menu/${item._id}`);
      toast.success('Item deleted');
      fetchMenu();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const filteredMenu = menu.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface">Menu Manager</h1>
          <p className="text-on-surface-variant">Add, edit, and organize your cafe's offerings.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={18} /> Add New Item
        </Button>
      </div>

      <div className="bg-surface rounded-card border border-outline overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-outline flex gap-4 bg-surface-variant/30">
          <div className="w-full max-w-md">
            <Input 
              icon={Search} 
              placeholder="Search items by name..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline bg-surface-variant/50 text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {isFetching ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-on-surface-variant">Loading menu...</td>
                </tr>
              ) : filteredMenu.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-on-surface-variant border-2 border-dashed border-outline m-4 rounded-md">
                    No items found.
                  </td>
                </tr>
              ) : (
                filteredMenu.map(item => (
                  <tr key={item._id} className="hover:bg-surface-variant/30 transition-colors group">
                    <td className="p-4">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover border border-outline shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-surface-variant flex items-center justify-center text-on-surface-variant border border-outline">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-on-surface">{item.name}</td>
                    <td className="p-4 text-sm text-on-surface-variant">{item.category}</td>
                    <td className="p-4 font-mono font-bold text-primary">${item.price.toFixed(2)}</td>
                    <td className="p-4">
                      {item.isAvailable ? (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-full">Available</span>
                      ) : (
                        <span className="px-2 py-1 bg-error/10 text-error text-xs font-bold rounded-full">Sold Out (86)</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(item)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors">
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
        <MenuItemForm 
          item={editingItem} 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            fetchMenu();
          }} 
        />
      )}

    </div>
  );
};
