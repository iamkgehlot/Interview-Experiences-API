import type { interviewOutcome } from "@prisma/client";

export type experienceTypes= {
 tags: {
 tagName: string;
 }[];
} & {
 company: string;
 role: string;
 roundsCount: number;
 difficulty: number;
 outcome: interviewOutcome;
 content: string;
 interviewDate: Date;
 id: number;
 userId: number;
}