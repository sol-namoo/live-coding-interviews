# 회고

## 당시 상황

- 화상/온사이트 여부: 화상
- 사용한 에디터: cursor (자동완성 기능 끔)
- 난이도 체감: 상. “주어진 코드에서 오류를 찾아라”만 있고, 코드가 원래 뭘 하려던 건지 설명이 없어서 설계 의도 파악이 어려웠음.
- 이 문제 유형: 처음 봄. “버그 찾기 + 의도 불명 코드” 조합이라 읽는 데만 시간이 많이 걸렸음.

---

## 해설: 이 코드가 하는 일 / 있었던 버그

### 코드가 하려는 일

- **orderId**: 어떤 주문을 볼지 선택. input으로 바꾸면 `useEffect`에서 해당 id로 `getOrder` 호출 → `order`에 저장 후 화면에 표시.
- **fulfilled (state)**: 서버에서 온 `order`는 “저장된 상태”이고, **fulfilled는 사용자가 input에서 수정 중인 “아직 저장 안 한 값(draft)”**. Save 버튼은 “지금 fulfilled에 있는 값들을 서버에 반영”하는 용도(실제로는 API 호출 등).
- **Save**: “현재 보고 있는 주문의 line별 fulfilled 수량을 저장”하는 버튼. orderId를 저장하는 게 아님.

### 있었던 버그 정리

1. **useEffect**  
   dependency array가 `[]`라서 orderId를 바꿔도 한 번만 fetch됨. → `[orderId]` 추가.

2. **리스트 렌더**  
   `key={i}` (index) 사용 → 리스트 재렌더 시 이상 동작 가능. → `key={l.id}` 로 변경.

3. **input**  
   `defaultValue`만 사용해서 uncontrolled이고 state와 연결 안 됨. 수정해도 반영 안 됨. → `value={fulfilled[l.id] ?? l.fulfilled}` 로 제어 컴포넌트화, defaultValue 제거.

4. **onChangeQty**  
   `fulfilled[lineId] = qty` 후 `setFulfilled(fulfilled)` 로 기존 객체를 mutate하고 같은 레퍼런스를 set → 리렌더가 안 될 수 있음. → `setFulfilled(prev => ({ ...prev, [lineId]: qty }))` 로 불변 업데이트.

5. **totalFulfilled**  
   `fulfilled[l.id] || l.fulfilled` 에서 0이 falsy라서, 사용자가 0으로 바꿔도 합계에 이전 값이 더해짐. → `fulfilled[l.id] ?? l.fulfilled` 로 변경.

6. **save()**  
   order가 없을 때 "Saved!" 표시, setError 두 번 호출(배치로 "Nothing changed"는 안 보임), 의도 불명의 alert. → order 없으면 setError("No order") 후 return, setError("") 후 alert("Saved!") 한 번만.

---

## 문제 파악을 어려워했던 이유

1. **설명 없이 “오류를 찾아라”만 주어짐**  
   코드가 “주문 편집 UI”인지, orderId와 Save가 각각 뭘 의미하는지가 안 적혀 있어서, “Save가 orderId를 저장하는 건가, fulfilled를 저장하는 건가”부터 헷갈렸다.

2. **fulfilled state의 역할이 코드만으로는 안 읽힘**  
   `order` 안에 이미 `lines[].fulfilled`가 있어서 “derived data 아니야?”라고 느껴졌고, “왜 별도 state를 두고 setFulfilled를 쓰지?”가 이해되지 않았다. (실제로는 “편집 중인 값” draft용 state.)

3. **Save 버튼과 orderId가 같은 줄에 있어서**  
   “orderId를 저장하는 버튼”으로 오해하기 쉬웠다. Save는 “현재 주문의 fulfilled 수량을 서버에 저장”하는 용도인데, 라벨/설명이 없어서 의도 파악이 어려웠다.

4. **의도적으로 잘못된 코드**  
   이해를 해야 하는 대상인지 고쳐야 하는 대상인지 파악이 빠르게 되지 않았다. `onChangeQty`처럼 “const qty 선언 → 어딘가에 할당”하는 알 수 없는 패턴의 코드가 있어서 당황하고, mutate + 같은 객체 set 같은 게 눈에 안 들어와서 “뭘 하려는 코드지” 하는 생각이 순간 멍해졌다. 

---

## 내가 했던 접근

- “로직에 문제가 있을 거라”고 생각하고 한 줄씩 읽었다.
- **면접관 힌트**: “useEffect의 dependency array가 비어 있지 않나요? 그래도 될까요?” → 그걸 계기로 **useEffect 의존성 배열** 수정을 이야기했다.
- 그다음 스스로 짚은 것:
  - **리스트에서 key**: index 대신 고유 id(`l.id`)를 쓰는 게 맞다.
  - **input**: defaultValue만 있고 value가 없어서 업데이트가 안 될 것 같다 → value를 붙여서 제어 컴포넌트로 쓰는 게 맞다.
- 실제 정답 목록은 모름. 위 두 가지까지 말하고 면접이 끝났다.

---

## 내가 놓친 점

- **onChangeQty**: `fulfilled` 객체를 직접 수정하고 같은 레퍼런스를 set하는 부분을 보지 못함. 불변 업데이트가 필요하다는 걸 짚지 못했다.
- **totalFulfilled**: `||` 때문에 `fulfilled[l.id]`가 0일 때 `l.fulfilled`로 넘어가 버리는 버그를 파악하지 못했다.
- **save()**: order가 없을 때 에러를 내야 하는데 "Saved!"를 띄우는 것, setError가 두 번 있어서 “Nothing changed”가 의미 없어지는 것, 마지막 alert("Saved!")의 의도 등 전반적인 로직을 검토하지 못했다.
- **fulfilled의 역할**: “편집 중인 값”이라는 설계를 코드만으로 추론하지 못했고, 그래서 onChangeQty / setFulfilled가 왜 있는지 이해가 안 된 상태로 넘어갔다.

---

## 아쉬운 점과 개선점

- **설계 의도를 먼저 맞추지 않음**  
   “이 코드가 주문의 fulfilled 수량을 편집·저장하는 UI가 맞나요?”, “Save는 지금 입력한 fulfilled 값을 서버에 보내는 버튼인가요?”처럼 **think out loud 하면서 질문**했으면, fulfilled state와 Save의 의미가 빨리 정리됐을 것이다.

- **의도가 안 읽히는 코드는 질문했어야 함**  
   “올바르게 작성하세요”만 해도 읽고 고치기 시간이 걸리는데, 설명 없는 버그 투성이 코드는 설계부터 맞춰야 버그도 보인다. **“지금 이 코드가 이걸 하기 위한 게 맞나요?”**라고 확실히 물어봤어야 했다.

- **다음에 비슷한 “버그 찾기” 문제가 나오면**  
   - (1) 렌더/폼: key, controlled/uncontrolled input, value vs defaultValue  
   - (2) effect: dependency array  
   - (3) state: 불변 업데이트, mutate 금지  
   - (4) 계산: 0/falsy 처리 (`||` vs `??`)  
   - (5) 분기: early return, setState 중복/순서  
  순서로 체크리스트를 두고 훑으면 놓치는 걸 줄일 수 있을 것 같다.

---

## 다음에 같은 유형 나오면 이렇게 한다

- **먼저 “이 코드가 뭘 하려는 건가요?”를 말로 꺼내고, 필요하면 면접관에게 확인한다.**
- 위 표의 항목(useEffect, key, value/defaultValue, setState 불변성, || vs ??, save 로직)을 의식적으로 한 번씩 점검한다.
- defaultValue는 쓰지 않을 생각으로, 제어 컴포넌트만 쓰는 걸 기본으로 삼는다.
