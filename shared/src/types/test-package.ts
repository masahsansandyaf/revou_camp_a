/**
 * TestPackage & PackageQuestion domain types
 * Feature: academic-potential-test
 */

import type { TestCategoryType } from './test-category';

export type TestPackageStatus = 'draft' | 'active' | 'archived';

export interface TestPackage {
  id: string;
  name: string;
  description: string; // maks 300 karakter
  timeLimitMinutes: number; // 1–180 menit
  status: TestPackageStatus;
  categories: TestCategoryType[]; // kategori yang tercakup
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageQuestion {
  packageId: string;
  questionId: string;
  order: number; // urutan soal dalam paket
}
