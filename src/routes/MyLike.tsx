import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import { onSnapshot, query, collection, where, doc } from "firebase/firestore";

import { dbService } from "../fbase";
import { loggedInUserAtom, likesAtom, ILike, likesRankingAtom } from "../atom";
import Table from "./Table";
import Board from "./Board";
import RegisterModal from "../components/RegisterModal";
import { ReactComponent as BoardIcon } from "../assets/board.svg";
import { ReactComponent as TableIcon } from "../assets/table.svg";

function MyLike() {
  const { pathname } = useLocation();
  const { category } = useParams();
  const currentCategory = category ?? "";

  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const [isModalOn, setIsModalOn] = useState(false);
  const [rareLikes, setRareLikes] = useState<ILike[]>([]);
  const setLikes = useSetRecoilState(likesAtom);
  const [ranking, setRanking] = useRecoilState(likesRankingAtom);

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

    onSnapshot(doc(dbService, currentCategory, `ranking_${loggedInUser?.uid}`), (doc) => {
      setRanking({ ...doc.data() });
    });
  }, [currentCategory, loggedInUser?.uid, setRanking]);

  useEffect(() => {
    const orderedRareLikes = rareLikes.slice();
    orderedRareLikes.sort((a, b) => ranking[a.id] - ranking[b.id]);
    setLikes(orderedRareLikes);
  }, [ranking, rareLikes, setLikes]);

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
                <BoardIcon />
              </Link>
            ) : (
              <Link to={`/${category}`}>
                <TableIcon />
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
