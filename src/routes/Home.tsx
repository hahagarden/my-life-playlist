import styled from "styled-components";
import { Routes, Route, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { signOut } from "firebase/auth";
import Login from "./Login";
import Join from "./Join";
import MyLikes from "./MyLikes";
import Toys from "./Toys";
import { loggedInUserAtom } from "../atom";
import { authService } from "../fbase";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #b2bec3;
  width: 100%;
`;

const Title = styled.div`
  padding: 60px;
  background-color: #1e90ff;
  box-shadow: 0 0 25px 5px white, inset 0 0 15px 0px rgba(0, 0, 0, 0.3);
  border-radius: 100px;
  margin: 20px;
  text-align: center;
  color: white;
  font-size: 40px;
  font-weight: 600;
`;

const Menu = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #ff9f29;
  box-shadow: 0 0 10px 3px white, inset 0 0 5px 0px rgba(0, 0, 0, 0.3);
  width: 100px;
  height: 45px;
  margin: 0 10px;
  border-radius: 20px;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
  a {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 45px;
    color: white;
    font-weight: 600;
  }
  transition: 0.3s;
  &:hover {
    box-shadow: 0 0 15px 7px white, inset 0 0 5px 0px rgba(0, 0, 0, 0.3);
    a {
      color: #ff0063;
    }
    color: #ff0063;
  }
`;

const Container = styled.div`
  margin-top: 295px;
  width: 100vw;
`;

function Home() {
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const LogOutClick = () => {
    if (window.confirm("Do you want to log out?"))
      signOut(authService)
        .then(() => alert("logged out"))
        .catch();
  };
  return (
    <>
      <Wrapper>
        <Header>
          <Title>{loggedInUser ? `${loggedInUser.email}'s ` : null} Project Machine</Title>
          <Menu>
            <Button>
              <Link to="/">Home</Link>
            </Button>
            {loggedInUser ? (
              <Button onClick={LogOutClick}>Logout</Button>
            ) : (
              <Button>
                <Link to="/login">Login</Link>
              </Button>
            )}
            <Button>
              <Link to="/join">Join </Link>
            </Button>
          </Menu>
        </Header>
        <Container>
          <Routes>
            <Route path="/" element={<Toys />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/mylikes/*" element={<MyLikes />} />
          </Routes>
        </Container>
      </Wrapper>
    </>
  );
}

export default Home;
