import styled from "styled-components";
import Table from "./Table";
import RegisterModal from "./RegisterModal";
import {
  myLikesCategoryAtom,
  registerModalOnAtom,
  likesFireAtom,
} from "./atoms_mylikes";
import { useRecoilState } from "recoil";
import { Routes, Route, Link } from "react-router-dom";
import Genre from "./Genre";
import { onSnapshot, query, collection, where, doc } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useEffect } from "react";
import { ILike } from "./atoms_mylikes";
import { likesRankingFireAtom } from "./atoms_mylikes";
import { useRecoilValue } from "recoil";
import { loggedInUserAtom } from "../../atom";

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Menu = styled.div``;

const Button = styled.button`
  font-size: 18px;
  font-weight: 500;
  background-color: transparent;
  text-decoration: underline;
  padding: 10px 30px;
  margin-bottom: 20px;
  border: none;
  cursor: pointer;

  transition: 0.2s;
  a {
    transition: 0.2s;
    font-weight: 600;
  }
  &:hover {
    color: #ff0063;
    a {
      color: #ff0063;
    }
  }
`;

function MyLike() {
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const currentCategory = useRecoilValue(myLikesCategoryAtom);
  console.log("****", currentCategory);
  const [modalOn, setModalOn] = useRecoilState(registerModalOnAtom);
  const [likes, setLikes] = useRecoilState(likesFireAtom);
  const [ranking, setRanking] = useRecoilState(likesRankingFireAtom);
  const modalOpen = () => {
    setModalOn(true);
  };
  useEffect(() => {
    const q = query(
      collection(dbService, currentCategory),
      where("creatorId", "==", loggedInUser?.uid)
    );
    onSnapshot(q, (querySnapshot) => {
      const likesDB = [] as ILike[];
      querySnapshot.forEach((doc) => {
        likesDB.push({ ...(doc.data() as ILike) });
      });
      setLikes(likesDB);
    });
    console.log("useEffect&snapshot rendered.");
  }, [currentCategory]);
  useEffect(() => {
    onSnapshot(
      doc(dbService, currentCategory, `ranking_${loggedInUser?.uid}`),
      (doc) => {
        setRanking({ ...doc.data() });
      }
    );
  }, [currentCategory]);
  useEffect(() => {
    const orderedLikes = likes.slice();
    orderedLikes.sort((a, b) => ranking[a.id] - ranking[b.id]);
    setLikes(orderedLikes);
  }, [ranking]);
  console.log(ranking);
  return (
    <>
      <Wrapper>
        <Menu>
          <Button onClick={modalOpen}>Register</Button>
          {modalOn && <RegisterModal />}
          <Button>
            <Link to="table">Ranking Table</Link>
          </Button>
          <Button>
            <Link to="genre">Genre Board</Link>
          </Button>
        </Menu>
      </Wrapper>
      <Routes>
        <Route path="table" element={<Table />} />
        <Route path="genre" element={<Genre />} />
      </Routes>
    </>
  );
}

export default MyLike;
