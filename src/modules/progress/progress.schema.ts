import { Type, Static } from '@sinclair/typebox';
import { ObjectIdSchema } from '../../schemas/common.schema';

export const ProgressResponseSchema = Type.Object({
  _id: ObjectIdSchema,
  user: ObjectIdSchema,
  lesson: ObjectIdSchema,
  completedAt: Type.String({ format: 'date-time' }),
});
export type ProgressResponse = Static<typeof ProgressResponseSchema>;

export const MarkProgressBodySchema = Type.Object({
  courseId: ObjectIdSchema,
  lessonId: ObjectIdSchema,
});
export type MarkProgressBody = Static<typeof MarkProgressBodySchema>;
