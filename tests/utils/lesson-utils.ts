import { LessonModel } from '../../src/modules/lessons/lesson.model';
import { CourseTestUtils } from './course-utils';

export class LessonTestUtils {
  static readonly DUMMY_LESSON = {
    title: 'test-lesson-123',
    content: 'test-lesson-123',
    order: 1,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  };

  static readonly DUMMY_LESSON_UPDATE = {
    title: 'test-lesson-123-update',
    content: 'test-lesson-123-update',
    order: 1,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  };

  static async createDummyLesson() {
    // !important: you should call createDummyCourse at beforeEach
    const course = await CourseTestUtils.getDummyCourse();
    return await LessonModel.create({
      ...this.DUMMY_LESSON,
      course: course._id,
    });
  }

  static async deleteDummyLesson() {
    await LessonModel.deleteMany({
      $or: [
        { title: this.DUMMY_LESSON.title, content: this.DUMMY_LESSON.content },
        {
          title: this.DUMMY_LESSON_UPDATE.title,
          content: this.DUMMY_LESSON_UPDATE.content,
        },
      ],
    });
  }

  static async getDummyLesson() {
    const lesson = await LessonModel.findOne({
      title: this.DUMMY_LESSON.title,
    });

    if (!lesson) {
      throw new Error('Dummy lesson not found');
    }

    return lesson;
  }
}
