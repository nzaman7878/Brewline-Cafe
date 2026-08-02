import { Input } from '../ui/Input';

export const GuestInfoForm = ({ values, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-surface rounded-card border border-outline p-6 space-y-4">
      <h3 className="font-headline font-bold text-lg text-on-surface">Guest Details</h3>
      <p className="text-sm text-on-surface-variant mb-4">
        Sign in to earn rewards, or continue as a guest.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Full Name"
            name="guestName"
            value={values.guestName}
            onChange={handleChange}
            required
            placeholder="Jane Doe"
          />
        </div>
        <Input
          label="Email Address"
          name="guestEmail"
          type="email"
          value={values.guestEmail}
          onChange={handleChange}
          required
          placeholder="jane@example.com"
        />
        <Input
          label="Phone Number"
          name="guestPhone"
          type="tel"
          value={values.guestPhone}
          onChange={handleChange}
          required
          placeholder="(555) 123-4567"
        />
      </div>
    </div>
  );
};
