import { FastifyInstance } from 'fastify';
import {
  generateTokens,
  getRefreshExpiryDate,
} from '../../src/modules/auth/auth.helper';
import { RefreshTokenModel } from '../../src/modules/refreshTokens/refreshToken.model';
import { UserModel } from '../../src/modules/users/user.model';
import { UserDocument } from '../../src/modules/users/user.model';

export class AuthTestUtils {
  static readonly DUMMY_USERS = {
    learner: {
      name: 'test-learner-123',
      email: 'test-learner-123@test.com',
      password: 'password',
      role: 'learner' as const,
    },
    admin: {
      name: 'test-admin-123',
      email: 'test-admin-123@test.com',
      password: 'password',
      role: 'admin' as const,
    },
  };

  static readonly DUMMY_USERS_UPDATE = {
    learner: {
      name: 'test-learner-123-update',
      email: 'test-learner-123-update@test.com',
      password: 'password',
      role: 'learner' as const,
    },
    admin: {
      name: 'test-admin-123-update',
      email: 'test-admin-123-update@test.com',
      password: 'password',
      role: 'admin' as const,
    },
  };

  static async createDummyUser(
    role: 'admin' | 'learner',
  ): Promise<UserDocument> {
    const dummy = this.DUMMY_USERS[role];
    return await UserModel.create(dummy);
  }

  static async deleteDummyUser(role: 'admin' | 'learner') {
    const dummy = this.DUMMY_USERS[role];
    const dummy_update = this.DUMMY_USERS_UPDATE[role];

    const user = await UserModel.findOne({
      $or: [{ email: dummy.email }, { email: dummy_update.email }],
    });

    if (user) {
      await RefreshTokenModel.deleteMany({ user: user._id });
      await user.deleteOne();
    }
  }

  static async getDummyUser(app: FastifyInstance, role: 'admin' | 'learner') {
    const dummy = this.DUMMY_USERS[role];

    const user = await UserModel.findOne({ email: dummy.email });

    if (!user) {
      throw new Error('Dummy user not found');
    }

    const { accessToken, refreshToken } = generateTokens(app, user);

    await RefreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt: getRefreshExpiryDate(),
    });

    return { user, accessToken, refreshToken };
  }
}
