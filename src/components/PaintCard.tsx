import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";

import { ILike, categoryTemplateAtom } from "../atom";

interface CardProps {
  key: string;
  like: ILike;
  index: number;
}

const DraggableCard = styled.div<{ like: ILike }>`
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  text-align: center;
  font-size: 18px;
  padding: 10px;
  margin: 10px;
  transition: 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

function PaintCard({ like, index }: CardProps) {
  const { category } = useParams();
  const currentCategory = category ?? "";
  const myLikesTemplate = useRecoilValue(categoryTemplateAtom);
  const [mouseOn, setMouseOn] = useState(false);
  const onMouseEnter = () => {
    setMouseOn(true);
  };
  const onMouseLeave = () => {
    setMouseOn(false);
  };
  return (
    <Draggable draggableId={like.id} index={index}>
      {(provided) => (
        <DraggableCard
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          like={like}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {mouseOn
            ? myLikesTemplate[currentCategory]?.typingAttrs
                .slice(1)
                .map((attr) => `${like[attr]}`)
                .join(" | ")
            : like[myLikesTemplate[currentCategory]?.typingAttrs[0]]}
        </DraggableCard>
      )}
    </Draggable>
  );
}

export default PaintCard;
