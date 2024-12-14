import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import GlobalStyle from "./styles/GlobalStyle";
import { authService } from "./fbase";
import { UserMetadata } from "firebase/auth";
import { loggedInUserAtom } from "./atom";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Join from "./routes/Join";

export interface ILoggedInUser {
  email: string | null;
  metadata: UserMetadata;
  uid: string;
  username: string | null;
}

function App() {
  const [init, setInit] = useState(false);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserAtom);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        const loggedInUser: ILoggedInUser = {
          email: user.email,
          metadata: user.metadata,
          uid: user.uid,
          username: user.displayName,
        }; // disable to set user(:User) to recoil atom.
        setLoggedInUser(loggedInUser);
      } else {
        setLoggedInUser(null);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      <GlobalStyle />
      {init ? (
        <Routes>
          <Route path="/*" element={loggedInUser ? <Home /> : <Login />} />
          <Route path="/join" element={<Join />} />
        </Routes>
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
