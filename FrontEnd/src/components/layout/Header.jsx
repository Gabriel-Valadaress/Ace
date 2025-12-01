import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { getInitials } from '../../utils/formatters';

const HeaderWrapper = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderBar = styled.div`
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;

  span:first-child {
    font-size: 24px;
  }
  span:last-child {
    font-size: 18px;
    font-weight: 700;
    color: #333;
  }
`;

const MenuButton = styled.button`
  padding: 6px;
  border: none;
  background: transparent;
  border-radius: 6px;

  &:active {
    background: #f3f4f6;
  }
`;

const MobileMenu = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 12px 0;
`;

const MenuItem = styled(Link)`
  display: block;
  padding: 10px 16px;
  text-decoration: none;
  color: #444;
  font-size: 15px;

  &:active {
    background: #f3f4f6;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  color: #d32f2f;
  font-size: 15px;

  &:active {
    background: #f3f4f6;
  }
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #4f67c6;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
`;

const AvatarImg = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 50%;
`;

function Header() {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/players', label: 'Players' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <HeaderWrapper>
      <HeaderBar>
        <Logo to="/dashboard">
          <span>Ace</span>
        </Logo>

        <MenuButton onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? (
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h18M4 12h18M4 18h18" />
            </svg>
          )}
        </MenuButton>
      </HeaderBar>

      {menuOpen && (
        <MobileMenu>
          <ProfileBox>
            {profile?.photoUrl ? (
              <AvatarImg
                src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${profile.photoUrl}`}
                alt="Profile"
              />
            ) : (
              <Avatar>{getInitials(profile?.fullName || user?.email || 'U')}</Avatar>
            )}
            <div>
              <div style={{ fontWeight: 600, color: '#333' }}>
                {profile?.fullName || user?.email}
              </div>
              <div style={{ fontSize: '13px', color: '#777' }}>Conta</div>
            </div>
          </ProfileBox>

          {navLinks.map((link) => (
            <MenuItem
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </MenuItem>
          ))}

          <MenuItem to="/profile" onClick={() => setMenuOpen(false)}>
            Meu Perfil
          </MenuItem>

          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </MobileMenu>
      )}
    </HeaderWrapper>
  );
}

export default Header;
