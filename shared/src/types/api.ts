/**
 * Shared API request/response types
 * Feature: academic-potential-test
 */

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  fullName: string; // 1–100 karakter
  email: string; // format valid, maks 254 karakter
  password: string; // 8–128 karakter
}

export interface RegisterResponse {
  status: 'success';
  message: string;
  data: { userId: string };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: 'success';
  data: {
    accessToken: string; // JWT, expiry 60 menit
    refreshToken: string; // opaque token, expiry 7 hari
    user: {
      id: string;
      fullName: string;
      email: string;
      role: 'user' | 'admin';
    };
  };
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string; // 8–128 karakter
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  status: 'success';
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LogoutRequest {
  refreshToken: string;
}

// ─── Test Session ─────────────────────────────────────────────────────────────

export interface CreateSessionRequest {
  packageId: string;
}

export interface SaveAnswerRequest {
  questionId: string;
  selectedOptionId: string | null;
}

export interface SyncAnswersRequest {
  answers: Array<{
    questionId: string;
    selectedOptionId: string | null;
    savedAt: string; // ISO 8601
  }>;
}

export interface SyncAnswersResponse {
  status: 'success';
  data: {
    synced: number;
    skipped: number;
    conflicts: Array<{ questionId: string; reason: string }>;
  };
}

export interface FinishSessionRequest {
  finalAnswer?: {
    questionId: string;
    selectedOptionId: string | null;
  };
}

export interface FinishSessionResponse {
  status: 'success';
  data: {
    sessionId: string;
    resultId: string;
    totalScore: number;
    abilityLabel: string;
  };
}

// ─── Generic API response ─────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  status: 'success';
  data: T;
}

export interface ApiErrorResponse {
  status: 'error';
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
