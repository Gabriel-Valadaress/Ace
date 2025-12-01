import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const WelcomeSection = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.color || '#333'};
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const ActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ComingSoonItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
`;

const ItemIcon = styled.span`
  font-size: 24px;
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemTitle = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
`;

const ItemDescription = styled.div`
  font-size: 13px;
  color: #999;
`;

const CreateProfileCard = styled.div`
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 48px 32px;
`;

const WelcomeIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const WelcomeTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const WelcomeText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const Record = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WinCount = styled.span`
  color: #22c55e;
`;

const Separator = styled.span`
  color: #ccc;
`;

const LossCount = styled.span`
  color: #ef4444;
`;

function Dashboard() {
  const { user } = useAuth();
  const { profile, loading, hasProfile } = useProfile();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!hasProfile) {
    return (
      <Container>
        <CreateProfileCard>
          <WelcomeIcon>👋</WelcomeIcon>
          <WelcomeTitle>Bem-vindo ao Beach Tennis!</WelcomeTitle>
          <WelcomeText>
            Vamos configurar seu perfil de jogador para começar. Isso ajudará outros jogadores a encontrá-lo e acompanhar suas estatísticas.
          </WelcomeText>
          <Link to="/profile/create">
            <Button>Criar seu perfil</Button>
          </Link>
        </CreateProfileCard>
      </Container>
    );
  }

  return (
    <Container>
      <WelcomeSection>
        <Title>Bem-vindo, {profile?.fullName?.split(' ')[0]}! 🏖️</Title>
        <Subtitle>Aqui está uma visão geral da sua jornada no beach tennis.</Subtitle>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatLabel>Ranking</StatLabel>
          <StatValue color="rgb(79, 105, 191)">
            #{profile?.ranking || 'N/A'}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Partidas jogadas</StatLabel>
          <StatValue>{profile?.matchesPlayed || 0}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Taxa de vitória</StatLabel>
          <StatValue color="#22c55e">
            {profile?.winRate?.toFixed(1) || 0}%
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Histórico</StatLabel>
          <StatValue>
            <Record>
              <WinCount>{profile?.winsCount || 0}</WinCount>
              <Separator>-</Separator>
              <LossCount>{profile?.lossesCount || 0}</LossCount>
            </Record>
          </StatValue>
        </StatCard>
      </StatsGrid>

      <ActionsGrid>
        <Card>
          <CardTitle>Ações rápidas</CardTitle>
          <ActionsList>
            <Link to="/players">
              <Button>🔍 Encontrar jogadores</Button>
            </Link>
            <Link to="/profile">
              <Button>👤 Ver meu perfil</Button>
            </Link>
            <Link to="/profile/edit">
              <Button>✏️ Editar perfil</Button>
            </Link>
          </ActionsList>
        </Card>

      </ActionsGrid>
    </Container>
  );
}

export default Dashboard;