import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useForm } from '../hooks/useForm';
import { validateProfileForm } from '../utils/validators';
import { formatPhone, formatDateForInput, getInitials } from '../utils/formatters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';

/**
 * Edit profile page
 */
function EditProfile() {
  const { profile, loading, updateProfile, uploadPhoto } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    setFieldValue,
  } = useForm(
    {
      fullName: profile?.fullName || '',
      birthDate: formatDateForInput(profile?.birthDate) || '',
      phoneNumber: formatPhone(profile?.phoneNumber) || '',
      height: profile?.height || '',
    },
    validateProfileForm
  );

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFieldValue('phoneNumber', formatted);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setServerError('');

    const result = await uploadPhoto(file);

    if (result.success) {
      setSuccessMessage('Photo updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setServerError(result.message);
    }

    setUploading(false);
  };

  const onSubmit = async (formValues) => {
    setServerError('');
    setSuccessMessage('');
    
    // Remove formatting from phone
    const phoneNumbers = formValues.phoneNumber.replace(/\D/g, '');
    
    const result = await updateProfile({
      fullName: formValues.fullName,
      birthDate: formValues.birthDate,
      phoneNumber: phoneNumbers,
      height: formValues.height ? parseInt(formValues.height) : null,
    });
    
    if (result.success) {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } else {
      setServerError(result.message);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5230';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-1">Update your player information.</p>
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

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
            className="mb-6"
          />
        )}

        {/* Photo Upload Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {profile?.photoUrl ? (
              <img
                src={`${apiBaseUrl}/${profile.photoUrl}`}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-gray-200">
                {getInitials(profile?.fullName || values.fullName)}
              </div>
            )}
            
            <button
              type="button"
              onClick={handlePhotoClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
          />
          
          <p className="text-sm text-gray-500 mt-2">Click to change photo</p>
        </div>

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
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-grow"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;