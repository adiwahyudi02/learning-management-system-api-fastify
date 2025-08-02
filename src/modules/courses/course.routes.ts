import { FastifyInstance } from 'fastify';
import * as CourseController from './course.controller';
import {
  CreateCourseBodySchema,
  CourseResponseSchema,
  CreateCourseBody,
  UpdateCourseBodySchema,
  UpdateCourseBody,
} from './course.schema';
import {
  DataResponseSchema,
  ErrorResponseSchema,
} from '../../schemas/common.schema';
import { Type } from '@sinclair/typebox';

export function courseRoutes(app: FastifyInstance) {
  app.post<{
    Body: CreateCourseBody;
  }>(
    '/',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('admin')],
      schema: {
        tags: ['Courses'],
        description: 'Create a new course (admin only)',
        security: [{ bearerAuth: [] }],
        body: CreateCourseBodySchema,
        response: {
          201: DataResponseSchema(CourseResponseSchema),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
        },
      },
    },
    CourseController.create,
  );

  app.get(
    '/',
    {
      schema: {
        tags: ['Courses'],
        description: 'Get list of all courses',
        response: {
          200: DataResponseSchema(Type.Array(CourseResponseSchema)),
        },
      },
    },
    CourseController.list,
  );

  app.get<{
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
        tags: ['Courses'],
        description: 'Get course details by ID',
        response: {
          200: DataResponseSchema(CourseResponseSchema),
          404: ErrorResponseSchema,
        },
      },
    },
    CourseController.detail,
  );

  app.patch<{
    Body: UpdateCourseBody;
    Params: { id: string };
  }>(
    '/:id',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('admin')],
      schema: {
        tags: ['Courses'],
        description: 'Update a course (admin only)',
        security: [{ bearerAuth: [] }],
        body: UpdateCourseBodySchema,
        response: {
          200: DataResponseSchema(CourseResponseSchema),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    CourseController.update,
  );

  app.delete<{
    Params: { id: string };
  }>(
    '/:id',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('admin')],
      schema: {
        tags: ['Courses'],
        description: 'Delete a course (admin only)',
        security: [{ bearerAuth: [] }],
        response: {
          200: Type.Object({ message: Type.String() }),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    CourseController.remove,
  );
}
