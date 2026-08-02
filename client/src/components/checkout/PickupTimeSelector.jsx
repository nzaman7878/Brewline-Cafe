import { useState, useEffect } from 'react';

export const PickupTimeSelector = ({ value, onChange }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const generated = [];
    const now = new Date();
    
    let current = new Date(now);
    // Minimum 15 minutes prep time
    current.setMinutes(current.getMinutes() + 15);
    
    // Round to next 15-minute interval
    const rem = current.getMinutes() % 15;
    if (rem !== 0) {
      current.setMinutes(current.getMinutes() + (15 - rem));
    }
    
    // Business hours: closing at 8 PM (20:00)
    const endOfDay = new Date(now);
    endOfDay.setHours(20, 0, 0, 0);

    // If it's already past 8 PM, we might not generate any slots for today.
    // In a real app we'd allow next-day ordering, but for simplicity we'll just check today.

    while (current < endOfDay) {
      generated.push(new Date(current));
      current = new Date(current.getTime() + 15 * 60000); // 15 min intervals
    }
    
    setSlots(generated);
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-label font-bold text-on-surface">Pickup Time</label>
      
      {slots.length === 0 ? (
        <div className="p-4 bg-error/10 text-error rounded-md text-sm">
          We are currently closed for the day. Please check back tomorrow!
        </div>
      ) : (
        <select 
          className="w-full bg-surface-variant text-on-surface p-3 rounded-md border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        >
          <option value="" disabled>Select a pickup time</option>
          {slots.map((slot, i) => (
            <option key={i} value={slot.toISOString()}>
              {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
