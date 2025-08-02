import supertest from 'supertest';
import { buildApp } from '../src/app';
import { FastifyInstance } from 'fastify';
import { ErrorResponse, WebResponse } from '../src/schemas/common.schema';
import { AuthTestUtils } from './utils/auth-utils';
import { CourseTestUtils } from './utils/course-utils';
import { CommonUtils } from './utils/common-utils';
import { CourseModel } from '../src/modules/courses/course.model';
import { EnrollmentTestUtils } from './utils/enrollment-utils';
import { EnrollmentResponse } from '../src/modules/enrollments/enrollment.schema';

describe('Enrollment', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/enrollments', () => {
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

      const res = await supertest(app.server)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ courseId: '' });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body.message).toBeDefined();
    });

    it('should fail if user is not learner', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');
      const courseId = await CommonUtils.getNonExistingObjectId(CourseModel);

      const res = await supertest(app.server)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ courseId });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(403);
      expect(body.message).toBeDefined();
    });

    it('should fail if course does not exist', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const courseId = await CommonUtils.getNonExistingObjectId(CourseModel);

      const res = await supertest(app.server)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ courseId });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(404);
      expect(body.message).toBeDefined();
    });

    it('should create a new enrollment', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const course = await CourseTestUtils.getDummyCourse();
      const courseId = course._id as string;

      const res = await supertest(app.server)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ courseId });

      const body = res.body as WebResponse<EnrollmentResponse>;

      expect(res.status).toBe(201);
      expect(body).toBeDefined();
      expect(body.data).toHaveProperty('_id');
      expect(body.data).toHaveProperty('course');
      expect(body.data).toHaveProperty('user');
      expect(body.data).toHaveProperty('enrolledAt');
    });
  });

  describe('GET /api/enrollments/me', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('admin');
      await AuthTestUtils.createDummyUser('learner');
      await CourseTestUtils.createDummyCourse();
      await EnrollmentTestUtils.createDummyEnrollment(app);
    });

    afterEach(async () => {
      await EnrollmentTestUtils.deleteDummyEnrollment(app);
      await CourseTestUtils.deleteDummyCourse();
      await AuthTestUtils.deleteDummyUser('admin');
      await AuthTestUtils.deleteDummyUser('learner');
    });

    it('should fail if token is invalid', async () => {
      const res = await supertest(app.server).get('/api/enrollments/me');

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should return a list of enrollments', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');
      const res = await supertest(app.server)
        .get('/api/enrollments/me')
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as WebResponse<EnrollmentResponse[]>;

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(1);
    });
  });
});
