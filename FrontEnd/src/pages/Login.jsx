import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateLoginForm } from '../utils/validators';
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

const RememberForgotRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -8px 0 0 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;

  input {
    margin-right: 8px;
    cursor: pointer;
  }
`;

const ForgotLink = styled(Link)`
  font-size: 14px;
  color: rgb(79, 105, 191);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin: 16px 0 0 0;
  font-size: 14px;
  color: #666;
`;

const ResendText = styled.p`
  font-size: 13px;
  color: #999;
  margin: 8px 0 0 0;
`;

const StyledLink = styled(Link)`
  color: rgb(79, 105, 191);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useForm(
    { email: '', password: '' },
    validateLoginForm
  );

  const onSubmit = async (formValues) => {
    setServerError('');
    
    const result = await login(formValues.email, formValues.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Entrar</Title>
        <Subtitle>Acesse sua conta</Subtitle>

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

          <RememberForgotRow>
            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Lembrar de mim
            </CheckboxLabel>
            <ForgotLink to="/forgot-password">Esqueceu a senha?</ForgotLink>
          </RememberForgotRow>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>

        <Footer>
          Não possui uma conta? <StyledLink to="/register">Criar conta</StyledLink>
          <ResendText>
            Não recebeu o e-mail de verificação?{' '}
            <StyledLink to="/resend-verification">Reenviar</StyledLink>
          </ResendText>
        </Footer>
      </FormCard>
    </Container>
  );
}

export default Login;