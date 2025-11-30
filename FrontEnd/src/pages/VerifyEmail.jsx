import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 48px 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const Message = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const LoadingTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 16px 0 8px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/**
 * Email verification page
 */
function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!email || !token) {
        setStatus('error');
        setMessage('Link de verificação inválido. Por favor, solicite um novo.');
        return;
      }

      const result = await verifyEmail(email, token);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    };

    verify();
  }, [email, token, verifyEmail]);

  return (
    <Container>
      <Card>
        {status === 'verifying' && (
          <>
            <Loading size="large" />
            <LoadingTitle>Verificando seu e-mail...</LoadingTitle>
            <Message>Por favor, aguarde um momento.</Message>
          </>
        )}

        {status === 'success' && (
          <>
            <Icon>✅</Icon>
            <Title>E-mail verificado!</Title>
            <Message>{message}</Message>
            <Link to="/login">
              <Button>Ir para Login</Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <Icon>❌</Icon>
            <Title>Verificação falhou</Title>
            <Message>{message}</Message>
            <ButtonGroup>
              <Link to="/login">
                <Button>Ir para Login</Button>
              </Link>
              <Link to="/register">
                <Button>Criar nova conta</Button>
              </Link>
            </ButtonGroup>
          </>
        )}
      </Card>
    </Container>
  );
}

export default VerifyEmail;