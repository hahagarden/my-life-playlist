import styled from "styled-components";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { useEffect } from "react";
import MyLike from "./components_mylikes/MyLike";
import { currentCategoryAtom, categoryTemplateAtom, addCategoryModalOnAtom } from "./components_mylikes/atoms_mylikes";
import { dbService } from "../fbase";
import { doc, onSnapshot } from "firebase/firestore";
import { loggedInUserAtom } from "../atom";
import AddCategoryModal from "./components_mylikes/AddCategoryModal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  padding: 10px;
  background-color: navy;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  position: relative;
  font-size: 40px;
  font-weight: 600;
  padding-top: 20px;
  padding-bottom: 10px;
  color: white;
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
  color: white;
  text-decoration: underline;
  transition: 0.2s;
  cursor:pointer;
  &:hover {
    color: #ff0063;}
  }
`;

const TitleButton = styled.button`
  background-color: transparent;
  position: absolute;
  right: -45px;
  width: 40px;
  height: 40px;
  border: none;
  font-size: 30px;
  font-weight: 500;
  color: white;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    color: #ff0063;
  }
`;

function MyLikes() {
  const setCurrentCategory = useSetRecoilState(currentCategoryAtom);
  const navigate = useNavigate();
  const categoryClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const category = event.currentTarget.innerText;
    setCurrentCategory(category);
    navigate(`/mylikes/${category}/table`);
  };
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const [categoryTemplate, setCategoryTemplate] = useRecoilState(categoryTemplateAtom);
  const [addCategory, setAddCategory] = useRecoilState(addCategoryModalOnAtom);
  useEffect(() => {
    onSnapshot(doc(dbService, "MyLikes_template", `template_${loggedInUser?.uid}`), (doc) => {
      const templateDB = { ...doc.data() };
      setCategoryTemplate(templateDB);
    });
  }, []);

  const addCategoryClick = () => {
    setAddCategory(true);
  };

  return (
    <>
      <Wrapper>
        <Header>
          <Title>
            My Likes
            <TitleButton onClick={addCategoryClick}> + </TitleButton>
            {addCategory && <AddCategoryModal />}
          </Title>
          <Categories>
            {Object.keys(categoryTemplate).map((category) => (
              <Button key={category} onClick={categoryClick}>
                {category}
              </Button>
            ))}
          </Categories>
        </Header>
        <Routes>
          <Route path="/:category/*" element={<MyLike />} />
        </Routes>
      </Wrapper>
    </>
  );
}

export default MyLikes;
