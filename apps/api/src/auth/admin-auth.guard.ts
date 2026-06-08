import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from './auth.dto';
import { isAdminRole } from './auth.service';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = AuthenticatedUser>(
    err: Error | null,
    user: TUser | false,
  ): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException();
    }

    const authUser = user as unknown as AuthenticatedUser;
    if (!isAdminRole(authUser.role)) {
      throw new ForbiddenException('Admin access required');
    }

    return user;
  }

  override canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
