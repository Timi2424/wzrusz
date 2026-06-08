import { UserRole } from '../database/entities/user-role.enum';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUserDto {
  email: string;
  role: UserRole;
}

export interface LoginResponseDto {
  accessToken: string;
  user: AuthUserDto;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
