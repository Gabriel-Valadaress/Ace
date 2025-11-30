import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  padding: 0 24px;
  gap: 40px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 72px;
  font-weight: 700;
  letter-spacing: 2px;
`;

const Logo = styled.img`
  width: 60px;
  position: absolute;
  right: -70px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 500px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Container>
      <TitleContainer>
        <Title>Ace</Title>
        <Logo src="ace.svg" alt="Logo do aplicativo Ace" />
      </TitleContainer>

      <ContentContainer>
        <Description>
          Encontre torneios, veja seu histórico, head-to-head e estatísticas!
        </Description>

        <ButtonGroup>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button>Registre-se</Button>
              </Link>
              <Link to="/login">
                <Button>Entrar</Button>
              </Link>
            </>
          )}
        </ButtonGroup>
      </ContentContainer>
    </Container>
  );
}

export default Home;