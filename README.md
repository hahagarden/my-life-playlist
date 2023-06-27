# Personal project - My Ranking
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

## 주요 기능

### 회원가입 및 로그인
<img width="800" alt="validation" src="https://github.com/hahagarden/my-life-playlist/assets/88613455/8fd1c8a7-bbb1-4a80-9a93-59bdc2d1c280">

- 이메일로 회원가입과 로그인을 할 수 있습니다.
- 유효성 검사가 있습니다.

<br/>

### 카테고리 커스터마이징

<img width="800" alt="category-travel" src="https://github.com/hahagarden/my-life-playlist/assets/88613455/e088767f-bb0b-44f1-8575-bade6f4fa67a">

- 사용자가 카테고리를 생성할 수 있습니다.
- type필드와 select필드를 선택하여 추가할 수 있습니다.

<br/>

### 리스트CRUD 및 드래그앤드롭
<img width="800" alt="crud" src="https://github.com/hahagarden/my-life-playlist/assets/88613455/1260d5d9-44de-46ba-9099-2a60a4e989d9">

- 리스트를 생성하고 더블클릭하여 수정하고 삭제할 수 있습니다.
- 드래그앤드롭으로 랭킹을 변경할 수 있습니다.
- 파이어베이스와 연동되어 실시간으로 업데이트됩니다.

<br/>

### 테이블모드 및 보드모드
<img width="500" alt="table-travel" src="https://github.com/hahagarden/my-life-playlist/assets/88613455/95c812d9-7d0c-4e62-9304-80cb7f48efd1">
<img width="500" alt="board-travel-abroad" src="https://github.com/hahagarden/my-life-playlist/assets/88613455/5c853ba8-3d5e-4fe7-ac63-5547de627724">

- 테이블모드에서 랭킹을 조작할 수 있고 보드모드에서 한 눈으로 볼 수 있습니다.
- 보드모드는 select필드 기준으로 생성됩니다.
  
<br/>

## 파이어베이스

### 사용자 계정
![사용자](https://user-images.githubusercontent.com/88613455/230647501-46dd6fcf-7fca-47c5-b695-6ed54490c7e0.PNG)

### 생성된 카테고리 저장 구조
![템플릿](https://user-images.githubusercontent.com/88613455/230647527-181ee0b1-0cb2-49ad-975a-23a47910157e.PNG)
![템플릿2](https://user-images.githubusercontent.com/88613455/230647531-27e6aede-f0ef-4356-93e8-3a7b58f69f13.PNG)

### 리스트 저장 구조
![노래 컬렉션1](https://user-images.githubusercontent.com/88613455/230647509-d2b9b5db-ac38-46a4-a984-6e15cbd38794.PNG)
![노래 컬렉션2](https://user-images.githubusercontent.com/88613455/230647518-cc0eb43d-2f0c-458b-9d36-f490105736f5.PNG)
