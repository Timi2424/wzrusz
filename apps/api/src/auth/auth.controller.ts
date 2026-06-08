import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  AuthenticatedUser,
  AuthUserDto,
  LoginDto,
  LoginResponseDto,
} from './auth.dto';
import { AuthService } from './auth.service';

type AuthRequest = Request & { user: AuthenticatedUser };

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return this.auth.login(body);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: AuthRequest): AuthUserDto {
    return {
      email: req.user.email,
      role: req.user.role,
    };
  }
}
