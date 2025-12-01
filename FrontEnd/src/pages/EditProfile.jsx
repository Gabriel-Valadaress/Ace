import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../context/ProfileContext';
import { useForm } from '../hooks/useForm';
import { validateProfileForm } from '../utils/validators';
import { formatPhone, formatDateForInput, getInitials } from '../utils/formatters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 32px;
`;

const PhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgb(79, 105, 191);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  border: 4px solid #e5e7eb;
`;

const AvatarImage = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;
`;

const PhotoButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #666;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: rgb(79, 105, 191);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PhotoHint = styled.p`
  font-size: 13px;
  color: #999;
  margin: 8px 0 0 0;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

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
      setSuccessMessage('Foto atualizada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setServerError(result.message);
    }

    setUploading(false);
  };

  const onSubmit = async (formValues) => {
    setServerError('');
    setSuccessMessage('');
    
    const phoneNumbers = formValues.phoneNumber.replace(/\D/g, '');
    
    const result = await updateProfile({
      fullName: formValues.fullName,
      birthDate: formValues.birthDate,
      phoneNumber: phoneNumbers,
      height: formValues.height ? parseInt(formValues.height) : null,
    });
    
    if (result.success) {
      setSuccessMessage('Perfil atualizado com sucesso!');
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
    <Container>
      <Header>
        <Title>Editar Perfil</Title>
        <Subtitle>Atualize suas informações de jogador.</Subtitle>
      </Header>

      <FormCard>
        {serverError && (
          <Alert
            type="error"
            message={serverError}
            onClose={() => setServerError('')}
          />
        )}

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        )}

        <PhotoSection>
          <AvatarWrapper>
            {profile?.photoUrl ? (
              <AvatarImage
                src={`${apiBaseUrl}/${profile.photoUrl}`}
                alt={profile.fullName}
              />
            ) : (
              <Avatar>
                {getInitials(profile?.fullName || values.fullName)}
              </Avatar>
            )}
            
            <PhotoButton
              type="button"
              onClick={handlePhotoClick}
              disabled={uploading}
            >
              {uploading ? (
                <Spinner />
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </PhotoButton>
          </AvatarWrapper>
          
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
          />
          
          <PhotoHint>Clique para alterar a foto</PhotoHint>
        </PhotoSection>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nome Completo"
            name="fullName"
            type="text"
            placeholder="João Silva"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('fullName')}
            required
          />

          <Input
            label="Data de Nascimento"
            name="birthDate"
            type="date"
            value={values.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('birthDate')}
            required
          />

          <Input
            label="Telefone"
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
            label="Altura (cm)"
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

          <ButtonGroup>
            <Button
              type="button"
              onClick={() => navigate('/profile')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </ButtonGroup>
        </Form>
      </FormCard>
    </Container>
  );
}

export default EditProfile;