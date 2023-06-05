import styled from "styled-components";
import { useRecoilValue, useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { categoryTemplateAtom } from "./components_mylikes/atoms_mylikes";
import { dbService } from "../fbase";
import { doc, onSnapshot } from "firebase/firestore";
import { loggedInUserAtom } from "../atom";
import AddCategoryModal from "./components_mylikes/AddCategoryModal";
import CategoryCard from "./CategoryCard";

const MyLikesWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 5rem);
  margin-top: 3rem;
  background: linear-gradient(to top right, #dfa3ff, #87aaff, #4ed5ff, #d2f7ff);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > button {
    position: absolute;
    z-index: 1;
  }

  & > button:nth-of-type(1) {
    top: 5rem;
  }

  & > button:nth-of-type(2) {
    left: 0;
  }

  & > button:nth-of-type(3) {
    right: 0;
  }
`;

const AddButton = styled.button`
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
    background-color: var(--white);
  }
`;

const ScrollButton = styled.button`
  width: 5%;
  aspect-ratio: 1/2;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  svg {
    width: 50%;
    height: 50%;

    fill: rgba(255, 255, 255, 0.5);
  }

  &:hover {
    svg {
      fill: rgba(255, 255, 255, 0.9);
    }
    filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
  }
`;

const CategoryCards = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  perspective: 1000px;

  & > :first-child {
    transform: rotateY(80deg);
  }

  & > :nth-child(2) {
    transform: rotateY(45deg);
    margin-right: 20px;
  }

  & > :nth-child(3) {
  }

  & > :nth-child(4) {
    transform: rotateY(-45deg);
    margin-left: 20px;
  }

  & > :nth-child(5) {
    transform: rotateY(-80deg);
  }
`;

export default function MyLikes() {
  const CARDS_PER_PAGE = 5;
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const [categoryTemplate, setCategoryTemplate] = useRecoilState(categoryTemplateAtom);
  const [slideIndex, setSlideIndex] = useState(0);
  const templates = Object.keys(categoryTemplate).sort((a, b) => categoryTemplate[a].createdAt - categoryTemplate[b].createdAt);
  const templateSlide = [templates[3], templates[1], templates[0], templates[4], templates[2], ...templates.slice(CARDS_PER_PAGE)];

  useEffect(() => {
    onSnapshot(doc(dbService, "MyLikes_template", `template_${loggedInUser?.uid}`), (doc) => {
      const templateDB = { ...doc.data() };
      setCategoryTemplate(templateDB);
    });
  }, []);

  const [isModalOn, setIsModalOn] = useState(false);
  const onModalOnClick = () => {
    setIsModalOn(true);
  };
  const onModalOffClick = () => {
    setIsModalOn(false);
  };

  const onIncreaseSlideClick = () => {
    if (templates.length < CARDS_PER_PAGE) return;
    setSlideIndex((prev) => {
      if (prev === templates.length - CARDS_PER_PAGE) return prev;
      return prev + 1;
    });
  };

  const onDecreaseSlideClick = () => {
    if (templates.length < CARDS_PER_PAGE) return;
    setSlideIndex((prev) => {
      if (prev === 0) return prev;
      return prev - 1;
    });
  };

  return (
    <MyLikesWrapper>
      <AddButton onClick={onModalOnClick}>add</AddButton>
      <ScrollButton onClick={onDecreaseSlideClick}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
        </svg>
      </ScrollButton>
      <CategoryCards>
        {templateSlide.slice(slideIndex, slideIndex + CARDS_PER_PAGE).map((template, index) => (
          <CategoryCard nth={index + 1}>{template}</CategoryCard>
        ))}
      </CategoryCards>
      <ScrollButton onClick={onIncreaseSlideClick}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">
          <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
        </svg>
      </ScrollButton>
      {isModalOn && <AddCategoryModal onModalOffClick={onModalOffClick} />}
    </MyLikesWrapper>
  );
}
