import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateCourseBody, UpdateCourseBody } from './course.schema';
import { CourseModel } from './course.model';

export async function create(
  request: FastifyRequest<{ Body: CreateCourseBody }>,
  reply: FastifyReply,
) {
  const course = await CourseModel.create(request.body);
  return reply.status(201).send({ data: course });
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const courses = await CourseModel.find().sort({ createdAt: -1 });
  return reply.send({ data: courses });
}

export async function detail(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const course = await CourseModel.findById(request.params.id);
  if (!course) {
    return reply.status(404).send({ message: 'Course not found' });
  }

  return reply.send({ data: course });
}

export async function update(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateCourseBody }>,
  reply: FastifyReply,
) {
  const course = await CourseModel.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true },
  );
  if (!course) {
    return reply.status(404).send({ message: 'Course not found' });
  }
  return reply.send({ data: course });
}

export async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const course = await CourseModel.findByIdAndDelete(request.params.id);
  if (!course) {
    return reply.status(404).send({ message: 'Course not found' });
  }
  return reply.send({ message: 'Deleted successfully' });
}
