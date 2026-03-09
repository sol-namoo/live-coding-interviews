# Challenge List & Detail (Live Coding)

## 메타데이터

- 회사: C
- 일시: 2026-03-08
- 전형: 라이브 코딩 (온라인 코드 에디터)
- 포지션: Frontend Engineer
- 난이도(체감): 중
- 제한 시간: 25분 + 5분 추가
- 언어: TypeScript / React
- 태그: fetching, state, props, rerender, optimization, loading

## 문제 요약

“챌린지 목록을 보여주고, 유저가 챌린지 카드를 클릭(상세보기)하면 클릭한 챌린지의 상세 정보를 하단에 보여주는 페이지”를 완성한다.

보일러플레이트(초기 세팅 코드)는 대부분 준비되어 있고, 비어 있는 핸들러 함수에 데이터 페칭 로직과 일부 UI 렌더 로직을 채우는 형태였다.

## 파일 구성 (복원)

- `problem.tsx`: 테스트가 진행되는 App 역할(목록/상세 상태 + 핸들러 구현)
- `problem/api.ts`: 가짜 API
  - `getChallengeMiniInfoList()`
  - `getChallengeDetailInfo(id)`
- `problem/types.ts`: 타입 정의
- `problem/Card.tsx`: 챌린지 카드 컴포넌트 (상세보기 버튼이 `onClick(item.id)` 호출)
- `problem/Loading.tsx`: `<Loading />`
- `problem/ErrorLogger.tsx`: “This error should not be printed”를 찍는 로직(리렌더 최적화 Task와 연관)

## Task

### Task 1: 리스트 불러와서 렌더링하기

- 요구사항: 가상의 리스트를 페칭하는 API `getChallengeMiniInfoList`를 호출해 최초 1회만 챌린지 목록을 업데이트하고 화면에 렌더링한다.

### Task 2: 버튼 눌러서 아이템 상세 정보 불러오기

- 요구사항: 리스트에서 특정 카드의 상세보기 버튼을 누르면, 해당 아이템의 id를 파라미터로 넘겨 `getChallengeDetailInfo(id)`를 호출하고 상세 정보를 하단에 렌더링한다.

### Task 3: 불필요한 리렌더링 방지 (콘솔 로그 최적화)

- 요구사항: 상세보기 버튼 클릭 시 상세 API를 호출하더라도, 콘솔에 `This error should not be printed`가 출력되지 않도록 한다.
- 의도(추정): 불필요한 리렌더/업데이트가 발생하지 않도록 컴포넌트 구조/props/핸들러를 최적화한다. (예: memoization, stable props 등)

### Task 4: 로딩(Loading) 컴포넌트 띄우기

- 요구사항: 상세 아이템을 불러오는 비동기 통신 동안 화면에 `<Loading />` 컴포넌트를 보여준다.