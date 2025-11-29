import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateLoginForm } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

/**
 * Login page
 */
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useForm(
    { email: '', password: '' },
    validateLoginForm
  );

  const onSubmit = async (formValues) => {
    setServerError('');
    
    const result = await login(formValues.email, formValues.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-4xl">🏖️</span>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {serverError && (
            <Alert
              type="error"
              message={serverError}
              onClose={() => setServerError('')}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('email')}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('password')}
              required
            />

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Didn't receive verification email?{' '}
              <Link to="/resend-verification" className="text-blue-600 hover:text-blue-700">
                Resend
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;