import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { formatDate, formatHeight, formatPhone, getInitials } from '../utils/formatters';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const PhotoWrapper = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  background: #e5e5e5;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NameAge = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: #555;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

const StatCard = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  text-align: center;

  div:first-child {
    font-size: 20px;
    font-weight: bold;
  }

  div:last-child {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 12px;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 10px;
  background: #fafafa;

  div:first-child {
    font-size: 12px;
    color: #666;
  }

  div:last-child {
    font-size: 16px;
    font-weight: 500;
  }
`;

const WinRateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WinRateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const ProgressBar = styled.div`
  width: 100%;
  background: #e0e0e0;
  height: 10px;
  border-radius: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #4caf50;
  transition: width 0.3s;
`;

const WLGrid = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 16px;
`;

const WLCard = styled.div`
  flex: 1;
  background: #fff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  text-align: center;

  div:first-child {
    font-size: 20px;
    font-weight: bold;
  }

  div:last-child {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  }
`;


function Profile() {
  const { profile, loading, hasProfile } = useProfile();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!hasProfile) {
    return (
      <PageContainer>
        <Section style={{ textAlign: 'center' }}>
          <div>👤</div>
          <h1>Sem perfil</h1>
          <p>Você ainda não criou seu perfil.</p>
          <Link to="/profile/create">
            <Button>Crie seu perfil agora</Button>
          </Link>
        </Section>
      </PageContainer>
    );
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5230';

  return (
    <PageContainer>
      {/* Header */}
      <Section>
        <ProfileHeader>
          <PhotoWrapper>
            {profile?.photoUrl ? (
              <Photo
                src={`${apiBaseUrl}/${profile.photoUrl}`}
                alt={profile.fullName}
              />
            ) : (
              <>{getInitials(profile?.fullName)}</>
            )}
          </PhotoWrapper>

          <ProfileInfo>
            <NameAge>
              <h1>{profile?.fullName}</h1>
              <p>{profile?.age} anos</p>
            </NameAge>

            <Link to="/profile/edit">
              <Button>Edit Profile</Button>
            </Link>
          </ProfileInfo>
        </ProfileHeader>
      </Section>

      {/* Stats */}
      <StatsGrid>
        <StatCard>
          <div>{profile?.matchesPlayed || 0}</div>
          <div>Partidas</div>
        </StatCard>
        <StatCard>
          <div>{profile?.winsCount || 0}</div>
          <div>Vitórias</div>
        </StatCard>
        <StatCard>
          <div>{profile?.winRate?.toFixed(1) || 0}%</div>
          <div>Taxa de vitória</div>
        </StatCard>
      </StatsGrid>

      {/* Profile details */}
      <Section>
        <h2>Detalhes do Perfil</h2>

        <DetailsGrid>
          <DetailRow>
            <div>Nome completo</div>
            <div>{profile?.fullName}</div>
          </DetailRow>
          <DetailRow>
            <div>Data de nascimento</div>
            <div>{formatDate(profile?.birthDate)}</div>
          </DetailRow>
          <DetailRow>
            <div>Celular</div>
            <div>{formatPhone(profile?.phoneNumber)}</div>
          </DetailRow>
          <DetailRow>
            <div>Altura</div>
            <div>{profile?.height ? formatHeight(profile.height) : 'Não especificado'}</div>
          </DetailRow>
        </DetailsGrid>
      </Section>

      {/* Statistics */}
      <Section>
        <h2>Estatísticas</h2>

        <WinRateContainer>
          <WinRateHeader>
            <span>Taxa de vitória</span>
            <span>{profile?.winRate?.toFixed(1) || 0}%</span>
          </WinRateHeader>

          <ProgressBar>
            <ProgressFill style={{ width: `${profile?.winRate || 0}%` }} />
          </ProgressBar>
        </WinRateContainer>

        <WLGrid>
          <WLCard>
            <div>{profile?.winsCount || 0}</div>
            <div>Vitórias</div>
          </WLCard>

          <WLCard>
            <div>{profile?.lossesCount || 0}</div>
            <div>Derrotas</div>
          </WLCard>
        </WLGrid>
      </Section>
    </PageContainer>
  );
}

export default Profile;
