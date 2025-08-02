import { Type, Static } from '@sinclair/typebox';
import { ObjectIdSchema } from '../../schemas/common.schema';

export const CourseResponseSchema = Type.Object({
  _id: ObjectIdSchema,
  title: Type.String({ minLength: 1 }),
  description: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export type CourseResponse = Static<typeof CourseResponseSchema>;

// Create, Update request bodies
export const CreateCourseBodySchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  description: Type.String(),
});
export type CreateCourseBody = Static<typeof CreateCourseBodySchema>;

export const UpdateCourseBodySchema = Type.Partial(CreateCourseBodySchema);
export type UpdateCourseBody = Static<typeof UpdateCourseBodySchema>;
