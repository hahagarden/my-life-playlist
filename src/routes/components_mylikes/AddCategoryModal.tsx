import styled, { keyframes } from 'styled-components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { dbService } from '../../fbase';
import { loggedInUserAtom } from '../../atom';
import { setDoc, doc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

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
`;

const ModalWindow = styled.div`
  display: 'flex';
  background-color: white;
  border: 4px solid navy;
  border-radius: 15px;
  width: 550px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const InputLine = styled.td`
  position: relative;
  left: -10px;
  margin-top: 10px;
  width: 400px;
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  width: 200px;
  height: 35px;
  margin-left: 10px;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
  background-color: inherit;
  color: black;
  font-size: 20px;
  transition: border-bottom 0.3s;
  &:focus {
    border-bottom: 1px solid black;
  }
`;

const TemplateInput = styled.input`
  width: 175px;
  height: 35px;
  margin-left: 10px;
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
  &:nth-child(2) {
    width: 200px;
  }
`;

const TemplateHeaderInput = styled(TemplateInput)`
  font-size: 25px;
  font-weight: 500;
  text-align: center;
  &::placeholder {
    text-align: center;
    font-size: 22px;
  }
`;

const AddButton = styled.button`
  position: absolute;
  right: -30px;
  top: 25%;
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
  border: 1px solid black;
  border-radius: 15px;
  width: 300px;
  height: 35px;
  color: black;
  font-size: 20px;
  margin: 25px;
  margin-top: 60px;
  cursor: pointer;
  transition: background-color, color 0.3s;
  &:hover {
    background-color: navy;
    color: white;
  }
`;

interface IAddCategoryForm {
  categoryName: string;
  [attrs: string]: string;
}

interface IAddCategoryModalProps {
  onModalOffClick: () => void;
}

function AddCategoryModal({ onModalOffClick }: IAddCategoryModalProps) {
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const { register, handleSubmit } = useForm<IAddCategoryForm>();
  const addCategorySubmit = async (data: IAddCategoryForm) => {
    const typingAttrs: string[] = [];
    const selectingAttrs: { [selectingAttr: string]: string[] } = {};
    Object.keys(data).forEach((attr) => {
      if (attr.includes('typingAttr')) typingAttrs.push(data[attr]);
      else if (attr.includes('selectingAttr')) {
        const id = attr.slice(14);
        selectingAttrs[data[attr]] = data[`selectOptions_${id}`].split(',');
      }
    });
    const newCategory = {
      typingAttrs,
      selectingAttrs,
      createdAt: Date.now(),
    };
    try {
      await setDoc(
        doc(dbService, 'MyLikes_template', `template_${loggedInUser?.uid}`),
        { [data.categoryName]: newCategory },
        { merge: true }
      ); //add ranking_uid document
    } catch (e) {
      console.error('Error adding document', e);
    }
  };

  const [addTemplateInput, setAddTemplateInput] = useState([nanoid().slice(0, 10)]);
  const addTemplateInputClick = () => {
    setAddTemplateInput((prev) => [...prev, nanoid().slice(0, 10)]);
  };
  const deleteTemplateInputClick = (id: string) => {
    setAddTemplateInput((current) => {
      const copyArray = [...current];
      copyArray.splice(copyArray.indexOf(id), 1);
      return copyArray;
    });
  };

  const [addTemplateSelectingInput, setAddTemplateSelectingInput] = useState([nanoid().slice(0, 10)]);
  const addTemplateSelectingInputClick = () => {
    setAddTemplateSelectingInput((prev) => [...prev, nanoid().slice(0, 10)]);
  };
  const deleteTemplateSelectingInputClick = (id: string) => {
    setAddTemplateSelectingInput((current) => {
      const copyArray = [...current];
      copyArray.splice(copyArray.indexOf(id), 1);
      return copyArray;
    });
  };

  return (
    <>
      <ModalBackground onClick={onModalOffClick}>
        <ModalWindow onClick={(event) => event.stopPropagation()}>
          <Form onSubmit={handleSubmit(addCategorySubmit)}>
            <Header>
              <Title>
                <TemplateHeaderInput
                  id='categoryName'
                  placeholder='Category Name'
                  autoComplete='off'
                  {...register('categoryName', { required: true })}
                ></TemplateHeaderInput>
              </Title>
              <CloseButton onClick={onModalOffClick}>×</CloseButton>
            </Header>
            <table id='table'>
              <tbody>
                <tr>
                  <InputLine>
                    <TemplateInput
                      placeholder="'title' or 'name'"
                      autoComplete='off'
                      {...register('typingAttr_name', {
                        required: true,
                        pattern: /^[a-z,]+$/i,
                        validate: (value) => value.includes('name') || value.includes('title'),
                      })}
                    ></TemplateInput>
                    <Input disabled={true}></Input>
                  </InputLine>
                </tr>

                {addTemplateInput.map((id) => {
                  return (
                    <tr key={id}>
                      <InputLine>
                        <TemplateInput
                          placeholder='typing attribute'
                          autoComplete='off'
                          {...register(`typingAttr_${id}`, {
                            required: true,
                            pattern: /^[a-z0-9]+$/i,
                          })}
                        ></TemplateInput>
                        <Input disabled={true}></Input>
                        <AddButton type='button' onClick={addTemplateInputClick}>
                          ＋
                        </AddButton>
                        <AddButton type='button' onClick={() => deleteTemplateInputClick(id)}>
                          －
                        </AddButton>
                      </InputLine>
                    </tr>
                  );
                })}
                {addTemplateSelectingInput.map((id) => {
                  return (
                    <tr key={id}>
                      <InputLine>
                        <TemplateInput
                          placeholder='selecting attribute'
                          id='selectingAttr'
                          autoComplete='off'
                          {...register(`selectingAttr_${id}`)}
                        ></TemplateInput>
                        <TemplateInput
                          placeholder='options(,)'
                          id='selectOptions'
                          autoComplete='off'
                          {...register(`selectOptions_${id}`)}
                        ></TemplateInput>
                        <AddButton type='button' onClick={addTemplateSelectingInputClick}>
                          ＋
                        </AddButton>
                        <AddButton type='button' onClick={() => deleteTemplateSelectingInputClick(id)}>
                          －
                        </AddButton>
                      </InputLine>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Button>submit</Button>
          </Form>
        </ModalWindow>
      </ModalBackground>
    </>
  );
}

export default AddCategoryModal;
