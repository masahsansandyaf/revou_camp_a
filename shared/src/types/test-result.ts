/**
 * TestResult, CategoryScore, AbilityLabel domain types
 * Feature: academic-potential-test
 */

export interface CategoryScore {
  categoryId: string;
  categoryName: string;
  correctCount: number;
  totalCount: number;
  score: number; // 0.00–100.00
}

/**
 * AbilityLabel based on totalScore:
 *   0–49   → 'Di Bawah Rata-rata'
 *   50–69  → 'Rata-rata'
 *   70–84  → 'Di Atas Rata-rata'
 *   85–100 → 'Unggul'
 */
export type AbilityLabel =
  | 'Di Bawah Rata-rata' // skor 0–49
  | 'Rata-rata' // skor 50–69
  | 'Di Atas Rata-rata' // skor 70–84
  | 'Unggul'; // skor 85–100

export interface TestResult {
  id: string;
  sessionId: string; // FK ke TestSession
  userId: string; // FK ke User
  packageId: string; // FK ke TestPackage
  totalScore: number; // 0.00–100.00, 2 desimal
  abilityLabel: AbilityLabel;
  categoryScores: CategoryScore[];
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  completedAt: Date;
  createdAt: Date;
}
