import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import profileService from '../services/profileService';
import { formatDate, formatHeight, formatPhone, getInitials } from '../utils/formatters';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #666;
  text-decoration: none;
  margin-bottom: 24px;
  font-size: 14px;

  &:hover {
    color: #333;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
`;

const CoverImage = styled.div`
  height: 128px;
  background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%);
`;

const ProfileContent = styled.div`
  padding: 0 24px 24px;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: -48px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

const AvatarWrapper = styled.div`
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #14b8a6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AvatarImage = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InfoSection = styled.div`
  flex-grow: 1;
  margin-top: 16px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const PlayerName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin: 0 0 4px 0;
`;

const PlayerAge = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.color || '#111'};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #666;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin: 0 0 20px 0;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailItem = styled.div``;

const DetailLabel = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  font-size: 15px;
  color: #111;
`;

const ProgressWrapper = styled.div`
  margin-bottom: 16px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #22c55e;
  width: ${props => props.width}%;
  transition: width 0.3s;
`;

const RecordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 20px;
`;

const RecordCard = styled.div`
  background: ${props => props.bgColor || '#f9fafb'};
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const RecordValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.color || '#111'};
  margin-bottom: 4px;
`;

const RecordLabel = styled.div`
  font-size: 13px;
  color: ${props => props.color || '#666'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const ErrorContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 48px 24px;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px 0;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
`;

function PlayerDetail() {
  const { userId } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5230';

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await profileService.getPlayerProfile(userId);
        
        if (response.success) {
          setPlayer(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Falha ao carregar perfil do jogador');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [userId]);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <ErrorContainer>
        <Alert type="error" message={error} />
        <Link to="/players">
          <Button>Voltar para Jogadores</Button>
        </Link>
      </ErrorContainer>
    );
  }

  if (!player) {
    return (
      <ErrorContainer>
        <ErrorIcon>🤷</ErrorIcon>
        <ErrorTitle>Jogador Não Encontrado</ErrorTitle>
        <ErrorMessage>Este perfil de jogador não existe.</ErrorMessage>
        <Link to="/players">
          <Button>Voltar para Jogadores</Button>
        </Link>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <BackLink to="/players">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar para Jogadores
      </BackLink>

      <ProfileCard>
        <CoverImage />
        
        <ProfileContent>
          <ProfileHeader>
            <AvatarWrapper>
              {player?.photoUrl ? (
                <AvatarImage
                  src={`${apiBaseUrl}/${player.photoUrl}`}
                  alt={player.fullName}
                />
              ) : (
                <Avatar>
                  {getInitials(player?.fullName)}
                </Avatar>
              )}
            </AvatarWrapper>

            <InfoSection>
              <PlayerName>{player?.fullName}</PlayerName>
              <PlayerAge>{player?.age} anos</PlayerAge>
            </InfoSection>
          </ProfileHeader>
        </ProfileContent>
      </ProfileCard>

      <StatsGrid>
        <StatCard>
          <StatValue color="rgb(79, 105, 191)">#{player?.ranking || 'N/A'}</StatValue>
          <StatLabel>Ranking</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{player?.matchesPlayed || 0}</StatValue>
          <StatLabel>Partidas</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#22c55e">{player?.winsCount || 0}</StatValue>
          <StatLabel>Vitórias</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#22c55e">{player?.winRate?.toFixed(1) || 0}%</StatValue>
          <StatLabel>Taxa de Vitória</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>Detalhes do Jogador</SectionTitle>
        
        <DetailsGrid>
          <DetailItem>
            <DetailLabel>Nome Completo</DetailLabel>
            <DetailValue>{player?.fullName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Idade</DetailLabel>
            <DetailValue>{player?.age} anos</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Altura</DetailLabel>
            <DetailValue>{player?.height ? formatHeight(player.height) : 'Não especificado'}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Total de Partidas</DetailLabel>
            <DetailValue>{player?.matchesPlayed || 0}</DetailValue>
          </DetailItem>
        </DetailsGrid>
      </Section>

      <Section>
        <SectionTitle>Estatísticas</SectionTitle>
        
        <ProgressWrapper>
          <ProgressHeader>
            <span>Taxa de Vitória</span>
            <span>{player?.winRate?.toFixed(1) || 0}%</span>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill width={player?.winRate || 0} />
          </ProgressBar>
        </ProgressWrapper>

        <RecordGrid>
          <RecordCard bgColor="#f0fdf4">
            <RecordValue color="#22c55e">{player?.winsCount || 0}</RecordValue>
            <RecordLabel color="#166534">Vitórias</RecordLabel>
          </RecordCard>
          <RecordCard bgColor="#fef2f2">
            <RecordValue color="#ef4444">{player?.lossesCount || 0}</RecordValue>
            <RecordLabel color="#991b1b">Derrotas</RecordLabel>
          </RecordCard>
        </RecordGrid>
      </Section>

      <Section>
        <SectionTitle>Head-to-Head</SectionTitle>
        <EmptyState>
          <EmptyIcon>🤝</EmptyIcon>
          <EmptyText>Comparação head-to-head em breve!</EmptyText>
        </EmptyState>
      </Section>
    </Container>
  );
}

export default PlayerDetail;