import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Coffee } from 'lucide-react';

export const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { success } = await register(formData);
    if (success) {
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-card border border-outline shadow-xl">
        <div className="text-center">
          <Coffee className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-headline font-extrabold text-on-surface">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Join Brewline Rewards
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-body-bold text-on-surface-variant mb-1">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-body-bold text-on-surface-variant mb-1">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-body-bold text-on-surface-variant mb-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-body-bold text-on-surface-variant mb-1">
                Phone Number (Optional)
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 555-5555"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-body-bold text-on-surface-variant mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
              />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-outline rounded bg-surface"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-on-surface-variant">
                I agree to the <a href="#" className="text-primary hover:text-secondary">Terms of Service</a> and <a href="#" className="text-primary hover:text-secondary">Privacy Policy</a>.
              </label>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="font-body-bold text-primary hover:text-secondary">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
