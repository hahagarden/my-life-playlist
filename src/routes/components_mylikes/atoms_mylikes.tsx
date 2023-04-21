import { atom, selectorFamily } from "recoil";

export interface ICategoryTemplate {
  [category: string]: {
    typingAttrs: string[];
    selectingAttrs: { [option: string]: string[] };
  };
}

export const categoryTemplateAtom = atom<ICategoryTemplate>({
  key: "categoryTemplate",
  default: {},
});

export const currentCategoryAtom = atom({
  key: "currentCategory",
  default: "",
});

export interface ILike {
  id: string;
  createdAt: number;
  updatedAt: number;
  creatorId: string;
  genre: string;
  singer: string;
  title: string;
  [key: string]: string | number;
}

export interface IRanking {
  [songId: string]: number;
}

export const likesAtom = atom<ILike[]>({
  key: "likes",
  default: [],
});

export const likesRankingAtom = atom<IRanking>({
  key: "likesRanking",
  default: {},
});
