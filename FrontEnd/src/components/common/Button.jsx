import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${props => props.disabled ? '#ccc' : 'rgb(79, 105, 191)'};
  border-radius: 6px;
  border: none;
  color: white;
  padding: 10px 24px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s, opacity 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 100px;
  
  &:hover {
    background: ${props => props.disabled ? '#ccc' : 'rgb(65, 90, 170)'};
  }

  &:active {
    background: ${props => props.disabled ? '#ccc' : 'rgb(55, 75, 150)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function Button({ children, loading, disabled, type = 'button', onClick, ...props }) {
  return (
    <StyledButton
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </StyledButton>
  );
}

export default Button;