import { Static, TSchema, Type } from '@sinclair/typebox';

export const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

export function DataResponseSchema<T extends TSchema>(data: T) {
  return Type.Object({
    data,
  });
}

export interface WebResponse<T> {
  data?: T;
  message?: string;
}

export type ErrorResponse = Static<typeof ErrorResponseSchema>;

// MongoDB ObjectId must be 24-char hex string
export const ObjectIdSchema = Type.String({
  minLength: 24,
  maxLength: 24,
  pattern: '^[a-fA-F0-9]{24}$',
});

export type ObjectIdString = string;
