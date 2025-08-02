import { Static, Type } from '@sinclair/typebox';
import { ObjectIdSchema } from '../../schemas/common.schema';

export const UserResponseSchema = Type.Object(
  {
    _id: ObjectIdSchema,
    name: Type.String(),
    email: Type.String(),
    role: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'UserResponse' },
);

export type UserResponse = Static<typeof UserResponseSchema>;
