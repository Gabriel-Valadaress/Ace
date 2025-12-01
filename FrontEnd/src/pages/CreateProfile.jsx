import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useForm } from '../hooks/useForm';
import { validateProfileForm } from '../utils/validators';
import { formatPhone } from '../utils/formatters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';


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
    <div>
      <div>
        <h1>Crie seu pefil</h1>
        <p>
          Preencha as informações abaixo para completar o seu perfil de jogador(a)
        </p>
      </div>

      <div>
        {serverError && (
          <Alert
            type="error"
            message={serverError}
            onClose={() => setServerError('')}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nome completo"
            name="fullName"
            type="text"
            placeholder="Digite seu nome completo"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('fullName')}
            required
          />

          <Input
            label="Data de nascimento"
            name="birthDate"
            type="date"
            value={values.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('birthDate')}
            required
          />

          <Input
            label="Número de celular"
            name="phoneNumber"
            type="tel"
            placeholder="(999) 99999-9999"
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

          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Deixar para depois
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-grow"
            >
              Atualizar Perfil
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProfile;