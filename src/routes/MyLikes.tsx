import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { useState } from "react";

import { categoryTemplateAtom } from "../atom";
import CategoryCard from "../components/CategoryCard";
import AddCategoryModal from "../components/AddCategoryModal";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
import { ReactComponent as ArrowRight } from "../assets/arrow-right.svg";

const imgSrc: { [key: number]: any } = {
  1: `${process.env.PUBLIC_URL}/img/img1.jpg`,
  2: `${process.env.PUBLIC_URL}/img/img2.jpg`,
  3: `${process.env.PUBLIC_URL}/img/img3.jpg`,
  4: `${process.env.PUBLIC_URL}/img/img4.jpg`,
  5: `${process.env.PUBLIC_URL}/img/img5.jpg`,
  6: `${process.env.PUBLIC_URL}/img/img6.jpg`,
  7: `${process.env.PUBLIC_URL}/img/img7.jpg`,
  8: `${process.env.PUBLIC_URL}/img/img8.jpg`,
  9: `${process.env.PUBLIC_URL}/img/img9.jpg`,
  0: `${process.env.PUBLIC_URL}/img/img0.jpg`,
};

export default function MyLikes() {
  const CARDS_PER_PAGE = 5;
  const categoryTemplate = useRecoilValue(categoryTemplateAtom);
  const [slideIndex, setSlideIndex] = useState(0);
  const templates = Object.keys(categoryTemplate).sort(
    (a, b) => categoryTemplate[a].createdAt - categoryTemplate[b].createdAt
  );
  const templateSlide = [
    { name: templates[3], imgUrl: imgSrc[3] },
    { name: templates[1], imgUrl: imgSrc[1] },
    { name: templates[0], imgUrl: imgSrc[0] },
    { name: templates[2], imgUrl: imgSrc[2] },
    { name: templates[4], imgUrl: imgSrc[4] },
    ...templates.slice(CARDS_PER_PAGE).map((name, index) => ({ name, imgUrl: imgSrc[(index + CARDS_PER_PAGE) % 10] })),
  ];

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
        <ArrowLeft />
      </ScrollButton>
      <CategoryCards>
        {templateSlide.slice(slideIndex, slideIndex + CARDS_PER_PAGE).map((template, index) => (
          <CategoryCard nth={index + 1} key={index + 1} imgSrc={template.imgUrl}>
            {template.name}
          </CategoryCard>
        ))}
      </CategoryCards>
      <ScrollButton onClick={onIncreaseSlideClick}>
        <ArrowRight />
      </ScrollButton>
      {isModalOn && <AddCategoryModal onModalOffClick={onModalOffClick} />}
    </MyLikesWrapper>
  );
}

const MyLikesWrapper = styled.div`
  width: 100vw;
  min-width: 800px;
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
