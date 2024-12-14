import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";

import { authService } from "../fbase";
import {
  ERROR_EMAIL_DUPLICATE,
  ERROR_EMAIL_FORMAT,
  ERROR_JOIN_FAILURE,
  ERROR_PASSWORD_CONFIRM,
  ERROR_PASSWORD_MAX_LENGTH,
  ERROR_PASSWORD_MIN_LENGTH,
  ERROR_USERNAME_FORMAT,
} from "../errors";

interface IJoinForm {
  email: string;
  username: string;
  pw: string;
  pwConfirm: string;
}

export default function Join() {
  const navigator = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IJoinForm>();

  const onSubmit = (data: IJoinForm) => {
    if (data.pwConfirm !== data.pw)
      return setError("pwConfirm", { message: ERROR_PASSWORD_CONFIRM }, { shouldFocus: true });

    createUserWithEmailAndPassword(authService, data.email, data.pw)
      .then((userCredentail) => {
        updateProfile(userCredentail.user, { displayName: data.username });
        alert(`welcome ${data.email}!`);
        navigator("/");
      })
      .catch((error) => {
        console.log(error);
        switch (error.code) {
          case "auth/email-already-in-use":
            alert(ERROR_EMAIL_DUPLICATE);
            break;
          default:
            alert(ERROR_JOIN_FAILURE);
        }
      });
  };

  return (
    <JoinContainer>
      <WelcomeMessage>
        <p>회원가입</p>
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
          <Label htmlFor="username">username</Label>
          <Input
            {...register("username", {
              required: true,
              pattern: {
                value: /^[a-zA-z가-힣0-9]+$/,
                message: ERROR_USERNAME_FORMAT,
              },
            })}
            id="username"
            autoComplete="off"
          ></Input>
          <InputMessage>{errors?.username?.message}</InputMessage>
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
        <InputBox>
          <Label>password confirm</Label>
          <Input {...register("pwConfirm", { required: true })} id="pwConfirm" autoComplete="off"></Input>
          <InputMessage>{errors?.pwConfirm?.message}</InputMessage>
        </InputBox>
        <Button>Join</Button>
        <LoginLink to="/">click to login</LoginLink>
      </Form>
    </JoinContainer>
  );
}

const JoinContainer = styled.div`
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
  margin-top: 0.5rem;
  cursor: pointer;
`;

const LoginLink = styled(Link)`
  text-decoration: underline;
  color: var(--dark-gray);
  margin-top: 1rem;
`;
