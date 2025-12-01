import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

const BackLink = styled(Link)`
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

// 🔧 SOLUÇÃO: Wrapper para centralizar botão quando necessário
const ButtonWrapper = styled.div`
  width: 100%;
  
  button {
    width: 100%;
  }
`;

function ForgotPassword() {
  const { forgotPassword } = useAuth();
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
    
    const result = await forgotPassword(formValues.email);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setServerError(result.message);
    }
  };

  if (success) {
    return (
      <Container>
        <FormCard>
          <SuccessIcon>📧</SuccessIcon>
          <Title>Verifique seu e-mail!</Title>
          <Subtitle>
            Enviamos um link de redefinição de senha para <strong>{values.email}</strong>. 
            Clique no link para redefinir sua senha.
          </Subtitle>
          <ButtonWrapper>
            <Link to="/login" style={{ textDecoration: 'none', display: 'block' }}>
              <Button>Voltar para Login</Button>
            </Link>
          </ButtonWrapper>
        </FormCard>
      </Container>
    );
  }

  return (
    <Container>
      <FormCard>
        <Title>Esqueceu a senha?</Title>
        <Subtitle>
          Sem problemas! Digite seu e-mail e enviaremos um link de redefinição.
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
            {isSubmitting ? 'Enviando...' : 'Enviar link'}
          </Button>
        </Form>

        <Footer>
          <BackLink to="/login">← Voltar para Login</BackLink>
        </Footer>
      </FormCard>
    </Container>
  );
}

export default ForgotPassword;