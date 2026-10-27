/**
 * TestSession & SavedAnswer domain types
 * Feature: academic-potential-test
 */

export type TestSessionStatus = 'in_progress' | 'completed' | 'timed_out';

export interface SavedAnswer {
  questionId: string;
  selectedOptionId: string | null; // null = belum dijawab
  savedAt: Date;
}

export interface TestSession {
  id: string;
  userId: string; // FK ke User
  packageId: string; // FK ke TestPackage
  status: TestSessionStatus;
  startedAt: Date;
  finishedAt: Date | null;
  timeoutAt: Date; // startedAt + timeLimitMinutes
  answers: SavedAnswer[];
  syncPending: boolean; // true jika ada jawaban belum tersinkron
  createdAt: Date;
}
