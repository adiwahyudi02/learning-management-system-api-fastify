import { FastifyRequest, FastifyReply } from 'fastify';
import { LessonModel } from './lesson.model';
import { CourseModel } from '../courses/course.model';
import { EnrollmentModel } from '../enrollments/enrollment.model';
import { CreateLessonBody, UpdateLessonBody } from './lesson.schema';
import { ProgressModel } from '../progress/progress.model';

export const create = async (
  request: FastifyRequest<{
    Params: { courseId: string };
    Body: CreateLessonBody;
  }>,
  reply: FastifyReply,
) => {
  const { courseId } = request.params;
  const { title, content, order, videoUrl } = request.body;

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return reply.code(404).send({ message: 'Course not found' });
  }

  const lesson = await LessonModel.create({
    title,
    content,
    course: courseId,
    order: order ?? 0,
    videoUrl,
  });

  return reply.code(201).send({ data: lesson });
};

export const update = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateLessonBody }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const updates = request.body;

  const lesson = await LessonModel.findByIdAndUpdate(id, updates, {
    new: true,
  });
  if (!lesson) {
    return reply.code(404).send({ message: 'Lesson not found' });
  }

  return reply.send({ data: lesson });
};

export const remove = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  const lesson = await LessonModel.findByIdAndDelete(id);
  if (!lesson) {
    return reply.code(404).send({ message: 'Lesson not found' });
  }

  return reply.send({ message: 'Lesson deleted' });
};

export const listByCourse = async (
  request: FastifyRequest<{ Params: { courseId: string } }>,
  reply: FastifyReply,
) => {
  const { courseId } = request.params;
  const { id: userId, role: userRole } = request.user;

  // Check if course exists
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return reply.code(404).send({ message: 'Course not found' });
  }

  // If admin → return all without enrollment and progress
  if (userRole === 'admin') {
    const lessons = await LessonModel.find({ course: courseId }).sort('order');
    return reply.send({ data: lessons });
  }

  // If learner → check enrollment
  const enrolled = await EnrollmentModel.exists({
    user: userId,
    course: courseId,
  });

  if (!enrolled) {
    return reply.code(403).send({ message: 'Not enrolled in this course' });
  }

  // Get lessons
  const lessons = await LessonModel.find({ course: courseId }).sort('order');

  // Get progresses
  const progressDocs = await ProgressModel.find({
    user: userId,
    lesson: { $in: lessons.map((l) => l._id) },
  }).select('lesson');

  const completedIds = new Set(progressDocs.map((p) => p.lesson.toString()));

  const data = lessons.map((lesson) => ({
    _id: lesson._id.toString(),
    title: lesson.title,
    content: lesson.content,
    videoUrl: lesson.videoUrl,
    order: lesson.order,
    course: lesson.course.toString(),
    createdAt: lesson.createdAt.toISOString(),
    updatedAt: lesson.updatedAt.toISOString(),
    isCompleted: completedIds.has(lesson._id.toString()),
  }));

  return reply.send({ data });
};
