import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authService } from "../fbase";

const Wrapper = styled.div`
  width: 100%;
  background-color: navy;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const InputLine = styled.div`
  position: relative;
  margin: 10px 0;
`;

const Label = styled.label`
  color: white;
  padding-right: 10px;
  font-size: 20px;
`;

const Input = styled.input`
  width: 250px;
  height: 30px;
  border: none;
  border-bottom: 1px solid gray;
  outline: none;
  background-color: inherit;
  color: white;
  font-size: 20px;
  transition: border-bottom 0.3s;
  &:focus {
    color: #fff200;
    border-bottom: 1px solid white;
  }
`;

const Span = styled.span`
  position: absolute;
  left: 353px;
  top: 9px;
  width: 250px;
  margin-left: 10px;
  color: red;
`;

const Button = styled.button`
  background-color: transparent;
  border: 1px solid white;
  border-radius: 17px;
  width: 300px;
  height: 35px;
  color: white;
  font-size: 20px;
  margin: 20px;
  transition: background-color, color 0.3s;
  &:hover {
    background-color: #f1f2f6;
    color: navy;
  }
`;

interface ILoginForm {
  email: string;
  pw: string;
}

function Login() {
  const navigator = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();

  const onSubmit = (data: ILoginForm) => {
    signInWithEmailAndPassword(authService, data.email, data.pw)
      .then(() => {
        alert(`Hello ${data.email}!`);
        navigator("/");
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        switch (errorCode) {
          case "auth/user-not-found":
            alert("email does not exist.");
            break;
          case "auth/wrong-password":
            alert("wrong password.");
            break;
          default:
            alert("login inavailable.");
        }
      });
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputLine>
          <Label htmlFor="email">email</Label>
          <Input
            {...register("email", {
              required: true,
              pattern: {
                value: /^[a-zA-z0-9@.]/,
                message: "email with alphabet and number only",
              },
            })}
            id="email"
            placeholder="email"
            autoComplete="off"
          ></Input>
          <Span>{errors?.email?.message}</Span>
        </InputLine>
        <InputLine>
          <Label htmlFor="pw">password</Label>
          <Input
            {...register("pw", {
              required: true,
              minLength: { value: 6, message: "minimum length is 6" },
              maxLength: { value: 12, message: "maximum length is 12" },
            })}
            id="pw"
            placeholder="password"
            autoComplete="off"
          ></Input>
          <Span>{errors?.pw?.message}</Span>
        </InputLine>
        <Button>Log in</Button>
      </Form>
    </Wrapper>
  );
}

export default Login;
