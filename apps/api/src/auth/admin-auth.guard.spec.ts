import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '../database/entities/user-role.enum';
import { AdminAuthGuard } from './admin-auth.guard';

describe('AdminAuthGuard', () => {
  let guard: AdminAuthGuard;

  beforeEach(() => {
    guard = new AdminAuthGuard();
  });

  it('rejects unauthenticated requests', () => {
    expect(() => guard.handleRequest(null, false)).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects non-admin users', () => {
    expect(() =>
      guard.handleRequest(null, {
        sub: 'user-2',
        email: 'user@example.com',
        role: UserRole.User,
      }),
    ).toThrow(ForbiddenException);
  });

  it('allows admin users', () => {
    const user = {
      sub: 'user-1',
      email: 'admin@wzrusz.local',
      role: UserRole.Admin,
    };

    expect(guard.handleRequest(null, user)).toEqual(user);
  });

  it('delegates canActivate to passport jwt strategy', () => {
    const activate = jest
      .spyOn(Object.getPrototypeOf(AdminAuthGuard.prototype), 'canActivate')
      .mockReturnValue(true);

    const context = {} as ExecutionContext;
    expect(guard.canActivate(context)).toBe(true);
    expect(activate).toHaveBeenCalledWith(context);

    activate.mockRestore();
  });
});
