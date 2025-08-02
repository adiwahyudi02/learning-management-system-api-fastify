import { Type, Static } from '@sinclair/typebox';
import { CourseResponseSchema } from '../courses/course.schema';
import { ObjectIdSchema } from '../../schemas/common.schema';

export const EnrollmentResponseSchema = Type.Object({
  _id: ObjectIdSchema,
  user: ObjectIdSchema,
  course: CourseResponseSchema,
  enrolledAt: Type.String({ format: 'date-time' }),
});

export type EnrollmentResponse = Static<typeof EnrollmentResponseSchema>;

export const CreateEnrollmentBodySchema = Type.Object({
  courseId: ObjectIdSchema,
});

export type CreateEnrollmentBody = Static<typeof CreateEnrollmentBodySchema>;
