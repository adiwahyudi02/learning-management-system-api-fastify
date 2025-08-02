import { FastifyInstance } from 'fastify';
import { EnrollmentModel } from '../../src/modules/enrollments/enrollment.model';
import { AuthTestUtils } from './auth-utils';
import { CourseTestUtils } from './course-utils';

export class EnrollmentTestUtils {
  static async createDummyEnrollment(app: FastifyInstance) {
    // !important: you should call createDummyCourse & createDummyUser('learner') at beforeEach
    const course = await CourseTestUtils.getDummyCourse();
    const { user } = await AuthTestUtils.getDummyUser(app, 'learner');

    return await EnrollmentModel.create({
      course: course._id,
      user: user._id,
    });
  }

  static async deleteDummyEnrollment(app: FastifyInstance) {
    // !important: you should call createDummyCourse & createDummyUser('learner') at beforeEach
    const { user } = await AuthTestUtils.getDummyUser(app, 'learner');
    const course = await CourseTestUtils.getDummyCourse();

    await EnrollmentModel.deleteMany({
      user: user._id,
      course: course._id,
    });
  }
}
