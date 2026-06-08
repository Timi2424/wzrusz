export type UserRole = 'admin' | 'user';

export interface AuthUser {
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface InquirySummary {
  id: string;
  fullName: string;
  email: string;
  eventStart: string;
  eventEnd: string;
  status: 'submitted';
  createdAt: string;
  lineItemCount: number;
}
