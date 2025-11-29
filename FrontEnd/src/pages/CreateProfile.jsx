import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useForm } from '../hooks/useForm';
import { validateProfileForm } from '../utils/validators';
import { formatPhone } from '../utils/formatters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

/**
 * Create profile page
 */
function CreateProfile() {
  const { createProfile } = useProfile();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    setFieldValue,
  } = useForm(
    { fullName: '', birthDate: '', phoneNumber: '', height: '' },
    validateProfileForm
  );

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFieldValue('phoneNumber', formatted);
  };

  const onSubmit = async (formValues) => {
    setServerError('');
    
    // Remove formatting from phone
    const phoneNumbers = formValues.phoneNumber.replace(/\D/g, '');
    
    const result = await createProfile({
      fullName: formValues.fullName,
      birthDate: formValues.birthDate,
      phoneNumber: phoneNumbers,
      height: formValues.height ? parseInt(formValues.height) : null,
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Your Profile</h1>
        <p className="text-gray-600 mt-1">
          Fill in your information to complete your player profile.
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
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="John Silva"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('fullName')}
            required
          />

          <Input
            label="Birth Date"
            name="birthDate"
            type="date"
            value={values.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('birthDate')}
            required
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="(51) 99999-9999"
            value={values.phoneNumber}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            error={getFieldError('phoneNumber')}
            maxLength={15}
            required
          />

          <Input
            label="Height (cm)"
            name="height"
            type="number"
            placeholder="180"
            value={values.height}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('height')}
            min={100}
            max={250}
          />

          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-grow"
            >
              Create Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProfile;