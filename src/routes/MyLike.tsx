import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import { onSnapshot, query, collection, where, doc } from "firebase/firestore";

import { dbService } from "../fbase";
import { loggedInUserAtom, likesAtom, ILike, likesRankingAtom } from "../atom";
import Table from "./Table";
import Board from "./Board";
import RegisterModal from "../components/RegisterModal";

const Wrapper = styled.div`
  margin-top: 3rem;
  background: linear-gradient(to bottom, #fdf9fc, #ffcdfc);
  width: 100vw;
  height: calc(100vh - 5rem);
`;

const Menu = styled.div`
  width: inherit;
  height: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  position: relative;

  button {
    position: absolute;
  }

  & > button:last-of-type {
    right: 2rem;
  }
`;

const Title = styled.div`
  font-size: 30px;
  line-height: 6rem;

  button {
    height: 6rem;
    margin-left: 10px;
  }
`;

const Button = styled.button`
  font-size: 30px;
  font-weight: 600;
  background-color: transparent;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  padding: 0px 15px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  svg {
    transition: 0.2s;
    fill: white;
    filter: drop-shadow(1px 1px 2px rgb(0 0 0 / 0.3));
  }

  &:hover {
    color: var(--hotpink);

    svg {
      fill: var(--hotpink);
    }
  }
`;

function MyLike() {
  const { category } = useParams();
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const currentCategory = category ?? "";
  const [isModalOn, setIsModalOn] = useState(false);
  const [rareLikes, setRareLikes] = useState<ILike[]>([]);
  const [likes, setLikes] = useRecoilState(likesAtom);
  const [ranking, setRanking] = useRecoilState(likesRankingAtom);
  const { pathname } = useLocation();

  const onModalOnClick = () => {
    setIsModalOn(true);
  };

  const onModalOffClick = () => {
    setIsModalOn(false);
  };

  useEffect(() => {
    const q = query(collection(dbService, currentCategory), where("creatorId", "==", loggedInUser?.uid));
    onSnapshot(q, (querySnapshot) => {
      const likesDB = [] as ILike[];
      querySnapshot.forEach((doc) => {
        likesDB.push({ ...(doc.data() as ILike) });
      });
      setRareLikes(likesDB);
    });
    console.log("useEffect&snapshot rendered.");
  }, [currentCategory]);

  useEffect(() => {
    onSnapshot(doc(dbService, currentCategory, `ranking_${loggedInUser?.uid}`), (doc) => {
      setRanking({ ...doc.data() });
    });
  }, [currentCategory]);

  useEffect(() => {
    const orderedLikes = rareLikes.slice();
    orderedLikes.sort((a, b) => ranking[a.id] - ranking[b.id]);
    setLikes(orderedLikes);
  }, [rareLikes]);

  useEffect(() => {
    const orderedLikes = likes.slice();
    orderedLikes.sort((a, b) => ranking[a.id] - ranking[b.id]);
    setLikes(orderedLikes);
  }, [ranking]);

  return (
    <>
      <Wrapper>
        <Menu>
          <Title>
            {currentCategory}
            <Button onClick={onModalOnClick}>+</Button>
          </Title>
          <Button>
            {pathname === `/${category}` ? (
              <Link to={`/${category}/board`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                  <path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                </svg>
              </Link>
            ) : (
              <Link to={`/${category}`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                  <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm64 0v64h64V96H64zm384 0H192v64H448V96zM64 224v64h64V224H64zm384 0H192v64H448V224zM64 352v64h64V352H64zm384 0H192v64H448V352z" />
                </svg>
              </Link>
            )}
          </Button>
        </Menu>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/board" element={<Board />} />
        </Routes>
      </Wrapper>
      {isModalOn && <RegisterModal onModalOffClick={onModalOffClick} />}
    </>
  );
}

export default MyLike;
