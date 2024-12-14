import styled from "styled-components";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { authService } from "../fbase";
import { useRecoilValue } from "recoil";
import { loggedInUserAtom } from "../atom";

export default function Header() {
  const navigate = useNavigate();

  const loggedInUser = useRecoilValue(loggedInUserAtom);

  const onLogOutClick = async () => {
    if (window.confirm("로그아웃 하시겠습니까?"))
      try {
        await signOut(authService);
        alert("로그아웃되었습니다.");
        navigate("/");
      } catch (e) {
        console.error("로그아웃 중 에러 발생", e);
      }
  };

  return (
    <HeaderContainer>
      <Title to="/">my life playlist</Title>
      <Username>{loggedInUser?.username}</Username>
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
