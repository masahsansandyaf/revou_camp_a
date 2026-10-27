/**
 * LeaderboardEntry domain type
 * Feature: academic-potential-test
 */

export interface LeaderboardEntry {
  userId: string;
  fullName: string;
  packageId: string;
  bestScore: number; // skor tertinggi dari semua sesi
  rank: number;
  completedAt: Date; // waktu sesi dengan skor terbaik
}
