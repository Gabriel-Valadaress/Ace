import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { isValidPassword } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

/**
 * Reset password page
 */
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const validate = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(values.password)) {
      errors.password = 'Password must have at least 8 characters, one uppercase, one lowercase, and one number';
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
  } = useForm({ password: '', confirmPassword: '' }, validate);

  const onSubmit = async (formValues) => {
    setServerError('');
    
    if (!email || !token) {
      setServerError('Invalid reset link. Please request a new one.');
      return;
    }

    const result = await resetPassword(
      email,
      token,
      formValues.password,
      formValues.confirmPassword
    );
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setServerError(result.message);
    }
  };

  // Invalid link check
  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password">
              <Button>Request New Link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. Redirecting to login...
            </p>
            <Link to="/login">
              <Button>Go to Login</Button>
            </Link>
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
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Reset your password</h1>
          <p className="mt-2 text-gray-600">Enter your new password below.</p>
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
              label="New Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('password')}
              required
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('confirmPassword')}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;