// App.tsx
import React, { useEffect, useState } from "react";
import { getChallengeMiniInfoList, getChallengeDetailInfo } from "./problem/api";
import type {
  ChallengeMiniInfo,
  ChallengeDetailInfo,
} from "./problem/types";
import { Card } from "./problem/Card";
import { Loading } from "./problem/Loading";

export default function App() {
  const [list, setList] = useState<ChallengeMiniInfo[]>([]);
  const [detail, setDetail] = useState<ChallengeDetailInfo | null>(null);

  if(!list.length) return <Loading/>
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h2>챌린지 목록</h2>
        {list.map((item) => (
          <Card key={item.id} item={item} onClick={()=>{}} />
        ))}
      </div>

      <div style={{ flex: 2 }}>
        <h2>챌린지 상세</h2>
        {detail && (
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <h3>{detail.title}</h3>
            <p>{detail.description}</p>
            <p>시작일: {detail.startedAt}</p>
            <p>참여 인원: {detail.participants}명</p>
          </div>
        )}
      </div>
    </div>
  );
}