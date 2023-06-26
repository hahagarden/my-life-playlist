# Personal project - My Ranking
노래, 영화, 도서, 음식 등 카테고리를 생성하고, 타이핑 필드와 선택 필드를 추가할 수 있다. 타이핑 필드는 리스트 추가 시 사용자가 직접 타이핑한 값을 저장하고, 선택 필드는 카테고리 생성 시 원하는 옵션들을 같이 생성하여 리스트 추가 시 사용자가 선택한 옵션 값을 저장한다.

## 개요

테이블을 만들고 드래그앤드롭으로 순위를 관리할 수 있습니다. 사용자가 테이블 카테고리를 생성할 때 type필드와 select필드를 선택하고 추가하며 커스터마이징 할 수 있습니다. 테이블에 리스트를 추가하고 수정, 삭제가 가능합니다. 테이블을 보드로 전환할 수 있습니다. 회원가입과 로그인 기능이 있습니다.

### 프로젝트 목적

- 스스로 기획하고 구현한 첫 번째 개인 프로젝트입니다.
- Firebase로 CRUD를 구현합니다.

### 기술 스택

![React](https://img.shields.io/badge/react-444444?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![Recoil](https://img.shields.io/badge/recoil-3577E5?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=black)
![Styled](https://img.shields.io/badge/styledcomponents-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

<br>

## 폴더 구조

```
src
 ┣ components
 ┃ ┣ AddCategoryModal.tsx
 ┃ ┣ CategoryCard.tsx
 ┃ ┣ Footer.tsx
 ┃ ┣ Header.tsx
 ┃ ┣ PaintBoard.tsx
 ┃ ┣ PaintCard.tsx
 ┃ ┣ RegisterModal.tsx
 ┃ ┗ UpdateModal.tsx
 ┣ routes
 ┃ ┣ Board.tsx
 ┃ ┣ Home.tsx
 ┃ ┣ Join.tsx
 ┃ ┣ Login.tsx
 ┃ ┣ MyLike.tsx
 ┃ ┣ MyLikes.tsx
 ┃ ┗ Table.tsx
 ┣ styles
 ┃ ┣ GlobalStyle.ts
 ┃ ┗ styled.d.ts
 ┣ App.tsx
 ┣ atom.tsx
 ┣ custom.d.ts
 ┣ errors.ts
 ┣ fbase.tsx
 ┗ index.tsx
```

<br/>

## 회원가입과 로그인, 유효성검사
![가입 로그인 로그아웃](https://user-images.githubusercontent.com/88613455/230647481-c6998d26-ab4e-46d0-aff2-6df29b288f71.gif)
![사용자](https://user-images.githubusercontent.com/88613455/230647501-46dd6fcf-7fca-47c5-b695-6ed54490c7e0.PNG)

<br/>

## 카테고리 동적 생성, 리스트 추가, 드래그로 순위 변경
![노래추가](https://user-images.githubusercontent.com/88613455/230647485-fd13fe8a-1d5f-4ac3-ac26-244a56558d1e.gif)
![노래 컬렉션1](https://user-images.githubusercontent.com/88613455/230647509-d2b9b5db-ac38-46a4-a984-6e15cbd38794.PNG)
![노래 컬렉션2](https://user-images.githubusercontent.com/88613455/230647518-cc0eb43d-2f0c-458b-9d36-f490105736f5.PNG)

<br/>

## 카테고리 동적 생성(선택필드 추가), 리스트 삭제, 선택필드별로 보드 보기
![영화추가](https://user-images.githubusercontent.com/88613455/230647490-170d5fa4-9f22-48ec-8004-551f94ece286.gif)
![영화 컬렉션1](https://user-images.githubusercontent.com/88613455/230647539-a40d09f3-d86a-4a8b-a8b0-d2402d6283ad.PNG)
![영화 컬렉션2](https://user-images.githubusercontent.com/88613455/230647544-bf833465-a3bc-4a8c-a802-7dbd39d081c9.PNG)

<br/>

## 생성된 카테고리 저장 구조
![템플릿](https://user-images.githubusercontent.com/88613455/230647527-181ee0b1-0cb2-49ad-975a-23a47910157e.PNG)
![템플릿2](https://user-images.githubusercontent.com/88613455/230647531-27e6aede-f0ef-4356-93e8-3a7b58f69f13.PNG)
