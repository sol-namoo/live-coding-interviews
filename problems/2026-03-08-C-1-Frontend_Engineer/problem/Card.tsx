// Card.tsx
import React from "react";
import type { ChallengeMiniInfo } from "./types";
import { ErrorLogger } from "./ErrorLogger";

type CardProps = {
  item: ChallengeMiniInfo;
  onClick: (id: string) => void;
};

export function Card({ item, onClick }: CardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
      }}
    >
      <ErrorLogger />
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <button
        onClick={() => onClick(item.id)}
      >
        상세보기
      </button>
    </div>
  );
}