import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ImageUploader } from './ImageUploader';
import { CustomizationBuilder } from './CustomizationBuilder';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const MenuItemForm = ({ item, onClose, onSuccess }) => {
  const isEdit = !!item;
  
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [price, setPrice] = useState(item?.price || '');
  const [category, setCategory] = useState(item?.category || 'Coffee');
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);
  
  const [imageFile, setImageFile] = useState(null);
  const [customizations, setCustomizations] = useState(item?.customizationOptions || []);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // We must use FormData because we are uploading a file (image)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('isAvailable', isAvailable);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Send customizations as a JSON string to be parsed on the backend
    if (customizations.length > 0) {
      formData.append('customizationOptions', JSON.stringify(customizations));
    } else {
      formData.append('customizationOptions', '[]');
    }

    try {
      if (isEdit) {
        await api.put(`/admin/menu/${item._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Menu item updated');
      } else {
        await api.post('/admin/menu', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Menu item created');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface rounded-card border border-outline w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-outline sticky top-0 bg-surface rounded-t-card z-10">
          <h2 className="text-2xl font-headline font-bold text-on-surface">
            {isEdit ? 'Edit Menu Item' : 'Create Menu Item'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Col: Basics */}
            <div className="space-y-4">
              <Input label="Item Name" value={name} onChange={e => setName(e.target.value)} required />
              
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface">Description</label>
                <textarea 
                  className="w-full bg-surface-variant text-on-surface border border-outline rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Input 
                    label="Price" 
                    type="number" 
                    step="0.01" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    required 
                    className="pl-7"
                  />
                  <span className="absolute left-3 top-[34px] text-on-surface-variant">$</span>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-on-surface">Category</label>
                  <select 
                    className="w-full bg-surface-variant text-on-surface border border-outline rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary h-[46px]"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Tea">Tea</option>
                    <option value="Pastries">Pastries</option>
                    <option value="Merch">Merch</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 pt-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isAvailable} 
                  onChange={e => setIsAvailable(e.target.checked)} 
                  className="w-5 h-5 rounded border-outline text-primary focus:ring-primary"
                />
                <span className="font-bold text-on-surface">Available for Sale</span>
              </label>

            </div>

            {/* Right Col: Image */}
            <div>
              <ImageUploader onImageSelected={setImageFile} defaultImage={item?.imageUrl} />
            </div>
          </div>

          <hr className="border-outline" />

          {/* Full Width: Customizations */}
          <div>
            <CustomizationBuilder customizations={customizations} onChange={setCustomizations} />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-outline sticky bottom-0 bg-surface -mx-6 px-6 pb-6 rounded-b-card">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting} className="gap-2">
              <Save size={18} /> Save Item
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
