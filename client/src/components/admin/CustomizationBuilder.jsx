import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const CustomizationBuilder = ({ customizations, onChange }) => {
  
  const addGroup = () => {
    onChange([
      ...customizations, 
      { groupName: '', required: false, multiSelect: false, options: [{ name: '', priceModifier: 0 }] }
    ]);
  };

  const removeGroup = (index) => {
    const newGroups = [...customizations];
    newGroups.splice(index, 1);
    onChange(newGroups);
  };

  const updateGroup = (index, field, value) => {
    const newGroups = [...customizations];
    newGroups[index][field] = value;
    onChange(newGroups);
  };

  const addOption = (groupIndex) => {
    const newGroups = [...customizations];
    newGroups[groupIndex].options.push({ name: '', priceModifier: 0 });
    onChange(newGroups);
  };

  const removeOption = (groupIndex, optionIndex) => {
    const newGroups = [...customizations];
    newGroups[groupIndex].options.splice(optionIndex, 1);
    onChange(newGroups);
  };

  const updateOption = (groupIndex, optionIndex, field, value) => {
    const newGroups = [...customizations];
    newGroups[groupIndex].options[optionIndex][field] = field === 'priceModifier' ? Number(value) : value;
    onChange(newGroups);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-on-surface">Customizations & Modifiers</label>
        <Button type="button" variant="outline" size="sm" onClick={addGroup} className="gap-2">
          <Plus size={16} /> Add Group
        </Button>
      </div>

      {customizations.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-outline rounded-md text-on-surface-variant text-sm">
          No customizations added. (e.g., Size, Milk Type, Syrup)
        </div>
      ) : (
        <div className="space-y-6">
          {customizations.map((group, gIndex) => (
            <div key={gIndex} className="bg-surface-variant p-4 rounded-card border border-outline space-y-4">
              
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input 
                    placeholder="Group Name (e.g. Size)" 
                    value={group.groupName} 
                    onChange={e => updateGroup(gIndex, 'groupName', e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={group.required}
                      onChange={e => updateGroup(gIndex, 'required', e.target.checked)}
                      className="rounded border-outline text-primary focus:ring-primary"
                    />
                    Required
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={group.multiSelect}
                      onChange={e => updateGroup(gIndex, 'multiSelect', e.target.checked)}
                      className="rounded border-outline text-primary focus:ring-primary"
                    />
                    Multi-Select
                  </label>
                  <button type="button" onClick={() => removeGroup(gIndex)} className="text-error hover:bg-error/10 p-1.5 rounded-full ml-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="pl-4 border-l-2 border-outline space-y-3">
                {group.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-3 items-center">
                    <GripVertical size={16} className="text-on-surface-variant cursor-grab shrink-0" />
                    <Input 
                      placeholder="Option Name (e.g. Oat Milk)" 
                      value={option.name} 
                      onChange={e => updateOption(gIndex, oIndex, 'name', e.target.value)}
                      className="flex-1"
                      required
                    />
                    <div className="w-32 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.00" 
                        value={option.priceModifier} 
                        onChange={e => updateOption(gIndex, oIndex, 'priceModifier', e.target.value)}
                        className="pl-7"
                        required
                      />
                    </div>
                    <button type="button" onClick={() => removeOption(gIndex, oIndex)} className="text-error hover:bg-error/10 p-1.5 rounded-full shrink-0">
                      <X size={18} />
                    </button>
                  </div>
                ))}
                
                <Button type="button" variant="outline" size="sm" onClick={() => addOption(gIndex)} className="text-xs py-1 h-auto mt-2">
                  <Plus size={14} className="mr-1" /> Add Option
                </Button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
