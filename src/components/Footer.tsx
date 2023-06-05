import styled from "styled-components";

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
  font-size: 0.8rem;
  font-weight: 200;
`;

export default function Footer() {
  return <FooterContainer>&copy; hahagarden 2023</FooterContainer>;
}
