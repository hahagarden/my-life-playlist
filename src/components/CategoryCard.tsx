import styled from "styled-components";
import { Link } from "react-router-dom";

const Card = styled(Link)<{ nth: number }>`
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 4px 4px rgba(255, 255, 255, 0.1);
  width: ${(props) =>
    props.nth === 1
      ? "17%"
      : props.nth === 2
      ? "18%"
      : props.nth === 3
      ? "21%"
      : props.nth === 4
      ? "18%"
      : props.nth === 5
      ? "17%"
      : null};

  aspect-ratio: 1/1;
  margin: 0 0.5rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    width: 90%;
    height: 90%;
  }
`;

const CardText = styled.div`
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.7);
`;

export default function CategoryCard({ nth, children, imgSrc }: { nth: number; children: string; imgSrc: any }) {
  return (
    <Card
      to={`/${children}`}
      nth={nth}
      onClick={(e) => {
        if (!children) e.preventDefault();
      }}
    >
      <CardImage>{children && <img src={imgSrc} />}</CardImage>
      <CardText>{children}</CardText>
    </Card>
  );
}
