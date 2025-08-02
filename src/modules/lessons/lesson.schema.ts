import { Type, Static } from '@sinclair/typebox';
import { ObjectIdSchema } from '../../schemas/common.schema';

export const LessonResponseSchema = Type.Object({
  _id: ObjectIdSchema,
  title: Type.String(),
  content: Type.String(),
  course: ObjectIdSchema,
  order: Type.Number(),
  videoUrl: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  isCompleted: Type.Optional(Type.Boolean()),
});
export type LessonResponse = Static<typeof LessonResponseSchema>;

export const CreateLessonBodySchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  content: Type.String(),
  order: Type.Optional(Type.Number()),
  videoUrl: Type.Optional(Type.String()),
});
export type CreateLessonBody = Static<typeof CreateLessonBodySchema>;

export const UpdateLessonBodySchema = Type.Partial(CreateLessonBodySchema);
export type UpdateLessonBody = Static<typeof UpdateLessonBodySchema>;
