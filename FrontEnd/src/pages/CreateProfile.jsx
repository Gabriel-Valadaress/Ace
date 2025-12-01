import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../context/ProfileContext';
import { useForm } from '../hooks/useForm';
import { validateProfileForm } from '../utils/validators';
import { formatPhone } from '../utils/formatters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 24px;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 32px;
  width: 100%;
  max-width: 500px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Icon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #111;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
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
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }

  button {
    width: 100%;
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: rgb(79, 105, 191);
  border: 2px solid rgb(79, 105, 191);

  &:hover {
    background: #f9fafb;
  }

  &:active {
    background: #f3f4f6;
  }
`;

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
    <Container>
      <FormCard>
        <Header>
          <Icon>👤</Icon>
          <Title>Crie seu perfil</Title>
          <Subtitle>
            Preencha as informações abaixo para completar o seu perfil de jogador(a)
          </Subtitle>
        </Header>

        {serverError && (
          <Alert
            type="error"
            message={serverError}
            onClose={() => setServerError('')}
          />
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
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
            <SecondaryButton
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Deixar para depois
            </SecondaryButton>
            <Button
              type="submit"
              loading={isSubmitting}
            >
              Criar Perfil
            </Button>
          </ButtonGroup>
        </Form>
      </FormCard>
    </Container>
  );
}

export default CreateProfile;