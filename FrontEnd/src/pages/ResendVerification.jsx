import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { useForm } from '../hooks/useForm';
import { isValidEmail } from '../utils/validators';
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
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  text-align: center;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Footer = styled.div`
  text-align: center;
  margin: 16px 0 0 0;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 8px 0 0 0;
`;

const StyledLink = styled(Link)`
  font-size: 14px;
  color: rgb(79, 105, 191);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: rgb(79, 105, 191);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px;
  
  &:hover {
    text-decoration: underline;
  }
`;

function ResendVerification() {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'E-mail é obrigatório';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Formato de e-mail inválido';
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
      setServerError(err.response?.data?.message || 'Falha ao reenviar e-mail de verificação');
    }
  };

  if (success) {
    return (
      <Container>
        <FormCard>
          <SuccessIcon>📧</SuccessIcon>
          <Title>E-mail enviado!</Title>
          <Subtitle>
            Enviamos um novo link de verificação para <strong>{values.email}</strong>. 
            Verifique sua caixa de entrada e clique no link.
          </Subtitle>
          <ButtonGroup>
            <Link to="/login">
              <Button>Ir para Login</Button>
            </Link>
            <TextButton onClick={() => setSuccess(false)}>
              Enviar para outro e-mail
            </TextButton>
          </ButtonGroup>
        </FormCard>
      </Container>
    );
  }

  return (
    <Container>
      <FormCard>
        <Title>Reenviar verificação</Title>
        <Subtitle>
          Digite seu e-mail para receber um novo link de verificação.
        </Subtitle>

        {serverError && (
          <Alert
            type="error"
            message={serverError}
            onClose={() => setServerError('')}
          />
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('email')}
            required
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Reenviar e-mail'}
          </Button>
        </Form>

        <Footer>
          <StyledLink to="/login">← Voltar para Login</StyledLink>
          <FooterText>
            Não possui uma conta? <StyledLink to="/register">Criar conta</StyledLink>
          </FooterText>
        </Footer>
      </FormCard>
    </Container>
  );
}

export default ResendVerification;