import supertest from 'supertest';
import { buildApp } from '../src/app';
import { AuthTestUtils } from './utils/auth-utils';
import {
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
} from '../src/modules/auth/auth.schema';
import { FastifyInstance } from 'fastify';
import { ErrorResponse, WebResponse } from '../src/schemas/common.schema';
import { UserResponse } from '../src/modules/users/user.schema';

describe('Auth', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    afterEach(async () => {
      await AuthTestUtils.deleteDummyUser('learner');
    });

    it('should fail if request is invalid', async () => {
      const res = await supertest(app.server)
        .post('/api/auth/register')
        .send({ name: '', email: '', password: '' });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body.message).toBeDefined();
    });

    it('should fail if email is already registered', async () => {
      await AuthTestUtils.createDummyUser('learner');
      const res = await supertest(app.server).post('/api/auth/register').send({
        name: AuthTestUtils.DUMMY_USERS.learner.name,
        email: AuthTestUtils.DUMMY_USERS.learner.email,
        password: AuthTestUtils.DUMMY_USERS.learner.password,
      });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(409);
      expect(body.message).toBeDefined();
    });

    it('should register a new user', async () => {
      const res = await supertest(app.server).post('/api/auth/register').send({
        name: AuthTestUtils.DUMMY_USERS.learner.name,
        email: AuthTestUtils.DUMMY_USERS.learner.email,
        password: AuthTestUtils.DUMMY_USERS.learner.password,
      });

      const body = res.body as WebResponse<RegisterResponse>;

      expect(res.status).toBe(201);
      expect(body.data).toHaveProperty('_id');
      expect(body.data).toHaveProperty(
        'name',
        AuthTestUtils.DUMMY_USERS.learner.name,
      );
      expect(body.data).toHaveProperty(
        'email',
        AuthTestUtils.DUMMY_USERS.learner.email,
      );
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
    });

    afterEach(async () => {
      await AuthTestUtils.deleteDummyUser('learner');
    });

    it('should fail if request is invalid', async () => {
      const res = await supertest(app.server)
        .post('/api/auth/login')
        .send({ email: '', password: '' });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body.message).toBeDefined();
    });

    it('should fail if email or password is incorrect', async () => {
      const res = await supertest(app.server).post('/api/auth/login').send({
        email: 'invalid-email@test.com',
        password: 'invalid-password',
      });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should login a user', async () => {
      const res = await supertest(app.server).post('/api/auth/login').send({
        email: AuthTestUtils.DUMMY_USERS.learner.email,
        password: AuthTestUtils.DUMMY_USERS.learner.password,
      });

      const body = res.body as WebResponse<LoginResponse>;

      expect(res.status).toBe(200);
      expect(body.data).toHaveProperty('accessToken');
      expect(body.data).toHaveProperty('refreshToken');
      expect(body.data?.user).toHaveProperty('_id');
      expect(body.data?.user).toHaveProperty(
        'name',
        AuthTestUtils.DUMMY_USERS.learner.name,
      );
      expect(body.data?.user).toHaveProperty(
        'email',
        AuthTestUtils.DUMMY_USERS.learner.email,
      );
    });
  });

  describe('POST /api/auth/refresh', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
    });

    afterEach(async () => {
      await AuthTestUtils.deleteDummyUser('learner');
    });

    it('should fail if request is invalid', async () => {
      const res = await supertest(app.server)
        .post('/api/auth/refresh')
        .send({ refreshToken: '' });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should fail if refresh token is invalid', async () => {
      const res = await supertest(app.server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-refresh-token' });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should refresh access token', async () => {
      const { refreshToken } = await AuthTestUtils.getDummyUser(app, 'learner');

      const res = await supertest(app.server)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      const body = res.body as WebResponse<RefreshResponse>;

      expect(res.status).toBe(200);
      expect(body.data).toHaveProperty('accessToken');
      expect(body.data).toHaveProperty('refreshToken');
      expect(body.data?.user).toHaveProperty('_id');
      expect(body.data?.user).toHaveProperty(
        'name',
        AuthTestUtils.DUMMY_USERS.learner.name,
      );
      expect(body.data?.user).toHaveProperty(
        'email',
        AuthTestUtils.DUMMY_USERS.learner.email,
      );
    });
  });

  describe('POST /api/auth/logout', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
    });

    afterEach(async () => {
      await AuthTestUtils.deleteDummyUser('learner');
    });

    it('should fail if request is invalid', async () => {
      const res = await supertest(app.server).post('/api/auth/logout');

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body.message).toBeDefined();
    });

    it('should logout a user', async () => {
      const { refreshToken } = await AuthTestUtils.getDummyUser(app, 'learner');

      const res = await supertest(app.server)
        .post('/api/auth/logout')
        .send({ refreshToken });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/auth/me', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
    });

    afterEach(async () => {
      await AuthTestUtils.deleteDummyUser('learner');
    });

    it('should fail if request is invalid', async () => {
      const res = await supertest(app.server).get('/api/auth/me');

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(401);
      expect(body.message).toBeDefined();
    });

    it('should get current user', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');

      const res = await supertest(app.server)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      const body = res.body as WebResponse<UserResponse>;

      expect(res.status).toBe(200);
      expect(body.data).toHaveProperty('_id');
      expect(body.data).toHaveProperty(
        'name',
        AuthTestUtils.DUMMY_USERS.learner.name,
      );
      expect(body.data).toHaveProperty(
        'email',
        AuthTestUtils.DUMMY_USERS.learner.email,
      );
    });
  });

  describe('PATCH /api/auth/me', () => {
    beforeEach(async () => {
      await AuthTestUtils.createDummyUser('learner');
    });

    afterEach(async () => {
      await AuthTestUtils.deleteDummyUser('learner');
    });

    it('should fail if request is invalid', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');

      const res = await supertest(app.server)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' });

      const body = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body.message).toBeDefined();
    });

    it('should update current user', async () => {
      const { accessToken } = await AuthTestUtils.getDummyUser(app, 'learner');

      const res = await supertest(app.server)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: AuthTestUtils.DUMMY_USERS_UPDATE.learner.name,
          email: AuthTestUtils.DUMMY_USERS_UPDATE.learner.email,
          password: AuthTestUtils.DUMMY_USERS_UPDATE.learner.password,
        });

      const body = res.body as WebResponse<UserResponse>;

      expect(res.status).toBe(200);
      expect(body.data).toHaveProperty('_id');
      expect(body.data).toHaveProperty(
        'name',
        AuthTestUtils.DUMMY_USERS_UPDATE.learner.name,
      );
      expect(body.data).toHaveProperty(
        'email',
        AuthTestUtils.DUMMY_USERS_UPDATE.learner.email,
      );
    });
  });
});
