import { Route, Routes } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import MyLikes from "./MyLikes";
import MyLike from "./MyLike";

export default function Home() {
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
