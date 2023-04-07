import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
  display: inline-block;
  width: 180px;
  text-align: right;
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
    color:#fff200;
    border-bottom: 1px solid white;
    }
  }
`;

const Span = styled.span`
  position: absolute;
  left: 429px;
  top: 10px;
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
interface IJoinForm {
  email: string;
  name: string;
  pw: string;
  pwConfirm: string;
}

function Join() {
  const navigator = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IJoinForm>();
  const onSubmit = (data: IJoinForm) => {
    if (data.pwConfirm !== data.pw) {
      setError("pwConfirm", { message: "password are not the same" }, { shouldFocus: true });
    } else {
      createUserWithEmailAndPassword(authService, data.email, data.pw)
        .then(() => {
          alert(`welcome ${data.email}!`);
          navigator("/");
        })
        .catch((error) => {
          console.log(error);
          switch (error.code) {
            case "auth/email-already-in-use":
              alert("email already exists.");
              break;
            default:
              alert("Join inavailable.");
          }
        });
    }
  };
  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputLine>
          <Label htmlFor="email">email</Label>
          <Input
            {...register("email", {
              required: "*",
              pattern: {
                value: /^[a-zA-z0-9@.]+$/,
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
          <Label htmlFor="name">name</Label>
          <Input
            {...register("name", {
              required: "*",
              pattern: {
                value: /^[a-zA-z가-힣]+$/,
                message: "English and Korean only",
              },
            })}
            id="name"
            placeholder="name"
            autoComplete="off"
          ></Input>
          <Span>{errors?.name?.message}</Span>
        </InputLine>
        <InputLine>
          <Label htmlFor="pw">password</Label>
          <Input
            {...register("pw", {
              required: "*",
              minLength: { value: 6, message: "minimum length is 6" },
              maxLength: { value: 12, message: "maximum length is 12" },
            })}
            id="pw"
            placeholder="password"
            autoComplete="off"
          ></Input>
          <Span>{errors?.pw?.message}</Span>
        </InputLine>
        <InputLine>
          <Label htmlFor="pwConfirm">confirm password</Label>
          <Input
            {...register("pwConfirm", { required: "*" })}
            id="pwConfirm"
            placeholder="confirm password"
            autoComplete="off"
          ></Input>
          <Span>{errors?.pwConfirm?.message}</Span>
        </InputLine>
        <Button>Join</Button>
      </Form>
    </Wrapper>
  );
}

export default Join;
