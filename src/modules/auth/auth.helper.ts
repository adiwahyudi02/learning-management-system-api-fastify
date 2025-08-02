import { FastifyRequest } from 'fastify';
import { UserDocument } from '../users/user.model';

export function generateTokens(
  server: FastifyRequest['server'],
  user: UserDocument,
) {
  const accessToken = server.jwt.sign(
    { id: user._id, role: user.role },
    { expiresIn: '15m' },
  );
  const refreshToken = server.jwt.sign({ id: user._id }, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

export function getRefreshExpiryDate() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
}

export function formatUser(user: UserDocument) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
