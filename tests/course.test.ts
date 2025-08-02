import supertest from 'supertest';
import { buildApp } from '../src/app';
import { FastifyInstance } from 'fastify';
import { ErrorResponse, WebResponse } from '../src/schemas/common.schema';
import { AuthTestUtils } from './utils/auth-utils';
import { CourseTestUtils } from './utils/course-utils';
import { CourseResponse } from '../src/modules/courses/course.schema';
import { CommonUtils } from './utils/common-utils';
import { CourseModel } from '../src/modules/courses/course.model';

describe('Course', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/courses', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
      await AuthTestUtils.createDummyUser('admin');
    });

    afterEach(async () => {
      await AuthTestUtils.deleteDummyUser('learner');
      await AuthTestUtils.deleteDummyUser('admin');
    });

    it('should fail if request token is invalid', async () => {
      const res = await supertest(app.server)
        .post('/api/courses')
        .set('Authorization', 'Bearer wrong-token');

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should fail if request is invalid', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');

      const res = await supertest(app.server)
        .post('/api/courses')
        .send({ title: '', description: '' })
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body.message).toBeDefined();
    });

    it('should forbid if user is not admin', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');

      const res = await supertest(app.server)
        .post('/api/courses')
        .send(CourseTestUtils.DUMMY_COURSE)
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(403);
      expect(body.message).toBeDefined();
    });

    it('should create a new course', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');

      const res = await supertest(app.server)
        .post('/api/courses')
        .send(CourseTestUtils.DUMMY_COURSE)
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as WebResponse<CourseResponse>;

      expect(res.status).toBe(201);
      expect(body.data?._id).toBeDefined();
      expect(body.data?.title).toBe(CourseTestUtils.DUMMY_COURSE.title);
      expect(body.data?.description).toBe(
        CourseTestUtils.DUMMY_COURSE.description,
      );
    });
  });

  describe('GET /api/courses', () => {
    beforeEach(async () => {
      await CourseTestUtils.createDummyCourse();
    });

    afterEach(async () => {
      await CourseTestUtils.deleteDummyCourse();
    });

    it('should get all courses', async () => {
      const res = await supertest(app.server).get('/api/courses');

      const body = res.body as WebResponse<CourseResponse[]>;

      expect(res.status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data?.[0].title).toBe(CourseTestUtils.DUMMY_COURSE.title);
      expect(body.data?.[0].description).toBe(
        CourseTestUtils.DUMMY_COURSE.description,
      );
    });
  });

  describe('GET /api/courses/:id', () => {
    beforeEach(async () => {
      await CourseTestUtils.createDummyCourse();
    });

    afterEach(async () => {
      await CourseTestUtils.deleteDummyCourse();
    });

    it('should return not found error if course is not found', async () => {
      const nonExistingObjectId =
        await CommonUtils.getNonExistingObjectId(CourseModel);
      const res = await supertest(app.server).get(
        `/api/courses/${nonExistingObjectId}`,
      );

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(404);
      expect(body.message).toBeDefined();
    });
  });

  describe('PATCH /api/courses/:id', () => {
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

    it('should return not found error if course is not found', async () => {
      const nonExistingObjectId =
        await CommonUtils.getNonExistingObjectId(CourseModel);
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');

      const res = await supertest(app.server)
        .patch(`/api/courses/${nonExistingObjectId}`)
        .send(CourseTestUtils.DUMMY_COURSE_UPDATE)
        .set('Authorization', `Bearer ${accessToken}`);
      const body = res.body as ErrorResponse;

      expect(res.status).toBe(404);
      expect(body.message).toBeDefined();
    });

    it('should fail if request is invalid', async () => {
      const course = await CourseTestUtils.getDummyCourse();
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');

      const res = await supertest(app.server)
        .patch(`/api/courses/${course._id as string}`)
        .send({ title: '' })
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body.message).toBeDefined();
    });

    it('should fail if user is not admin', async () => {
      const course = await CourseTestUtils.getDummyCourse();
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');

      const res = await supertest(app.server)
        .patch(`/api/courses/${course._id as string}`)
        .send(CourseTestUtils.DUMMY_COURSE_UPDATE)
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(403);
      expect(body.message).toBeDefined();
    });

    it('should update a course', async () => {
      const course = await CourseTestUtils.getDummyCourse();
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');

      const res = await supertest(app.server)
        .patch(`/api/courses/${course._id as string}`)
        .send(CourseTestUtils.DUMMY_COURSE_UPDATE)
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as WebResponse<CourseResponse>;

      expect(res.status).toBe(200);
      expect(body.data?._id).toBeDefined();
      expect(body.data?.title).toBe(CourseTestUtils.DUMMY_COURSE_UPDATE.title);
      expect(body.data?.description).toBe(
        CourseTestUtils.DUMMY_COURSE_UPDATE.description,
      );
    });
  });

  describe('DELETE /api/courses/:id', () => {
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

    it('should return not found error if course is not found', async () => {
      const nonExistingObjectId =
        await CommonUtils.getNonExistingObjectId(CourseModel);

      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');

      const res = await supertest(app.server)
        .delete(`/api/courses/${nonExistingObjectId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      const body = res.body as ErrorResponse;

      expect(res.status).toBe(404);
      expect(body.message).toBeDefined();
    });

    it('should fail if user is not admin', async () => {
      const course = await CourseTestUtils.getDummyCourse();
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');

      const res = await supertest(app.server)
        .delete(`/api/courses/${course._id as string}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(403);
      expect(body.message).toBeDefined();
    });

    it('should delete a course', async () => {
      const course = await CourseTestUtils.getDummyCourse();
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'admin');

      const res = await supertest(app.server)
        .delete(`/api/courses/${course._id as string}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
    });
  });
});
