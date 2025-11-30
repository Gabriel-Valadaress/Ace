import styled from 'styled-components';

const AlertContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid;
  margin-bottom: 16px;
  
  ${props => {
    switch(props.type) {
      case 'success':
        return `
          background-color: #f0fdf4;
          color: #166534;
          border-color: #bbf7d0;
        `;
      case 'warning':
        return `
          background-color: #fefce8;
          color: #854d0e;
          border-color: #fef08a;
        `;
      case 'error':
        return `
          background-color: #fef2f2;
          color: #991b1b;
          border-color: #fecaca;
        `;
      default: // info
        return `
          background-color: #eff6ff;
          color: #1e40af;
          border-color: #bfdbfe;
        `;
    }
  }}
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.svg`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const Message = styled.p`
  font-size: 14px;
  margin: 0;
`;

const CloseButton = styled.button`
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const iconPaths = {
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
};

function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  return (
    <AlertContainer type={type} role="alert">
      <ContentWrapper>
        <IconWrapper
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPaths[type]}
          />
        </IconWrapper>
        <Message>{message}</Message>
      </ContentWrapper>
      
      {onClose && (
        <CloseButton onClick={onClose} aria-label="Fechar">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </CloseButton>
      )}
    </AlertContainer>
  );
}

export default Alert;