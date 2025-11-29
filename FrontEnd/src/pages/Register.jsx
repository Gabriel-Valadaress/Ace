import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateRegisterForm, getPasswordStrength } from '../utils/validators';
import { formatCpf } from '../utils/formatters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

/**
 * Registration page
 */
function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    setFieldValue,
  } = useForm(
    { email: '', cpf: '', password: '', confirmPassword: '' },
    validateRegisterForm
  );

  const passwordStrength = getPasswordStrength(values.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  const handleCpfChange = (e) => {
    const formatted = formatCpf(e.target.value);
    setFieldValue('cpf', formatted);
  };

  const onSubmit = async (formValues) => {
    setServerError('');
    
    // Remove formatting from CPF before sending
    const cpfNumbers = formValues.cpf.replace(/\D/g, '');
    
    const result = await register(
      formValues.email,
      cpfNumbers,
      formValues.password,
      formValues.confirmPassword
    );
    
    if (result.success) {
      setSuccess(true);
    } else {
      setServerError(result.message);
    }
  };

  // Success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-6xl mb-4">✉️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email!</h1>
            <p className="text-gray-600 mb-6">
              We sent a verification link to <strong>{values.email}</strong>. 
              Please click the link to activate your account.
            </p>
            <Link to="/login">
              <Button variant="outline">Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-4xl">🏖️</span>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-600">Join the beach tennis community</p>
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
              label="CPF"
              name="cpf"
              type="text"
              placeholder="123.456.789-10"
              value={values.cpf}
              onChange={handleCpfChange}
              onBlur={handleBlur}
              error={getFieldError('cpf')}
              maxLength={14}
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

            {/* Password Strength Indicator */}
            {values.password && (
              <div className="mb-4 -mt-2">
                <div className="flex gap-1 mb-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Password strength: {strengthLabels[passwordStrength]}
                </p>
              </div>
            )}

            <Input
              label="Confirm Password"
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
              className="mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;