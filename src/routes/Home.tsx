import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { dbService } from "../fbase";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MyLikes from "./MyLikes";
import MyLike from "./MyLike";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryTemplateAtom, loggedInUserAtom } from "../atom";

export default function Home() {
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const setCategoryTemplate = useSetRecoilState(categoryTemplateAtom);

  useEffect(() => {
    onSnapshot(doc(dbService, "MyLikes_template", `template_${loggedInUser?.uid}`), (doc) => {
      const templateDB = { ...doc.data() };
      setCategoryTemplate(templateDB);
    });
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MyLikes />} />
        <Route path="/:category/*" element={<MyLike />} />
      </Routes>
      <Footer />
    </>
  );
}
