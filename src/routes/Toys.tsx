import styled from "styled-components";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loggedInUserAtom } from "../atom";

const Container = styled.div`
  padding: 50px;
  background-color: navy;
`;

const Shelf = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  margin-top: 50px;
  border-bottom: 4px solid white;
`;

const Area = styled.div`
  height: 400px;
`;

const Toy = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  box-shadow: 0 0 10px 0 white, inset 0 0 10px 0px rgba(0, 0, 0, 0.3);
  width: 200px;
  height: 60px;
  font-size: 25px;
  font-weight: 500;
  color: gray;
  a {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 60px;
    color: white;
  }

  &:hover {
    box-shadow: 0 0 15px 7px white, inset 0 0 5px 0px rgba(0, 0, 0, 0.3);
  }
`;

function Toys() {
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  return (
    <Container>
      <Shelf>
        <Toy>{loggedInUser ? <Link to="/mylikes">My Likes</Link> : "MyLikes"}</Toy>
        <Toy></Toy>
        <Toy></Toy>
      </Shelf>
      <Shelf>
        <Toy></Toy>
        <Toy></Toy>
        <Toy></Toy>
      </Shelf>
      <Shelf>
        <Toy></Toy>
        <Toy></Toy>
        <Toy></Toy>
      </Shelf>
      <Area></Area>
    </Container>
  );
}

export default Toys;
