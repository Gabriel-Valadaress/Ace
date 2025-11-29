import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { isValidEmail } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

/**
 * Forgot password page
 */
function ForgotPassword() {
  const { forgotPassword } = useAuth();
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
    
    const result = await forgotPassword(formValues.email);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setServerError(result.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email!</h1>
            <p className="text-gray-600 mb-6">
              We sent a password reset link to <strong>{values.email}</strong>.
              Click the link in the email to reset your password.
            </p>
            <Link to="/login">
              <Button variant="outline">Back to Login</Button>
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
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Forgot password?</h1>
          <p className="mt-2 text-gray-600">
            No worries! Enter your email and we'll send you a reset link.
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
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;