import { Static, Type } from '@sinclair/typebox';
import { UserResponseSchema } from '../users/user.schema';

export const RegisterBodySchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});
export type RegisterBody = Static<typeof RegisterBodySchema>;

export const RegisterResponseSchema = UserResponseSchema;
export type RegisterResponse = Static<typeof RegisterResponseSchema>;

export const LoginBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});
export type LoginBody = Static<typeof LoginBodySchema>;

export const LoginResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
  user: UserResponseSchema,
});

export type LoginResponse = Static<typeof LoginResponseSchema>;

export const RefreshBodySchema = Type.Object({
  refreshToken: Type.String(),
});
export type RefreshBody = Static<typeof RefreshBodySchema>;

export const RefreshResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
  user: UserResponseSchema,
});
export type RefreshResponse = Static<typeof RefreshResponseSchema>;

export const LogoutBodySchema = RefreshBodySchema;
export type LogoutBody = Static<typeof LogoutBodySchema>;

export const LogoutResponseSchema = Type.Object({
  message: Type.String(),
});
export type LogoutResponse = Static<typeof LogoutResponseSchema>;

export const UpdateUserBodySchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1 })),
  email: Type.Optional(Type.String({ format: 'email' })),
  password: Type.Optional(Type.String({ minLength: 6 })),
});
export type UpdateUserBody = Static<typeof UpdateUserBodySchema>;
