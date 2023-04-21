import { useState } from "react";
import { ILike, likesRankingAtom, IRanking, likesAtom, categoryTemplateAtom } from "./atoms_mylikes";
import styled from "styled-components";
import UpdateModal from "./UpdateModal";
import { DragDropContext, DropResult, Droppable, Draggable } from "react-beautiful-dnd";
import { keyframes } from "styled-components";
import { doc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useRecoilValue } from "recoil";
import { loggedInUserAtom } from "../../atom";
import { useParams } from "react-router-dom";

const animation = keyframes`
  from{
    opacity:0%;
  }
  to{
    opacity:100%;
  };
`;

const TableArea = styled.table`
  width: 70%;
  animation: ${animation} 0.4s ease-out;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr<{ headerLength: number }>`
  position: relative;
  font-size: 20px;
  display: grid;
  grid-template-columns: 0.5fr 1.5fr repeat(${(props) => props.headerLength - 2}, 1fr);
`;

const Th = styled.th`
  padding: 15px 0;
  border-bottom: 2px solid rgba(0, 0, 0, 0.3);
  font-weight: 600;
`;

const Td = styled.td`
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  font-size: 18px;
  font-weight: 400;
`;

const DeleteTd = styled.td`
  position: absolute;
  right: -40px;
  top: 10px;
`;
const DeleteButton = styled.button`
  width: 30px;
  height: 30px;
  font-size: 15px;
  opacity: 0.2;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.7;
  }
`;

const Area = styled.div``;

function Table() {
  const { category } = useParams();
  const currentCategory = category ?? "";
  const myLikesTemplate = useRecoilValue(categoryTemplateAtom);
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const ranking = useRecoilValue(likesRankingAtom);
  const likes = useRecoilValue(likesAtom);
  const [updateOne, setUpdateOne] = useState<ILike | "">("");

  const onModalOnDbClick = (id: string) => {
    if (updateOne === "") {
      setUpdateOne(likes.filter((like) => like.id === id)[0]);
    }
  };

  const onModalOffClick = () => {
    if (updateOne !== "") setUpdateOne("");
  };

  const setNewRanking = async (newRanking: IRanking, likeId?: ILike["id"]) => {
    const rankingDoc = doc(dbService, currentCategory, `ranking_${loggedInUser?.uid}`);
    if (likeId) {
      await updateDoc(rankingDoc, { ...newRanking, [likeId]: deleteField() });
    } else {
      await updateDoc(rankingDoc, newRanking);
    }
    //update firestore
  };

  const onDragEnd = ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return;
    const copyRanking = Object.assign({}, ranking);
    if (destination.index < source.index) {
      Object.keys(copyRanking).forEach((likeId) => {
        copyRanking[likeId] >= destination.index + 1 &&
          copyRanking[likeId] < source.index + 1 &&
          (copyRanking[likeId] = copyRanking[likeId] + 1);
      });
      copyRanking[draggableId] = destination.index + 1;
    } else if (destination.index > source.index) {
      Object.keys(copyRanking).forEach((songId) => {
        copyRanking[songId] > source.index + 1 &&
          copyRanking[songId] <= destination.index + 1 &&
          (copyRanking[songId] = copyRanking[songId] - 1);
      });
      copyRanking[draggableId] = destination.index + 1;
    }
    setNewRanking(copyRanking);
  };

  const onDelete = async (like: ILike) => {
    await deleteDoc(doc(dbService, currentCategory, like.id));
    const copyRanking = Object.assign({}, ranking);
    Object.keys(copyRanking).forEach(
      (songId) => copyRanking[songId] > copyRanking[like.id] && (copyRanking[songId] = copyRanking[songId] - 1)
    );
    delete copyRanking[like.id];
    setNewRanking(copyRanking, like.id);
  };

  const TrLength =
    (myLikesTemplate[currentCategory].typingAttrs.length || 0) +
    Object.keys(myLikesTemplate[currentCategory].selectingAttrs).length +
    1;
  console.log(myLikesTemplate);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <TableArea>
          <thead>
            <Tr headerLength={TrLength}>
              <Th>Rank</Th>
              {myLikesTemplate[currentCategory].typingAttrs.map((attr, index) => (
                <Th key={index}>{attr.charAt(0).toUpperCase() + attr.slice(1)}</Th>
              ))}
              {Object.keys(myLikesTemplate[currentCategory].selectingAttrs).map((attr, index) => (
                <Th key={index}>{attr.charAt(0).toUpperCase() + attr.slice(1)}</Th>
              ))}
            </Tr>
          </thead>
          <Droppable droppableId={"table"}>
            {(provided) => (
              <Tbody ref={provided.innerRef} {...provided.droppableProps}>
                {likes.map((like, index) => (
                  <Draggable key={like.id} draggableId={like.id} index={index}>
                    {(provided, snapshot) => (
                      <Tr
                        headerLength={TrLength}
                        onDoubleClick={() => onModalOnDbClick(like.id)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Td>{ranking[like.id]}</Td>
                        {myLikesTemplate[currentCategory]?.typingAttrs.map((attr) => (
                          <Td key={attr}>{like[attr]}</Td>
                        ))}
                        {myLikesTemplate[currentCategory]?.selectingAttrs
                          ? Object.keys(myLikesTemplate[currentCategory].selectingAttrs).map((attr, index) => (
                              <Td key={index}>{like[attr]}</Td>
                            ))
                          : null}
                        <DeleteTd onClick={(e) => onDelete(like)}>
                          <DeleteButton>×</DeleteButton>
                        </DeleteTd>
                      </Tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Tbody>
            )}
          </Droppable>
        </TableArea>
        {updateOne !== "" ? <UpdateModal like={updateOne} modalClose={onModalOffClick} /> : ""}
      </DragDropContext>
    </>
  );
}

export default Table;
