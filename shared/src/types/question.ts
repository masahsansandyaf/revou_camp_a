/**
 * Question & AnswerOption domain types
 * Feature: academic-potential-test
 */

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/** Public answer option (isCorrect hidden from test-takers) */
export type PublicAnswerOption = Omit<AnswerOption, 'isCorrect'>;

export interface Question {
  id: string;
  text: string; // teks pertanyaan
  categoryId: string; // FK ke TestCategory
  options: AnswerOption[]; // 2–5 pilihan, tepat 1 isCorrect = true
  explanation: string; // maks 300 karakter
  createdBy: string; // FK ke User (admin)
  createdAt: Date;
  updatedAt: Date;
}

/** Public question (without isCorrect on options) */
export interface PublicQuestion {
  id: string;
  order: number;
  text: string;
  categoryId: string;
  options: PublicAnswerOption[];
}
