import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
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
  width: 100vw;
  min-height: 100vh;
  padding: 24px;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 450px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PasswordHint = styled.p`
  font-size: 12px;
  color: #666;
  margin: 4px 0 0 0;
`;

const Footer = styled.div`
  margin-top: 24px;
  text-align: center;
`;

const FooterText = styled.p`
  color: #666;
  margin: 0;
`;

const StyledLink = styled(Link)`
  color: rgb(79, 105, 191);
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessContainer = styled.div`
  max-width: 450px;
  width: 100%;
  text-align: center;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 48px 32px;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const SuccessTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const SuccessMessage = styled.p`
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

const Strong = styled.strong`
  color: #333;
`;

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    values,
    errors,
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
        <SuccessContainer>
          <SuccessCard>
            <SuccessIcon>✉️</SuccessIcon>
            <SuccessTitle>Verifique seu e-mail!</SuccessTitle>
            <SuccessMessage>
              Enviamos um link de verificação para <Strong>{values.email}</Strong>. 
              Por favor, clique no link para ativar sua conta.
            </SuccessMessage>
            <Link to="/login">
              <Button>Ir para Login</Button>
            </Link>
          </SuccessCard>
        </SuccessContainer>
      </Container>
    );
  }

  return (
    <Container>
      <FormWrapper>
        <Header>
          <Title>Crie sua conta</Title>
          <Subtitle>Participe da comunidade de Beach Tennis</Subtitle>
        </Header>

        <FormCard>
          {serverError && (
            <Alert
              type="error"
              message={serverError}
              onClose={() => setServerError('')}
            />
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputWrapper>
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
            </InputWrapper>

            <InputWrapper>
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
            </InputWrapper>

            <InputWrapper>
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
            </InputWrapper>

            <InputWrapper>
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
            </InputWrapper>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar conta'}
            </Button>
          </Form>

          <Footer>
            <FooterText>
              Já possui uma conta?{' '}
              <StyledLink to="/login">Entrar</StyledLink>
            </FooterText>
          </Footer>
        </FormCard>
      </FormWrapper>
    </Container>
  );
}

export default Register;