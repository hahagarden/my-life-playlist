import styled from "styled-components";
import { Link } from "react-router-dom";

const Card = styled(Link)<{ nth: number }>`
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 4px 4px rgba(255, 255, 255, 0.1);
  width: ${(props) =>
    props.nth === 1 ? "16%" : props.nth === 2 ? "17%" : props.nth === 3 ? "20%" : props.nth === 4 ? "17%" : props.nth === 5 ? "16%" : null};

  aspect-ratio: 1/1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const CardImage = styled.div`
  height: 70%;
`;

const CardText = styled.div`
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function CategoryCard({ nth, children }: { nth: number; children: string }) {
  return (
    <Card to={`/${children}`} nth={nth}>
      <CardImage />
      <CardText>{children}</CardText>
    </Card>
  );
}
