import styled, { keyframes } from "styled-components";
import { registerModalOnAtom, likesAtom, categoryTemplateAtom } from "./atoms_mylikes";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { dbService } from "../../fbase";
import { setDoc, doc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { loggedInUserAtom } from "../../atom";
import { useParams } from "react-router-dom";

const animation_show = keyframes`
  from{
    opacity:0%;
  }
  to{
    opacity:100%;
  };
`;

const ModalWindow = styled.div<{ registerOn: boolean }>`
  display: ${(props) => (props.registerOn ? "flex" : "none")};
  background-color: white;
  border: 4px solid navy;
  border-radius: 15px;
  width: 500px;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: ${animation_show} 0.1s ease-out;
`;

const Header = styled.div`
  display: flex;
  margin: 25px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
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

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const InputLine = styled.div`
  position: relative;
  left: -10px;
  margin-top: 10px;
  width: 400px;
  display: flex;
  justify-content: center;
`;

const Label = styled.label`
  position: relative;
  top: 7px;
  left: -1px;
  display: inline-block;
  width: 85px;
  height: 40px;
  text-align: right;
  color: black;
  padding-right: 10px;
  font-size: 20px;
`;

const Input = styled.input`
  width:250px;
  height: 35px;
  border: none;
  border-bottom: 1px solid gray;
  outline: none;
  background-color: inherit;
  color: black;
  font-size: 20px;
  transition: border-bottom 0.3s;
  &:focus {
    border-bottom: 1px solid black;
    }
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: 1px solid black;
  border-radius: 15px;
  width: 300px;
  height: 35px;
  color: black;
  font-size: 20px;
  margin: 25px;
  margin-top: 80px;
  cursor: pointer;
  transition: background-color, color 0.3s;
  &:hover {
    background-color: navy;
    color: white;
  }
`;

interface IStringsInObject {
  [key: string]: string;
}

function Modal() {
  const { category } = useParams();
  const currentCategory = category ?? "";
  const myLikesTemplate = useRecoilValue(categoryTemplateAtom);
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const likes = useRecoilValue(likesAtom);
  const [registerOn, setRegisterOn] = useRecoilState(registerModalOnAtom);
  const { register, handleSubmit, reset } = useForm<IStringsInObject>();

  const onSubmit = async (data: IStringsInObject) => {
    const timestamp = Date.now();
    const likeId = `${loggedInUser?.uid.slice(0, 5)}_${timestamp}`;
    const baseInfo = {
      ...data,
      creatorId: loggedInUser?.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
      id: likeId,
    };

    try {
      await setDoc(doc(dbService, currentCategory, likeId), baseInfo);
      await setDoc(doc(dbService, currentCategory, `ranking_${loggedInUser?.uid}`), { [likeId]: likes.length + 1 }, { merge: true }); //add ranking_uid document
    } catch (e) {
      console.error("Error adding document", e);
    }

    const defaultValueAfterRegister: IStringsInObject = {};
    myLikesTemplate[currentCategory].typingAttrs.forEach((attr) => {
      defaultValueAfterRegister[attr] = "";
    });
    Object.keys(myLikesTemplate[currentCategory].selectingAttrs).forEach((attr) => {
      defaultValueAfterRegister[attr] = myLikesTemplate[currentCategory].selectingAttrs[attr][0];
    });
    reset(defaultValueAfterRegister);
  };

  const modalCloseClick = () => {
    setRegisterOn(false);
  };

  return (
    <ModalWindow registerOn={registerOn}>
      <Header>
        <Title>Register</Title>
        <CloseButton onClick={modalCloseClick}>×</CloseButton>
      </Header>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {myLikesTemplate[currentCategory]?.typingAttrs.map((header) => (
            <InputLine key={header}>
              <Label htmlFor="header">{header}</Label>
              <Input id={header} placeholder={header} autoComplete="off" {...register(header, { required: true })} />
            </InputLine>
          ))}
          {myLikesTemplate[currentCategory]?.selectingAttrs
            ? Object.keys(myLikesTemplate[currentCategory].selectingAttrs).map((attr) => {
                return (
                  <InputLine key={attr}>
                    <Label htmlFor={attr}>{attr}</Label>
                    <select id={attr} {...register(attr, { required: true })}>
                      {myLikesTemplate[currentCategory].selectingAttrs[attr].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </InputLine>
                );
              })
            : null}
          <Button>Add</Button>
        </Form>
      </Container>
    </ModalWindow>
  );
}

export default Modal;
