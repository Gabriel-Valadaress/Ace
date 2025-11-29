import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { useForm } from '../hooks/useForm';
import { isValidEmail } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

/**
 * Resend verification email page
 */
function ResendVerification() {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }
    return errors;
  };

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useForm({ email: '' }, validate);

  const onSubmit = async (formValues) => {
    setServerError('');
    
    try {
      const response = await authService.resendVerification(formValues.email);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setServerError(response.message);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to resend verification email');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h1>
            <p className="text-gray-600 mb-6">
              We sent a new verification link to <strong>{values.email}</strong>.
              Please check your inbox and click the link to verify your account.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/login">
                <Button fullWidth>Go to Login</Button>
              </Link>
              <button
                onClick={() => setSuccess(false)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Send to a different email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-4xl">🏖️</span>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Resend Verification</h1>
          <p className="mt-2 text-gray-600">
            Enter your email to receive a new verification link.
          </p>
        </div>

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

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
            >
              Resend Verification Email
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Login
              </Link>
            </p>
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResendVerification;