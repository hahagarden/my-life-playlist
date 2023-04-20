import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled, { keyframes } from "styled-components";
import { categoryTemplateAtom } from "./atoms_mylikes";
import PaintBoard from "./PaintBoard";

const animation_boards = keyframes`
  from{
    opacity:0%;
  }
  to{
    opacity:100%;
  };
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  animation: ${animation_boards} 0.4s ease-out;
`;

const Boards = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  padding: 50px;
  background-color: #f1f2f6;
  box-shadow: 4px 4px 7px 3px rgba(0, 0, 0, 0.5);
  border-radius: 50px;
  justify-content: space-around;
`;

const Categories = styled.div`
  margin: 10px 0;
`;

const Button = styled.button`
  background-color: transparent;
  width: 80px;
  height: 40px;
  margin: 0 20px;
  border: none;
  font-size: 20px;
  color: black;
  text-decoration: underline;
  transition: 0.2s;
  cursor:pointer;
  &:hover {
    color: #ff0063;}
  }
`;

function Board() {
  const { category } = useParams();
  const currentCategory = category ?? "";
  const myLikesTemplate = useRecoilValue(categoryTemplateAtom);
  const [currentBoard, setCurrentBoard] = useState<string>(Object.keys(myLikesTemplate[currentCategory].selectingAttrs)[0]);
  const boardClick = (attr: string) => {
    setCurrentBoard(attr);
  };
  const onDragEnd = (info: DropResult) => {
    console.log(info);
  };
  return (
    <Wrapper>
      <Categories>
        {Object.keys(myLikesTemplate[currentCategory].selectingAttrs).map((attr) => (
          <Button key={attr} onClick={() => boardClick(attr)}>
            {attr}
          </Button>
        ))}
      </Categories>
      {currentBoard ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Boards>
            {myLikesTemplate[currentCategory].selectingAttrs[currentBoard].map((option, index) => (
              <PaintBoard key={index} currentBoard={currentBoard} boardId={option} />
            ))}
          </Boards>
        </DragDropContext>
      ) : null}
    </Wrapper>
  );
}

export default Board;
