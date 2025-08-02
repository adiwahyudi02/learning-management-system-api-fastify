import { FastifyInstance } from 'fastify';
import * as LessonController from './lesson.controller';
import {
  CreateLessonBody,
  CreateLessonBodySchema,
  LessonResponseSchema,
  UpdateLessonBody,
  UpdateLessonBodySchema,
} from './lesson.schema';
import { Type } from '@sinclair/typebox';
import {
  DataResponseSchema,
  ErrorResponseSchema,
} from '../../schemas/common.schema';

export function lessonRoutes(app: FastifyInstance) {
  app.post<{ Params: { courseId: string }; Body: CreateLessonBody }>(
    '/courses/:courseId/lessons',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('admin')],
      schema: {
        tags: ['Lessons'],
        description: 'Create lesson in course (admin only)',
        security: [{ bearerAuth: [] }],
        params: Type.Object({ courseId: Type.String() }),
        body: CreateLessonBodySchema,
        response: {
          201: DataResponseSchema(LessonResponseSchema),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
        },
      },
    },
    LessonController.create,
  );

  app.patch<{ Params: { id: string }; Body: UpdateLessonBody }>(
    '/lessons/:id',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('admin')],
      schema: {
        tags: ['Lessons'],
        description: 'Update lesson (admin only)',
        security: [{ bearerAuth: [] }],
        params: Type.Object({ id: Type.String() }),
        body: UpdateLessonBodySchema,
        response: {
          200: DataResponseSchema(LessonResponseSchema),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    LessonController.update,
  );

  app.delete<{ Params: { id: string } }>(
    '/lessons/:id',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('admin')],
      schema: {
        tags: ['Lessons'],
        description: 'Delete lesson (admin only)',
        security: [{ bearerAuth: [] }],
        params: Type.Object({ id: Type.String() }),
        response: {
          200: Type.Object({ message: Type.String() }),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    LessonController.remove,
  );

  app.get<{ Params: { courseId: string } }>(
    '/courses/:courseId/lessons',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('learner', 'admin')],
      schema: {
        tags: ['Lessons'],
        description:
          'Get lessons for enrolled course as learner OR as an admin',
        security: [{ bearerAuth: [] }],
        params: Type.Object({ courseId: Type.String() }),
        response: {
          200: DataResponseSchema(Type.Array(LessonResponseSchema)),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    LessonController.listByCourse,
  );
}
