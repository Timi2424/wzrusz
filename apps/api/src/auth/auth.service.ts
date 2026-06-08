import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserRole } from '../database/entities/user-role.enum';
import { User } from '../database/entities/user.entity';
import {
  AuthenticatedUser,
  AuthUserDto,
  JwtPayload,
  LoginDto,
  LoginResponseDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const email = dto.email?.trim().toLowerCase();
    const password = dto.password ?? '';

    if (!email || !password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = await this.users.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwt.signAsync(this.toJwtPayload(user));

    return {
      accessToken,
      user: this.toAuthUser(user),
    };
  }

  toAuthenticatedUser(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }

  private toJwtPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }

  private toAuthUser(user: User): AuthUserDto {
    return {
      email: user.email,
      role: user.role,
    };
  }
}

export function isAdminRole(role: UserRole): boolean {
  return role === UserRole.Admin;
}
