import styled, { keyframes } from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { categoryTemplateAtom } from "../atom";
import PaintBoard from "../components/PaintBoard";

const animation_boards = keyframes`
  from{
    opacity:0%;
  }
  to{
    opacity:100%;
  };
`;

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 5rem - 6rem);
  animation: ${animation_boards} 0.4s ease-out;
`;

const Boards = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 50px;
  justify-content: center;
  overflow-y: auto;

  & > div:not(:first-child) {
    margin-left: 2rem;
  }
`;

const Categories = styled.div`
  margin: 10px 0;
`;

const Button = styled.button`
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  border-radius: 25px;
  height: 40px;
  padding: 0px 20px;
  margin: 0 20px;
  border: none;
  font-size: 20px;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    color: var(--hotpink);
    font-weight: 600;
  }
`;

function Board() {
  const { category } = useParams();
  const currentCategory = category ?? "";
  const myLikesTemplate = useRecoilValue(categoryTemplateAtom);
  const [currentBoard, setCurrentBoard] = useState<string>(Object.keys(myLikesTemplate[currentCategory].selectingFieldsAndOptions)[0]);
  const boardClick = (attr: string) => {
    setCurrentBoard(attr);
  };
  const onDragEnd = (info: DropResult) => {
    console.log(info);
  };
  return (
    <BoardWrapper>
      <Categories>
        {Object.keys(myLikesTemplate[currentCategory].selectingFieldsAndOptions).map((fieldName) => (
          <Button key={fieldName} onClick={() => boardClick(fieldName)}>
            {fieldName}
          </Button>
        ))}
      </Categories>
      {currentBoard ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Boards>
            {myLikesTemplate[currentCategory].selectingFieldsAndOptions[currentBoard].map((option, index) => (
              <PaintBoard key={index} currentBoard={currentBoard} boardId={option} />
            ))}
          </Boards>
        </DragDropContext>
      ) : null}
    </BoardWrapper>
  );
}

export default Board;
