// types.ts
export type ChallengeMiniInfo = {
  id: string;
  title: string;
  summary: string;
};

export type ChallengeDetailInfo = {
  id: string;
  title: string;
  description: string;
  startedAt: string;
  participants: number;
};