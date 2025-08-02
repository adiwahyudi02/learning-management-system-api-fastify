import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateEnrollmentBody } from './enrollment.schema';
import { EnrollmentModel } from './enrollment.model';
import { CourseModel } from '../courses/course.model';

export const create = async (
  request: FastifyRequest<{ Body: CreateEnrollmentBody }>,
  reply: FastifyReply,
) => {
  const userId = request.user.id;
  const { courseId } = request.body;

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return reply.code(404).send({ message: 'Course not found' });
  }

  const existing = await EnrollmentModel.findOne({
    user: userId,
    course: courseId,
  });
  if (existing) {
    return reply.code(400).send({ message: 'Already enrolled' });
  }

  let enrollment = await EnrollmentModel.create({
    user: userId,
    course: courseId,
  });

  enrollment = await enrollment.populate('course');

  return reply.code(201).send({ data: enrollment });
};

export const get = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.id;
  const enrollments = await EnrollmentModel.find({ user: userId }).populate(
    'course',
  );

  return reply.send({ data: enrollments });
};
