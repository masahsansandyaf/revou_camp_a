/**
 * User domain types
 * Feature: academic-potential-test
 */

export type UserStatus = 'unverified' | 'active' | 'suspended';

export interface User {
  id: string; // UUID
  fullName: string; // maks 100 karakter
  email: string; // maks 254 karakter, unik
  passwordHash: string; // bcrypt hash
  status: UserStatus;
  emailVerificationToken: string | null;
  emailVerificationExpiry: Date | null;
  passwordResetToken: string | null;
  passwordResetExpiry: Date | null;
  loginAttempts: number; // untuk rate limiting
  lockoutUntil: Date | null; // null = tidak terkunci
  lastActivityAt: Date; // untuk auto-logout 60 menit
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'user' | 'admin';

/** Subset safe to return to client (no passwordHash) */
export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
