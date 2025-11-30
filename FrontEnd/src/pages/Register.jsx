import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateRegisterForm } from '../utils/validators';
import { formatCpf } from '../utils/formatters';
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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PasswordHint = styled.p`
  font-size: 12px;
  color: #666;
  margin: 4px 0 0 0;
`;

const Footer = styled.p`
  text-align: center;
  margin: 16px 0 0 0;
  font-size: 14px;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: rgb(79, 105, 191);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 48px 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

function Register() {
  const { register } = useAuth();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    values,
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

  const handleCpfChange = (e) => {
    const formatted = formatCpf(e.target.value);
    setFieldValue('cpf', formatted);
  };

  const onSubmit = async (formValues) => {
    setServerError('');
    
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

  if (success) {
    return (
      <Container>
        <SuccessCard>
          <SuccessIcon>✉️</SuccessIcon>
          <Title>Verifique seu e-mail!</Title>
          <Subtitle style={{ marginBottom: '24px' }}>
            Enviamos um link de verificação para <strong>{values.email}</strong>
          </Subtitle>
          <Link to="/login">
            <Button>Ir para Login</Button>
          </Link>
        </SuccessCard>
      </Container>
    );
  }

  return (
    <Container>
      <FormCard>
        <Title>Criar conta</Title>
        <Subtitle>Participe da comunidade</Subtitle>

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

          <Input
            label="CPF"
            name="cpf"
            type="text"
            placeholder="Digite seu CPF"
            value={values.cpf}
            onChange={handleCpfChange}
            onBlur={handleBlur}
            error={getFieldError('cpf')}
            maxLength={14}
            required
          />

          <div>
            <Input
              label="Senha"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getFieldError('password')}
              required
            />
            {!getFieldError('password') && (
              <PasswordHint>A senha deve ter pelo menos 8 caracteres</PasswordHint>
            )}
          </div>

          <Input
            label="Confirme sua senha"
            name="confirmPassword"
            type="password"
            placeholder="Digite sua senha novamente"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('confirmPassword')}
            required
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar conta'}
          </Button>
        </Form>

        <Footer>
          Já possui uma conta? <StyledLink to="/login">Entrar</StyledLink>
        </Footer>
      </FormCard>
    </Container>
  );
}

export default Register;