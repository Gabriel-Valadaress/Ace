import { useState } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateResetPasswordForm } from '../utils/validators';
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
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Icon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  text-align: center;
`;

const PasswordHint = styled.p`
  font-size: 12px;
  color: #666;
  margin: 4px 0 0 0;
`;

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useForm({ password: '', confirmPassword: '' }, validateResetPasswordForm);

  const onSubmit = async (formValues) => {
    setServerError('');
    
    if (!email || !token) {
      setServerError('Link de redefinição inválido. Por favor, solicite um novo.');
      return;
    }

    const result = await resetPassword(
      email,
      token,
      formValues.password,
      formValues.confirmPassword
    );
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setServerError(result.message);
    }
  };

  if (!email || !token) {
    return (
      <Container>
        <FormCard>
          <Icon>❌</Icon>
          <Title>Link inválido</Title>
          <Subtitle>
            Este link de redefinição de senha é inválido ou expirou.
          </Subtitle>
          <Link to="/forgot-password">
            <Button>Solicitar novo link</Button>
          </Link>
        </FormCard>
      </Container>
    );
  }

  if (success) {
    return (
      <Container>
        <FormCard>
          <Icon>✅</Icon>
          <Title>Senha redefinida!</Title>
          <Subtitle>
            Sua senha foi redefinida com sucesso. Redirecionando para o login...
          </Subtitle>
          <Link to="/login">
            <Button>Ir para Login</Button>
          </Link>
        </FormCard>
      </Container>
    );
  }

  return (
    <Container>
      <FormCard>
        <Title>Redefinir senha</Title>
        <Subtitle>Digite sua nova senha abaixo.</Subtitle>

        {serverError && (
          <Alert
            type="error"
            message={serverError}
            onClose={() => setServerError('')}
          />
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Nova senha"
              name="password"
              type="password"
              placeholder="Digite sua nova senha"
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
            label="Confirme a nova senha"
            name="confirmPassword"
            type="password"
            placeholder="Digite sua senha novamente"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldError('confirmPassword')}
            required
          />

          <Button type="submit" loading={isSubmitting}>
            Redefinir senha
          </Button>
        </Form>
      </FormCard>
    </Container>
  );
}

export default ResetPassword;