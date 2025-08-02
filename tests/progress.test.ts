import supertest from 'supertest';
import { buildApp } from '../src/app';
import { FastifyInstance } from 'fastify';
import { AuthTestUtils } from './utils/auth-utils';
import { CourseTestUtils } from './utils/course-utils';
import { LessonTestUtils } from './utils/lesson-utils';
import { EnrollmentTestUtils } from './utils/enrollment-utils';
import { ProgressTestUtils } from './utils/progress-utils';
import { ErrorResponse } from '../src/schemas/common.schema';

describe('Progress', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/progress/mark-completed', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
      await AuthTestUtils.createDummyUser('admin');
      await CourseTestUtils.createDummyCourse();
      await LessonTestUtils.createDummyLesson();
      await EnrollmentTestUtils.createDummyEnrollment(app);
    });

    afterEach(async () => {
      await ProgressTestUtils.deleteDummyProgress(app);
      await EnrollmentTestUtils.deleteDummyEnrollment(app);
      await LessonTestUtils.deleteDummyLesson();
      await CourseTestUtils.deleteDummyCourse();
      await AuthTestUtils.deleteDummyUser('learner');
      await AuthTestUtils.deleteDummyUser('admin');
    });

    it('should fail if request is invalid', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const res = await supertest(app.server)
        .post('/api/progress/mark-completed')
        .send({ lessonId: '' })
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body.message).toBeDefined();
    });

    it('should fail if token is invalid', async () => {
      const res = await supertest(app.server)
        .post('/api/progress/mark-completed')
        .send({ lessonId: '' })
        .set('Authorization', `Bearer invalid-token`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should mark a lesson as completed', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;
      const lesson = await LessonTestUtils.getDummyLesson();
      const lessonId = lesson._id as unknown as string;

      const res = await supertest(app.server)
        .post('/api/progress/mark-completed')
        .send({ courseId, lessonId })
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(201);
    });
  });
});
