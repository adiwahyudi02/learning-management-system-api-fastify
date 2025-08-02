import { CourseModel } from '../../src/modules/courses/course.model';

export class CourseTestUtils {
  static readonly DUMMY_COURSE = {
    title: 'test-course-123',
    description: 'test-description-123',
  };

  static readonly DUMMY_COURSE_UPDATE = {
    title: 'test-course-123-update',
    description: 'test-description-123-update',
  };

  static async createDummyCourse() {
    return await CourseModel.create(this.DUMMY_COURSE);
  }

  static async deleteDummyCourse() {
    await CourseModel.deleteMany({
      $or: [
        { title: this.DUMMY_COURSE.title },
        { title: this.DUMMY_COURSE_UPDATE.title },
      ],
    });
  }

  static async getDummyCourse() {
    const course = await CourseModel.findOne({
      title: this.DUMMY_COURSE.title,
    });

    if (!course) {
      throw new Error('Dummy course not found');
    }

    return course;
  }
}
