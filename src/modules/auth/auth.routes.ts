import { FastifyInstance } from 'fastify';
import {
  LoginBody,
  LoginBodySchema,
  LoginResponseSchema,
  LogoutBodySchema,
  LogoutResponseSchema,
  RefreshBody,
  RefreshBodySchema,
  RefreshResponseSchema,
  RegisterBody,
  RegisterBodySchema,
  RegisterResponseSchema,
  UpdateUserBody,
  UpdateUserBodySchema,
} from './auth.schema';
import {
  DataResponseSchema,
  ErrorResponseSchema,
} from '../../schemas/common.schema';
import * as AuthController from './auth.controller';
import { UserResponseSchema } from '../users/user.schema';

export function authRoutes(app: FastifyInstance) {
  app.post<{
    Body: RegisterBody;
  }>(
    '/register',
    {
      schema: {
        description: 'Register for a learner account',
        tags: ['Auth'],
        body: RegisterBodySchema,
        response: {
          201: DataResponseSchema(RegisterResponseSchema),
          400: ErrorResponseSchema,
          409: ErrorResponseSchema,
        },
      },
    },
    AuthController.register,
  );

  app.post<{
    Body: LoginBody;
  }>(
    '/login',
    {
      schema: {
        description: 'User login',
        tags: ['Auth'],
        body: LoginBodySchema,
        response: {
          200: DataResponseSchema(LoginResponseSchema),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
        },
      },
    },
    AuthController.login,
  );

  app.post<{
    Body: RefreshBody;
  }>(
    '/refresh',
    {
      schema: {
        description: 'Refresh access token',
        tags: ['Auth'],
        body: RefreshBodySchema,
        response: {
          200: DataResponseSchema(RefreshResponseSchema),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
        },
      },
    },
    (request, reply) => AuthController.refresh(request, reply),
  );

  app.post<{
    Body: RefreshBody;
  }>(
    '/logout',
    {
      schema: {
        description: 'Logout: revoke refresh token',
        tags: ['Auth'],
        body: LogoutBodySchema,
        response: {
          200: LogoutResponseSchema,
          400: ErrorResponseSchema,
        },
      },
    },
    AuthController.logout,
  );

  app.get(
    '/me',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Auth'],
        description: 'Get current user info',
        security: [{ bearerAuth: [] }],
        response: {
          200: DataResponseSchema(UserResponseSchema),
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    AuthController.me,
  );

  app.patch<{
    Body: UpdateUserBody;
  }>(
    '/me',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Auth'],
        description: 'Update current user info',
        security: [{ bearerAuth: [] }],
        body: UpdateUserBodySchema,
        response: {
          200: DataResponseSchema(UserResponseSchema),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    AuthController.updateMe,
  );
}
