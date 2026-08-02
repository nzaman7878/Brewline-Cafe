import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Coffee } from 'lucide-react';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { success } = await login(formData);
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
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Sign in to skip the line
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-outline rounded bg-surface"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-on-surface-variant">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-body-bold text-primary hover:text-secondary">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-on-surface-variant">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Button type="button" variant="secondary" className="w-full">
                Continue with Google
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/register" className="font-body-bold text-primary hover:text-secondary">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-on-surface-variant mt-2">
              <Link to="/" className="hover:text-primary transition-colors">
                Continue as Guest
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
