import { FastifyRequest, FastifyReply } from 'fastify';
import { ProgressModel } from './progress.model';
import { MarkProgressBody } from './progress.schema';
import { EnrollmentModel } from '../enrollments/enrollment.model';

export const markCompleted = async (
  request: FastifyRequest<{ Body: MarkProgressBody }>,
  reply: FastifyReply,
) => {
  const userId = request.user.id;
  const { courseId, lessonId } = request.body;

  const enrolled = await EnrollmentModel.findOne({
    user: userId,
    course: courseId,
  });

  if (!enrolled) {
    return reply.code(403).send({ message: 'Not enrolled in this course' });
  }

  // check if already marked
  const existing = await ProgressModel.findOne({
    user: userId,
    lesson: lessonId,
  });

  if (existing) {
    return reply.code(400).send({ message: 'Already completed' });
  }

  const progress = await ProgressModel.create({
    user: userId,
    lesson: lessonId,
  });

  return reply.code(201).send({ data: progress });
};
