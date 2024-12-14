import styled, { keyframes } from "styled-components";
import { useRecoilValue } from "recoil";
import { Droppable } from "react-beautiful-dnd";
import { useState } from "react";

import { ILike, likesAtom } from "../atom";
import PaintCard from "./PaintCard";
import UpdateModal from "./UpdateModal";

interface BoardProps {
  boardId: string;
  currentBoard: string;
}

function PaintBoard({ boardId, currentBoard }: BoardProps) {
  const likes = useRecoilValue(likesAtom);
  const selectedLikes = likes.filter((like) => like[currentBoard] === boardId);
  const [updateOne, setUpdateOne] = useState<ILike | "">("");

  const onModalOnDbClick = (id: string) => {
    if (updateOne === "") {
      setUpdateOne(likes.filter((like) => like.id === id)[0]);
    }
  };

  const onModalOffClick = () => {
    if (updateOne !== "") setUpdateOne("");
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Droppable droppableId={boardId}>
        {(provided) => (
          <DroppableBoard ref={provided.innerRef} {...provided.droppableProps}>
            {selectedLikes.map((like, index) => (
              <PaintCard key={like.id} like={like} index={index} onModalOnDbClick={onModalOnDbClick} />
            ))}
            {provided.placeholder}
          </DroppableBoard>
        )}
      </Droppable>
      {updateOne !== "" ? <UpdateModal like={updateOne} modalClose={onModalOffClick} /> : null}
    </Wrapper>
  );
}

export default PaintBoard;

const animation_board = keyframes`
  0%{
    opacity:0%;
    transform:translateY(0%);
  }
40%{transform:translateY(-5%);}

  100%{
    opacity:100%;
    transform:translateY(0%);
  };
`;

const Wrapper = styled.div`
  width: 350px;
  height: 400px;
  padding: 10px;
  background-color: transparent;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.2);
  display: flex;
  border-radius: 30px;
  flex-direction: column;
  animation: ${animation_board} 0.5s ease-out;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 25px;
  margin: 15px;
`;

const DroppableBoard = styled.div`
  background-color: transparent;
  height: 100%;
`;
