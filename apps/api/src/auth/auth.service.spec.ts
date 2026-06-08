import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserRole } from '../database/entities/user-role.enum';
import { User } from '../database/entities/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let users: jest.Mocked<Pick<Repository<User>, 'findOne'>>;
  let jwt: jest.Mocked<Pick<JwtService, 'signAsync'>>;

  const adminUser: User = {
    id: 'user-1',
    email: 'admin@wzrusz.local',
    passwordHash: bcrypt.hashSync('changeme', 4),
    role: UserRole.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    users = { findOne: jest.fn() };
    jwt = { signAsync: jest.fn().mockResolvedValue('jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: users },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('returns token for valid credentials', async () => {
    users.findOne.mockResolvedValue(adminUser);

    await expect(
      service.login({ email: 'admin@wzrusz.local', password: 'changeme' }),
    ).resolves.toEqual({
      accessToken: 'jwt-token',
      user: { email: 'admin@wzrusz.local', role: UserRole.Admin },
    });

    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'admin@wzrusz.local',
      role: UserRole.Admin,
    });
  });

  it('rejects unknown email', async () => {
    users.findOne.mockResolvedValue(null);

    await expect(
      service.login({ email: 'missing@example.com', password: 'x' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects wrong password', async () => {
    users.findOne.mockResolvedValue(adminUser);

    await expect(
      service.login({ email: 'admin@wzrusz.local', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
