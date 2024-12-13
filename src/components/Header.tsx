import styled from "styled-components";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { authService } from "../fbase";

export default function Header() {
  const navigate = useNavigate();

  const onLogOutClick = () => {
    if (window.confirm("로그아웃 하시겠습니까?"))
      signOut(authService)
        .then(() => {
          alert("로그아웃되었습니다.");
          navigate("/");
        })
        .catch();
  };

  return (
    <HeaderContainer>
      <Title to="/">my life playlist</Title>
      <Username>hahagarden</Username>
      <Logout onClick={onLogOutClick}>logout</Logout>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 3rem;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.2);
  padding-top: 1rem;
`;

const Title = styled(Link)`
  position: absolute;
  left: 50%;
  transform: translate(-50%);
`;

const Username = styled.div`
  position: absolute;
  right: 10%;
`;

const Logout = styled.button`
  position: absolute;
  right: 3%;
  height: 1rem;
  line-height: 1rem;
  font-size: 1rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;
