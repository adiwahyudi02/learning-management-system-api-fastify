import { FastifyInstance } from 'fastify';
import * as EnrollmentController from './enrollment.controller';
import {
  CreateEnrollmentBody,
  CreateEnrollmentBodySchema,
  EnrollmentResponseSchema,
} from './enrollment.schema';
import { Type } from '@sinclair/typebox';
import { DataResponseSchema } from '../../schemas/common.schema';

export function enrollmentRoutes(app: FastifyInstance) {
  app.post<{
    Body: CreateEnrollmentBody;
  }>(
    '/',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('learner')],
      schema: {
        tags: ['Enrollments'],
        description: 'Enroll in a course',
        security: [{ bearerAuth: [] }],
        body: CreateEnrollmentBodySchema,
        response: { 201: DataResponseSchema(EnrollmentResponseSchema) },
      },
    },
    EnrollmentController.create,
  );

  app.get(
    '/me',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('learner')],
      schema: {
        tags: ['Enrollments'],
        description: 'Get list of enrollments for the current learner',
        security: [{ bearerAuth: [] }],
        response: {
          200: DataResponseSchema(Type.Array(EnrollmentResponseSchema)),
        },
      },
    },
    EnrollmentController.get,
  );
}
