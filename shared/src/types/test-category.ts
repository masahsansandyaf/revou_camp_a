/**
 * TestCategory domain types
 * Feature: academic-potential-test
 */

export type TestCategoryType = 'verbal' | 'numeric' | 'logic';

export interface TestCategory {
  id: string;
  name: string; // "Verbal" | "Numerik" | "Logika"
  type: TestCategoryType;
  description: string;
}
