import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authService } from "../fbase";
import {
  ERROR_EMAIL_NOT_EXIST,
  ERROR_EMAIL_FORMAT,
  ERROR_LOGIN_FAILURE,
  ERROR_PASSWORD_MAX_LENGTH,
  ERROR_PASSWORD_MIN_LENGTH,
  ERROR_WRONG_PASSWORD,
} from "../errors";

interface ILoginForm {
  email: string;
  pw: string;
}

export default function Login() {
  const navigator = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();

  const onSubmit = (data: ILoginForm) => {
    signInWithEmailAndPassword(authService, data.email, data.pw)
      .then(() => {
        alert(`welcome!`);
        navigator("/");
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        switch (errorCode) {
          case "auth/user-not-found":
            alert(ERROR_EMAIL_NOT_EXIST);
            break;
          case "auth/wrong-password":
            alert(ERROR_WRONG_PASSWORD);
            break;
          default:
            alert(ERROR_LOGIN_FAILURE);
        }
      });
  };

  return (
    <LoginContainer>
      <WelcomeMessage>
        <p>내가 좋아하는 것들로 채워보세요</p>
        <p>my life playlist</p>
      </WelcomeMessage>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputBox>
          <Label htmlFor="email">email</Label>
          <Input
            {...register("email", {
              required: true,
              pattern: {
                value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                message: ERROR_EMAIL_FORMAT,
              },
            })}
            id="email"
            autoComplete="off"
          ></Input>
          <InputMessage>{errors?.email?.message}</InputMessage>
        </InputBox>
        <InputBox>
          <Label>password</Label>
          <Input
            {...register("pw", {
              required: true,
              minLength: { value: 6, message: ERROR_PASSWORD_MIN_LENGTH },
              maxLength: { value: 12, message: ERROR_PASSWORD_MAX_LENGTH },
            })}
            id="pw"
            autoComplete="off"
          ></Input>
          <InputMessage>{errors?.pw?.message}</InputMessage>
        </InputBox>
        <Button>login</Button>
        <JoinLink to="/join">click to join</JoinLink>
      </Form>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    margin-bottom: 0.5rem;
  }

  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--light-gray);
  border-radius: 1rem;
  padding: 2rem;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Label = styled.label`
  width: 15rem;
  height: 1.5rem;
  text-align: center;
`;

const Input = styled.input`
  background-color: var(--light-gray);
  outline: none;
  border-radius: 1.5rem;
  border: none;
  width: 15rem;
  height: 2.5rem;
  text-align: center;
  font-size: 1rem;
`;

const InputMessage = styled.p`
  width: 15rem;
  height: 2rem;
  text-align: center;
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: var(--red);
`;

const Button = styled.button`
  background-color: var(--light-gray);
  border-radius: 1.5rem;
  border: none;
  width: 6rem;
  height: 2.5rem;
  text-align: center;
  font-size: 1rem;
  margin-top: 0.2rem;
  cursor: pointer;
`;

const JoinLink = styled(Link)`
  text-decoration: underline;
  color: var(--dark-gray);
  margin-top: 1rem;
`;
