import styled, { keyframes } from "styled-components";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { setDoc, doc } from "firebase/firestore";
import { nanoid } from "nanoid";

import { dbService } from "../fbase";
import { loggedInUserAtom, categoryTemplateAtom } from "../atom";
import { ERROR_CATEGORY_DUPLICATE, ERROR_FIELD_DUPLICATE } from "../errors";

interface IAddCategoryForm {
  categoryName: string;
  [inputName: string]: string;
}

interface IAddCategoryModalProps {
  onModalOffClick: () => void;
}

interface ISelectingOptions {
  [selectingFieldId: string]: string[];
}

// prefix
const TYPING_FIELD = "type_";
const SELECTING_FIELD = "select_";
const SELECTING_FIELD_OPTION = "selectOptions_";

function AddCategoryModal({ onModalOffClick }: IAddCategoryModalProps) {
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const categoryTemplate = useRecoilValue(categoryTemplateAtom);
  const [typingFieldIds, setTypingFieldIds] = useState([nanoid().slice(0, 10)]);
  const [selectingFieldIds, setSelectingFieldIds] = useState([nanoid().slice(0, 10)]);
  const [selectingFieldOptions, setSelectingFieldOptions] = useState<ISelectingOptions>({});

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<IAddCategoryForm>();

  const addCategorySubmit = async ({ categoryName, ...inputs }: IAddCategoryForm) => {
    if (categoryTemplate[categoryName])
      return setError("categoryName", { message: ERROR_CATEGORY_DUPLICATE }, { shouldFocus: true });

    const typingFields: string[] = [];
    const selectingFieldsAndOptions: { [selectingField: string]: string[] } = {};

    Object.keys(inputs).forEach((inputName) => {
      if (inputName.includes(TYPING_FIELD)) typingFields.push(inputs[inputName]);
      else if (inputName.includes(SELECTING_FIELD)) {
        const selectingFieldID = inputName.slice(SELECTING_FIELD.length);
        selectingFieldsAndOptions[inputs[inputName]] = selectingFieldOptions[selectingFieldID];
      }
    });

    const fieldnames = typingFields.concat(Object.keys(selectingFieldsAndOptions));
    if (fieldnames.length !== fieldnames.filter((fieldname, index) => fieldnames.indexOf(fieldname) === index).length)
      return setError("categoryName", { message: ERROR_FIELD_DUPLICATE }, { shouldFocus: true });

    const newCategory = {
      typingFields,
      selectingFieldsAndOptions,
      createdAt: Date.now(),
    };

    try {
      await setDoc(
        doc(dbService, "MyLikes_template", `template_${loggedInUser?.uid}`),
        { [categoryName]: newCategory },
        { merge: true }
      ); //add ranking_uid document

      const defaultValueAfterAdd: { [key: string]: string } = {};
      Object.keys(inputs).forEach((inputName) => {
        defaultValueAfterAdd[inputName] = "";
      });
      reset(defaultValueAfterAdd);
      setSelectingFieldOptions({});
    } catch (e) {
      console.error("Error adding document", e);
    }
  };

  const addTemplateInputClick = () => {
    setTypingFieldIds((prev) => [...prev, nanoid().slice(0, 10)]);
  };

  const deleteTemplateInputClick = (id: string) => {
    setTypingFieldIds((current) => {
      const copyArray = [...current];
      copyArray.splice(copyArray.indexOf(id), 1);
      return copyArray;
    });
  };

  const addTemplateSelectingInputClick = () => {
    setSelectingFieldIds((prev) => [...prev, nanoid().slice(0, 10)]);
  };

  const deleteTemplateSelectingInputClick = (id: string) => {
    setSelectingFieldIds((current) => {
      const copyArray = [...current];
      copyArray.splice(copyArray.indexOf(id), 1);
      return copyArray;
    });
  };

  const onOptionInputChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[event.target.value.length - 1] === ",") {
      const newOptions = Object.assign({}, selectingFieldOptions);
      const newOption = event.target.value.slice(0, event.target.value.length - 1);

      if (!newOptions[id]) newOptions[id] = [newOption];
      else if (newOptions[id].indexOf(newOption) !== -1) return;
      else newOptions[id] = [...newOptions[id], newOption];

      setSelectingFieldOptions(newOptions);
      event.target.value = "";
    }
  };

  const onOptionClick = (id: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const newOptions = Object.assign({}, selectingFieldOptions);
    newOptions[id].splice(newOptions[id].indexOf(event.currentTarget.innerText), 1);
    setSelectingFieldOptions(newOptions);
  };

  return (
    <>
      <ModalBackground onClick={onModalOffClick}>
        <ModalWindow onClick={(event) => event.stopPropagation()}>
          <Form onSubmit={handleSubmit(addCategorySubmit)}>
            <Title>
              <TemplateHeaderInput
                id="categoryName"
                placeholder="category name"
                autoComplete="off"
                {...register("categoryName", { required: true })}
              ></TemplateHeaderInput>
              <ErrorMessage>{errors?.categoryName?.message}</ErrorMessage>
            </Title>
            <CloseButton onClick={onModalOffClick}>×</CloseButton>

            {typingFieldIds.map((id) => {
              return (
                <InputLine key={id}>
                  <TemplateInput
                    placeholder="field name"
                    autoComplete="off"
                    {...register(`${TYPING_FIELD}${id}`, {
                      required: true,
                      pattern: /^[a-z0-9가-힣]+$/i,
                    })}
                  ></TemplateInput>
                  <AddButton type="button" onClick={addTemplateInputClick}>
                    ＋
                  </AddButton>
                  <AddButton type="button" onClick={() => deleteTemplateInputClick(id)}>
                    －
                  </AddButton>
                </InputLine>
              );
            })}

            {selectingFieldIds.map((id) => {
              return (
                <InputLine key={id}>
                  <TemplateInput
                    placeholder="field name"
                    autoComplete="off"
                    {...register(`${SELECTING_FIELD}${id}`, { pattern: /^[a-z0-9가-힣]+$/i })}
                  ></TemplateInput>

                  <TemplateInputBox>
                    <TemplateInput
                      placeholder="option with comma"
                      id={`selectOptions-${id}`}
                      autoComplete="off"
                      {...register(`${SELECTING_FIELD_OPTION}${id}`, {
                        onChange: (event) => onOptionInputChange(id, event),
                      })}
                    ></TemplateInput>
                    <OptionsBox>
                      {selectingFieldOptions[id]?.map((option) => (
                        <OptionTag key={option} onClick={(event) => onOptionClick(id, event)}>
                          {option}
                        </OptionTag>
                      ))}
                    </OptionsBox>
                  </TemplateInputBox>
                  <AddButton type="button" onClick={addTemplateSelectingInputClick}>
                    ＋
                  </AddButton>
                  <AddButton type="button" onClick={() => deleteTemplateSelectingInputClick(id)}>
                    －
                  </AddButton>
                </InputLine>
              );
            })}

            <Button>make category</Button>
          </Form>
        </ModalWindow>
      </ModalBackground>
    </>
  );
}

export default AddCategoryModal;

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
`;

const Title = styled.div`
  background: linear-gradient(to bottom, #ff8e9b, #fb7887);
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 5px 20px;
  margin: 40px 0px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 45px;
  right: -35px;
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

  &:not(:nth-of-type(2)) {
    margin-top: 15px;
  }
`;

const TemplateInputBox = styled.div`
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 10px;

  & > input {
    width: 250px;
    margin-bottom: 0px;
  }
`;

const TemplateInput = styled.input`
  width: 150px;
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

  &:nth-child(2) {
    width: 200px;
  }
`;

const TemplateHeaderInput = styled(TemplateInput)`
  width: 300px;
  height: 35px;
  text-align: center;
  font-size: 25px;
  color: var(--white);
  border: none;
  margin: 0;
  background-color: transparent;
  box-shadow: none;

  &::placeholder {
    font-size: inherit;
    color: #d8d8d8;
  }

  &:focus {
    border: none;
  }
`;

const AddButton = styled.button`
  position: absolute;
  right: -30px;
  top: 6px;
  background-color: transparent;
  border: none;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    color: rgba(0, 0, 0, 0.7);
  }
  &:last-child {
    right: -55px;
  }
`;

const Button = styled.button`
  background-color: transparent;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  border: none;
  border-radius: 25px;
  color: gray;
  font-size: 18px;
  margin: 40px 0px;
  padding: 5px 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(to bottom, #ff8e9b, #fb7887);
    color: white;
  }
`;

const OptionsBox = styled.div`
  display: flex;
  width: inherit;
  height: auto;
  padding: 5px;
  overflow-x: auto;
`;

const OptionTag = styled.div`
  display: inline-block;
  background-color: #e5e5e5;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  border: none;
  border-radius: 25px;
  padding: 5px 10px;
  cursor: pointer;

  &:not(:first-of-type) {
    margin-left: 10px;
  }
`;

const ErrorMessage = styled.p`
  width: 15rem;
  height: 2rem;
  text-align: center;
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: var(--red);
  position: absolute;
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
`;
