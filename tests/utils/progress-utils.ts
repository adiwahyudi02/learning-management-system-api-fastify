import { FastifyInstance } from 'fastify';
import { AuthTestUtils } from './auth-utils';
import { LessonTestUtils } from './lesson-utils';
import { ProgressModel } from '../../src/modules/progress/progress.model';

export class ProgressTestUtils {
  static async createDummyProgress(app: FastifyInstance) {
    // !important: you should call createDummyLesson & createDummyUser at beforeEach
    const { user } = await AuthTestUtils.getDummyUser(app, 'learner');
    const lesson = await LessonTestUtils.getDummyLesson();

    return await ProgressModel.create({
      user: user._id,
      lesson: lesson._id,
    });
  }

  static async deleteDummyProgress(app: FastifyInstance) {
    // !important: you should call createDummyLesson & createDummyUser at beforeEach
    const { user } = await AuthTestUtils.getDummyUser(app, 'learner');
    const lesson = await LessonTestUtils.getDummyLesson();

    await ProgressModel.deleteMany({
      user: user._id,
      lesson: lesson._id,
    });
  }

  static async getDummyProgress(app: FastifyInstance) {
    // !important: you should call createDummyLesson & createDummyUser at beforeEach
    const { user } = await AuthTestUtils.getDummyUser(app, 'learner');
    const lesson = await LessonTestUtils.getDummyLesson();

    const progress = await ProgressModel.findOne({
      user: user._id,
      lesson: lesson._id,
    });

    if (!progress) {
      throw new Error('Dummy progress not found');
    }

    return progress;
  }
}
