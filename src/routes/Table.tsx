import styled, { keyframes } from "styled-components";
import { useState } from "react";
import { dbService } from "../fbase";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { DragDropContext, DropResult, Droppable, Draggable } from "react-beautiful-dnd";
import { doc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";

import { loggedInUserAtom, ILike, likesRankingAtom, IRanking, likesAtom, categoryTemplateAtom } from "../atom";
import UpdateModal from "../components/UpdateModal";

function Table() {
  const { category = "" } = useParams();

  const myLikesTemplate = useRecoilValue(categoryTemplateAtom);
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const ranking = useRecoilValue(likesRankingAtom);
  const likes = useRecoilValue(likesAtom);
  const [updateOne, setUpdateOne] = useState<ILike | "">("");

  const init = Object.keys(myLikesTemplate).length !== 0;

  const onModalOnDbClick = (id: string) => {
    if (updateOne === "") {
      setUpdateOne(likes.filter((like) => like.id === id)[0]);
    }
  };

  const onModalOffClick = () => {
    if (updateOne !== "") setUpdateOne("");
  };

  const setNewRanking = async (newRanking: IRanking, likeId?: ILike["id"]) => {
    const rankingDoc = doc(dbService, category, `ranking_${loggedInUser?.uid}`);
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
    await deleteDoc(doc(dbService, category, like.id));
    const copyRanking = Object.assign({}, ranking);
    Object.keys(copyRanking).forEach(
      (songId) => copyRanking[songId] > copyRanking[like.id] && (copyRanking[songId] = copyRanking[songId] - 1)
    );
    delete copyRanking[like.id];
    setNewRanking(copyRanking, like.id);
  };

  const TrLength = init
    ? (myLikesTemplate[category].typingFields.length || 0) +
      Object.keys(myLikesTemplate[category].selectingFieldsAndOptions).length +
      1
    : 0;

  return (
    <>
      {init && (
        <TableWrapper>
          <DragDropContext onDragEnd={onDragEnd}>
            <TableArea>
              <thead>
                <Tr headerLength={TrLength}>
                  <Th>Rank</Th>
                  {myLikesTemplate[category].typingFields.map((fieldName, index) => (
                    <Th key={index}>{fieldName}</Th>
                  ))}
                  {Object.keys(myLikesTemplate[category].selectingFieldsAndOptions).map((fieldName, index) => (
                    <Th key={index}>{fieldName}</Th>
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
                            {myLikesTemplate[category]?.typingFields.map((fieldName) => (
                              <Td key={fieldName}>{like[fieldName]}</Td>
                            ))}
                            {myLikesTemplate[category]?.selectingFieldsAndOptions
                              ? Object.keys(myLikesTemplate[category].selectingFieldsAndOptions).map(
                                  (fieldName, index) => <Td key={index}>{like[fieldName]}</Td>
                                )
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
            {updateOne !== "" ? <UpdateModal like={updateOne} modalClose={onModalOffClick} /> : null}
          </DragDropContext>
        </TableWrapper>
      )}
    </>
  );
}

export default Table;

const animation = keyframes`
  from{
    opacity:0%;
  }
  to{
    opacity:100%;
  };
`;

const TableWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 5rem - 6rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow-y: auto;
`;

const TableArea = styled.table`
  width: 70%;
  position: absolute;
  top: 0;
  animation: ${animation} 0.4s ease-out;

  & > thead > tr {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const Tbody = styled.tbody`
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

const Tr = styled.tr<{ headerLength: number }>`
  position: relative;
  font-size: 20px;
  display: grid;
  grid-template-columns: 0.5fr 1.5fr repeat(${(props) => props.headerLength - 2}, 1fr);
  border-radius: 25px;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const Th = styled.th`
  padding: 15px 0;
  font-weight: 600;
`;

const Td = styled.td`
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
  padding: 15px 0;
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
