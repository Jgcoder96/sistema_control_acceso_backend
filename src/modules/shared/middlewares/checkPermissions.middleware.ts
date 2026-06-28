import type { Response, Request, NextFunction } from 'express';
import type { JWTPayload } from '../../users/types/JWTPayload.type.js';
import {
  InsufficientPermissions,
  UnauthenticatedUser,
} from '../errors/index.js';

interface RequestWithUser extends Request {
  user?: JWTPayload;
}

export const checkPermissions = (requiredPermissions: string[]) => {
  return (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) throw new UnauthenticatedUser();

    const hasPermission = requiredPermissions.every((permission) =>
      user.permisos.includes(permission),
    );

    if (!hasPermission) throw new InsufficientPermissions();

    next();
  };
};
