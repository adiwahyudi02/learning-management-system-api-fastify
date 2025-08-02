import { FastifyInstance } from 'fastify';
import * as ProgressController from './progress.controller';
import {
  MarkProgressBody,
  MarkProgressBodySchema,
  ProgressResponseSchema,
} from './progress.schema';
import { DataResponseSchema } from '../../schemas/common.schema';

export function progressRoutes(app: FastifyInstance) {
  app.post<{ Body: MarkProgressBody }>(
    '/mark-completed',
    {
      onRequest: [app.authenticate],
      preHandler: [app.authorizeRole('learner')],
      schema: {
        tags: ['Progress'],
        description: 'Learner marks a lesson as completed',
        security: [{ bearerAuth: [] }],
        body: MarkProgressBodySchema,
        response: { 201: DataResponseSchema(ProgressResponseSchema) },
      },
    },
    ProgressController.markCompleted,
  );
}
