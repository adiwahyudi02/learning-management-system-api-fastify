import { FastifyRequest, FastifyReply } from 'fastify';
import {
  LoginBody,
  LogoutBody,
  RefreshBody,
  RegisterBody,
  UpdateUserBody,
} from './auth.schema';
import { UserModel } from '../users/user.model';
import { RefreshTokenModel } from '../refreshTokens/refreshToken.model';
import {
  generateTokens,
  getRefreshExpiryDate,
  formatUser,
} from './auth.helper';

export async function register(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body;

  const existing = await UserModel.findOne({ email });
  if (existing) {
    return reply.status(409).send({ message: 'Email already registered' });
  }

  const user = await UserModel.create({
    name,
    email,
    password,
    role: 'learner',
  });

  return reply.status(201).send({ data: formatUser(user) });
}

export async function login(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  const user = await UserModel.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return reply.status(401).send({ message: 'Invalid email or password' });
  }

  const { accessToken, refreshToken } = generateTokens(request.server, user);

  await RefreshTokenModel.create({
    user: user._id,
    token: refreshToken,
    expiresAt: getRefreshExpiryDate(),
  });

  return reply.send({
    data: {
      accessToken,
      refreshToken,
      user: formatUser(user),
    },
  });
}

export async function refresh(
  request: FastifyRequest<{ Body: RefreshBody }>,
  reply: FastifyReply,
) {
  const { refreshToken } = request.body;

  const stored = await RefreshTokenModel.findOne({ token: refreshToken });
  if (!stored || stored.expiresAt < new Date()) {
    return reply
      .status(401)
      .send({ message: 'Invalid or expired refresh token' });
  }

  const user = await UserModel.findById(stored.user);
  if (!user) {
    return reply.status(401).send({ message: 'User not found' });
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    request.server,
    user,
  );

  await RefreshTokenModel.deleteOne({ _id: stored._id });
  await RefreshTokenModel.create({
    user: user._id,
    token: newRefreshToken,
    expiresAt: getRefreshExpiryDate(),
  });

  return reply.send({
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      user: formatUser(user),
    },
  });
}

export async function logout(
  request: FastifyRequest<{ Body: LogoutBody }>,
  reply: FastifyReply,
) {
  const { refreshToken } = request.body;

  await RefreshTokenModel.deleteOne({ token: refreshToken });

  return reply.send({ message: 'Logged out successfully' });
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const user = await UserModel.findById(request.user.id);
  if (!user) {
    return reply.status(404).send({ message: 'User not found' });
  }

  return reply.send({ data: formatUser(user) });
}

export async function updateMe(
  request: FastifyRequest<{ Body: UpdateUserBody }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body;
  const user = await UserModel.findById(request.user.id);

  if (!user) {
    return reply.status(404).send({ message: 'User not found' });
  }

  if (name) {
    user.name = name;
  }

  if (email) {
    const existing = await UserModel.findOne({ email });
    if (existing && existing?._id.toString() !== user._id.toString()) {
      return reply.status(409).send({ message: 'Email already registered' });
    }
    user.email = email;
  }

  if (password) {
    user.password = password;
  }

  await user.save();

  return reply.send({ data: formatUser(user) });
}
