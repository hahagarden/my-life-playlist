import styled, { keyframes } from "styled-components";
import { useRecoilValue } from "recoil";
import { useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { dbService } from "../fbase";
import { ILike, categoryTemplateAtom } from "../atom";

interface IUpdateModalProps {
  like: ILike;
  modalClose: () => void;
}

interface IForm {
  [key: string]: string | number;
}

function UpdateModal({ like, modalClose }: IUpdateModalProps) {
  const { category = "" } = useParams();

  const myLikesTemplate = useRecoilValue(categoryTemplateAtom);

  const { register, handleSubmit, setValue } = useForm<IForm>();

  useEffect(() => {
    myLikesTemplate[category]?.typingFields.forEach((fieldName) => setValue(fieldName, like[fieldName]));
    Object.keys(myLikesTemplate[category]?.selectingFieldsAndOptions).forEach((fieldName) =>
      setValue(fieldName, like[fieldName])
    );
  }, []);

  const onSubmit = async (data: IForm) => {
    if (!myLikesTemplate[category]?.typingFields.filter((fieldName) => like[fieldName] !== data[fieldName])) {
      alert("there is no change.");
      return;
    } else {
      const updatingLike = doc(dbService, category, like.id);
      let updatedLike: { [key: string]: string | number } = {};

      myLikesTemplate[category]?.typingFields.forEach((fieldName) => (updatedLike[fieldName] = data[fieldName]));

      Object.keys(myLikesTemplate[category]?.selectingFieldsAndOptions).forEach(
        (fieldName) => (updatedLike[fieldName] = data[fieldName])
      );

      await updateDoc(updatingLike, {
        ...updatedLike,
        updatedAt: Date.now(),
      });

      alert("updated.");
      modalClose();
    }
  };

  return (
    <ModalBackground onClick={modalClose}>
      <ModalWindow onClick={(event) => event.stopPropagation()}>
        <Title>
          <TitleText>{category}</TitleText>
        </Title>
        <CloseButton onClick={modalClose}>×</CloseButton>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {myLikesTemplate[category]?.typingFields.map((fieldName) => (
            <InputLine key={fieldName}>
              <Label htmlFor={fieldName}>{fieldName}</Label>
              <Input
                id={fieldName}
                placeholder={fieldName}
                autoComplete="off"
                {...register(fieldName, { required: true })}
              />
            </InputLine>
          ))}
          {myLikesTemplate[category]?.selectingFieldsAndOptions
            ? Object.keys(myLikesTemplate[category]?.selectingFieldsAndOptions).map((fieldName) => {
                return (
                  <InputLine key={fieldName}>
                    <Label htmlFor={fieldName}>{fieldName}</Label>
                    <Select id={fieldName} {...register(fieldName, { required: true })}>
                      {myLikesTemplate[category]?.selectingFieldsAndOptions[fieldName].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </InputLine>
                );
              })
            : null}
          <Button>update item</Button>
        </Form>
      </ModalWindow>
    </ModalBackground>
  );
}

export default UpdateModal;

const animation_show = keyframes`
  from{
    opacity:0%;
  }
  to{
    opacity:100%;
  };
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const ModalWindow = styled.div`
  display: flex;
  background-color: white;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  width: 550px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${animation_show} 0.1s ease-out;
  position: relative;
`;

const Title = styled.div`
  background: linear-gradient(to bottom, #ff8e9b, #fb7887);
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 5px 20px;
  margin: 40px 0px;
  position: relative;
`;

const TitleText = styled.div`
  width: 300px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 25px;
  color: var(--white);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 45px;
  right: 30px;
  background-color: transparent;
  border: none;
  font-size: 22px;
  color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: rgba(0, 0, 0, 0.7);
  }
`;

const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputLine = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  width: 250px;
  height: 35px;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.1);
  outline: none;
  background-color: inherit;
  font-size: 18px;
  transition: border-bottom 0.3s;
  text-align: center;
  margin-bottom: 10px;

  &::placeholder {
    color: #a8a8a8;
    font-weight: 400;
    font-size: 15px;
  }
`;

const Label = styled.label`
  position: relative;
  top: 7px;
  left: -1px;
  display: inline-block;
  width: 85px;
  height: 40px;
  text-align: center;
  color: black;
  padding-right: 10px;
  font-size: 20px;
`;

const Button = styled.button`
  background-color: transparent;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  border: none;
  border-radius: 25px;
  color: gray;
  font-size: 18px;
  margin: 40px 0px;
  padding: 5px 30px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(to bottom, #ff8e9b, #fb7887);
    color: white;
  }
`;

const Select = styled.select`
  width: 250px;
  height: 35px;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.1);
  outline: none;
  background-color: inherit;
  font-size: 18px;
  transition: border-bottom 0.3s;
  text-align: center;
  margin-bottom: 10px;
  background: white;
  cursor: pointer;

  appearance: none;
  -webkit-appearance: none; /* 사파리, 크롬 하위버전용 */
  -moz-appearance: none; /* 사파리, 크롬 하위버전용 */

  &::-ms-expand {
    display: none;
  }
`;
