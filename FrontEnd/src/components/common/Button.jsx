import styled from 'styled-components';

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid rgb(79, 105, 191);
  color: rgb(79, 105, 191);
  margin: 0 1em;
  padding: 0.25em 1em;
  cursor: pointer;
  
  &:hover {
    background: rgb(79, 105, 191);
    color: white;
  }

  &:active {
    background: rgb(79, 105, 191);
    color: white;
  }
`;

export default Button;