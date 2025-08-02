import supertest from 'supertest';
import { buildApp } from '../src/app';
import { FastifyInstance } from 'fastify';
import { AuthTestUtils } from './utils/auth-utils';
import { CourseTestUtils } from './utils/course-utils';
import { ErrorResponse, WebResponse } from '../src/schemas/common.schema';
import { LessonTestUtils } from './utils/lesson-utils';
import { LessonResponse } from '../src/modules/lessons/lesson.schema';
import { EnrollmentTestUtils } from './utils/enrollment-utils';
import { ProgressTestUtils } from './utils/progress-utils';

describe('Lesson', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/courses/${coursesId}/lessons', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
      await AuthTestUtils.createDummyUser('admin');
      await CourseTestUtils.createDummyCourse();
    });

    afterEach(async () => {
      await CourseTestUtils.deleteDummyCourse();
      await AuthTestUtils.deleteDummyUser('learner');
      await AuthTestUtils.deleteDummyUser('admin');
    });

    it('should fail if request is invalid', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      const res = await supertest(app.server)
        .post(`/api/courses/${courseId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: '' });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body.message).toBeDefined();
    });

    it('should fail if user is not admin', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      const res = await supertest(app.server)
        .post(`/api/courses/${courseId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(LessonTestUtils.DUMMY_LESSON);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(403);
      expect(body.message).toBeDefined();
    });

    it('should create a new lesson', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      const res = await supertest(app.server)
        .post(`/api/courses/${courseId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(LessonTestUtils.DUMMY_LESSON);

      const body = res.body as WebResponse<LessonResponse>;

      expect(res.status).toBe(201);
      expect(body.data?._id).toBeDefined();
      expect(body.data?.title).toBe(LessonTestUtils.DUMMY_LESSON.title);
      expect(body.data?.content).toBe(LessonTestUtils.DUMMY_LESSON.content);
    });
  });

  describe('GET /api/courses/${coursesId}/lessons', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
      await AuthTestUtils.createDummyUser('admin');
      await CourseTestUtils.createDummyCourse();
      await LessonTestUtils.createDummyLesson();
    });

    afterEach(async () => {
      await LessonTestUtils.deleteDummyLesson();
      await CourseTestUtils.deleteDummyCourse();
      await AuthTestUtils.deleteDummyUser('learner');
      await AuthTestUtils.deleteDummyUser('admin');
    });

    it('should fail if token is invalid', async () => {
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      const res = await supertest(app.server)
        .get(`/api/courses/${courseId}/lessons`)
        .set('Authorization', `Bearer invalid-token`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should return a list of lessons (admin)', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      const res = await supertest(app.server)
        .get(`/api/courses/${courseId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as WebResponse<LessonResponse[]>;

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(1);
    });

    it('should return forbidden because the course not enrolled (learner)', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      const res = await supertest(app.server)
        .get(`/api/courses/${courseId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(403);
    });

    it('should return a list of lessons that the course has been enrolled (learner)', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      // enroll the course
      await EnrollmentTestUtils.createDummyEnrollment(app);

      const res = await supertest(app.server)
        .get(`/api/courses/${courseId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`);

      await ProgressTestUtils.deleteDummyProgress(app);
      await EnrollmentTestUtils.deleteDummyEnrollment(app);

      const body = res.body as WebResponse<LessonResponse[]>;

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(1);
    });

    it('should return the progres isCompleted is false', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      // enroll the course
      await EnrollmentTestUtils.createDummyEnrollment(app);

      const res = await supertest(app.server)
        .get(`/api/courses/${courseId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`);

      await ProgressTestUtils.deleteDummyProgress(app);
      await EnrollmentTestUtils.deleteDummyEnrollment(app);

      const body = res.body as WebResponse<LessonResponse[]>;

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data?.[0].isCompleted).toBe(false);
    });

    it('should return the progres isCompleted is true', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      // mark a lesson as completed
      await EnrollmentTestUtils.createDummyEnrollment(app);
      await ProgressTestUtils.createDummyProgress(app);

      const res = await supertest(app.server)
        .get(`/api/courses/${courseId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`);

      await ProgressTestUtils.deleteDummyProgress(app);
      await EnrollmentTestUtils.deleteDummyEnrollment(app);

      const body = res.body as WebResponse<LessonResponse[]>;

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data?.[0].isCompleted).toBe(true);
    });
  });

  describe('PATCH /api/lessons/:id', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
      await AuthTestUtils.createDummyUser('admin');
      await CourseTestUtils.createDummyCourse();
      await LessonTestUtils.createDummyLesson();
    });

    afterEach(async () => {
      await LessonTestUtils.deleteDummyLesson();
      await CourseTestUtils.deleteDummyCourse();
      await AuthTestUtils.deleteDummyUser('learner');
      await AuthTestUtils.deleteDummyUser('admin');
    });

    it('should fail if token is invalid', async () => {
      const lesson = await LessonTestUtils.getDummyLesson();
      const lessonId = lesson._id as unknown as string;

      const res = await supertest(app.server)
        .patch(`/api/lessons/${lessonId}`)
        .set('Authorization', `Bearer invalid-token`)
        .send(LessonTestUtils.DUMMY_LESSON_UPDATE);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should fail if user is not admin', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const lesson = await LessonTestUtils.getDummyLesson();
      const lessonId = lesson._id as unknown as string;

      const res = await supertest(app.server)
        .patch(`/api/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(LessonTestUtils.DUMMY_LESSON_UPDATE);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(403);
      expect(body.message).toBeDefined();
    });

    it('should update a lesson', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');
      const lesson = await LessonTestUtils.getDummyLesson();
      const lessonId = lesson._id as unknown as string;

      const res = await supertest(app.server)
        .patch(`/api/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(LessonTestUtils.DUMMY_LESSON_UPDATE);

      const body = res.body as WebResponse<LessonResponse>;

      expect(res.status).toBe(200);
      expect(body.data?.title).toBe(LessonTestUtils.DUMMY_LESSON_UPDATE.title);
      expect(body.data?.content).toBe(
        LessonTestUtils.DUMMY_LESSON_UPDATE.content,
      );
      expect(body.data?.order).toBe(LessonTestUtils.DUMMY_LESSON_UPDATE.order);
      expect(body.data?.videoUrl).toBe(
        LessonTestUtils.DUMMY_LESSON_UPDATE.videoUrl,
      );
    });
  });

  describe('DELETE /api/lessons/:id', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
      await AuthTestUtils.createDummyUser('admin');
      await CourseTestUtils.createDummyCourse();
      await LessonTestUtils.createDummyLesson();
    });

    afterEach(async () => {
      await LessonTestUtils.deleteDummyLesson();
      await CourseTestUtils.deleteDummyCourse();
      await AuthTestUtils.deleteDummyUser('learner');
      await AuthTestUtils.deleteDummyUser('admin');
    });

    it('should fail if token is invalid', async () => {
      const lesson = await LessonTestUtils.getDummyLesson();
      const lessonId = lesson._id as unknown as string;

      const res = await supertest(app.server)
        .delete(`/api/lessons/${lessonId}`)
        .set('Authorization', `Bearer invalid-token`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should fail if user is not admin', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const lesson = await LessonTestUtils.getDummyLesson();
      const lessonId = lesson._id as unknown as string;

      const res = await supertest(app.server)
        .delete(`/api/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(403);
      expect(body.message).toBeDefined();
    });

    it('should delete a lesson', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');
      const lesson = await LessonTestUtils.getDummyLesson();
      const lessonId = lesson._id as unknown as string;

      const res = await supertest(app.server)
        .delete(`/api/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
    });
  });
});
