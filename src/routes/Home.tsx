import { Route, Routes } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MyLike from "./components_mylikes/MyLike";
import MyLikes from "./MyLikes";

export default function Home2() {
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
