import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import profileService from '../services/profileService';
import { getInitials } from '../utils/formatters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const SearchCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 32px;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 16px;
`;

const SearchInputWrapper = styled.div`
  flex: 1;
`;

const ResultsInfo = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
`;

const PlayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PlayerCard = styled(Link)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgb(79, 105, 191);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
`;

const AvatarImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PlayerName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin: 0 0 4px 0;
`;

const PlayerAge = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
`;

const PlayerStats = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const RankingBadge = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: rgb(79, 105, 191);
  margin-bottom: 4px;
`;

const Record = styled.div`
  font-size: 13px;
  color: #666;
`;

const ArrowIcon = styled.svg`
  width: 20px;
  height: 20px;
  color: #999;
  flex-shrink: 0;
`;

const LoadingContainer = styled.div`
  padding: 48px 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #666;
  padding: 0 16px;
`;

function Players() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [hasSearched, setHasSearched] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5230';

  const handleSearch = async (page = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await profileService.searchPlayers(query, page, pagination.pageSize);
      
      if (response.success) {
        setPlayers(response.data.items);
        setPagination({
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao buscar jogadores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handlePageChange = (newPage) => {
    handleSearch(newPage);
  };

  return (
    <Container>
      <Header>
        <Title>Encontrar Jogadores</Title>
        <Subtitle>Busque jogadores de beach tennis por nome.</Subtitle>
      </Header>

      <SearchCard>
        <SearchForm onSubmit={handleSubmit}>
          <SearchInputWrapper>
            <Input
              name="search"
              type="text"
              placeholder="Buscar por nome..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchInputWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </SearchForm>
      </SearchCard>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {loading ? (
        <LoadingContainer>
          <Loading text="Buscando..." />
        </LoadingContainer>
      ) : hasSearched ? (
        players.length > 0 ? (
          <>
            <ResultsInfo>
              {pagination.totalItems} jogador{pagination.totalItems !== 1 ? 'es' : ''} encontrado{pagination.totalItems !== 1 ? 's' : ''}
            </ResultsInfo>

            <PlayersList>
              {players.map((player) => (
                <PlayerCard
                  key={player.userId}
                  to={`/players/${player.userId}`}
                >
                  {player.photoUrl ? (
                    <AvatarImage
                      src={`${apiBaseUrl}/${player.photoUrl}`}
                      alt={player.fullName}
                    />
                  ) : (
                    <Avatar>
                      {getInitials(player.fullName)}
                    </Avatar>
                  )}

                  <PlayerInfo>
                    <PlayerName>{player.fullName}</PlayerName>
                    <PlayerAge>{player.age} anos</PlayerAge>
                  </PlayerInfo>

                  <PlayerStats>
                    <RankingBadge>#{player.ranking || 'N/A'}</RankingBadge>
                    <Record>
                      {player.winsCount}V - {player.lossesCount}D
                    </Record>
                  </PlayerStats>

                  <ArrowIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </ArrowIcon>
                </PlayerCard>
              ))}
            </PlayersList>

            {pagination.totalPages > 1 && (
              <Pagination>
                <Button
                  onClick={() => handlePageChange(pagination.pageNumber - 1)}
                  disabled={pagination.pageNumber === 1}
                >
                  Anterior
                </Button>
                
                <PageInfo>
                  Página {pagination.pageNumber} de {pagination.totalPages}
                </PageInfo>
                
                <Button
                  onClick={() => handlePageChange(pagination.pageNumber + 1)}
                  disabled={pagination.pageNumber === pagination.totalPages}
                >
                  Próxima
                </Button>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyTitle>Nenhum jogador encontrado</EmptyTitle>
            <EmptyText>Tente uma busca diferente.</EmptyText>
          </EmptyState>
        )
      ) : (
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <EmptyTitle>Buscar Jogadores</EmptyTitle>
          <EmptyText>Digite um nome acima para encontrar jogadores de beach tennis.</EmptyText>
        </EmptyState>
      )}
    </Container>
  );
}

export default Players;