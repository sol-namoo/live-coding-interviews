// api.ts
import type { ChallengeMiniInfo, ChallengeDetailInfo } from "./types";

const MINI_LIST: ChallengeMiniInfo[] = [
  { id: "1", title: "30일 글쓰기 챌린지", summary: "매일 글 한 편 쓰기" },
  { id: "2", title: "매일 코딩 챌린지", summary: "하루 1문제 이상 풀기" },
  { id: "3", title: "운동 기록 챌린지", summary: "매일 30분 이상 운동" },
];

const DETAIL_MAP: Record<string, ChallengeDetailInfo> = {
  "1": {
    id: "1",
    title: "30일 글쓰기 챌린지",
    description: "매일 최소 500자 이상 글을 쓰는 챌린지입니다.",
    startedAt: "2026-03-01",
    participants: 120,
  },
  "2": {
    id: "2",
    title: "매일 코딩 챌린지",
    description: "알고리즘, 사이드 프로젝트 등 어떤 코딩이든 하루 1시간 이상.",
    startedAt: "2026-02-20",
    participants: 85,
  },
  "3": {
    id: "3",
    title: "운동 기록 챌린지",
    description: "러닝, 헬스, 요가 등 운동을 기록하고 공유합니다.",
    startedAt: "2026-01-10",
    participants: 64,
  },
};

export async function getChallengeMiniInfoList(): Promise<ChallengeMiniInfo[]> {
  await new Promise((r) => setTimeout(r, 300));
  return MINI_LIST;
}

export async function getChallengeDetailInfo(
  id: string
): Promise<ChallengeDetailInfo> {
  await new Promise((r) => setTimeout(r, 400));
  const detail = DETAIL_MAP[id];
  if (!detail) {
    throw new Error("Challenge not found");
  }
  return detail;
}