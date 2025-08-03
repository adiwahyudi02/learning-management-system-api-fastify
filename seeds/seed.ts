import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.config';
import { UserModel } from '../src/modules/users/user.model';
import { CourseModel } from '../src/modules/courses/course.model';
import { LessonModel } from '../src/modules/lessons/lesson.model';
import { EnrollmentModel } from '../src/modules/enrollments/enrollment.model';
import { ProgressModel } from '../src/modules/progress/progress.model';
import { RefreshTokenModel } from '../src/modules/refreshTokens/refreshToken.model';
import { users, courses, lessons } from './seed-data';
import bcrypt from 'bcrypt';

dotenv.config();

async function main() {
  console.log('🔗 Connecting to database...');
  // Connect to DB
  await connectDB();

  const shouldReset = process.argv.includes('--reset');

  if (shouldReset) {
    console.log('⚠ Resetting existing data...');
    await Promise.all([
      UserModel.deleteMany({}),
      RefreshTokenModel.deleteMany({}),
      CourseModel.deleteMany({}),
      LessonModel.deleteMany({}),
      EnrollmentModel.deleteMany({}),
      ProgressModel.deleteMany({}),
    ]);
  }

  console.log('🌱 Seeding users...');

  // Hash password
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  const createdUsers = await UserModel.insertMany(users);

  console.log('🌱 Seeding courses...');
  await CourseModel.insertMany(courses);

  console.log('🌱 Seeding lessons...');
  const createdLessons = await LessonModel.insertMany(lessons);

  console.log('🌱 Seeding enrollments...');
  const learner = createdUsers.find((u) => u.role === 'learner')!;
  const anotherLearner = createdUsers.find(
    (u) => u.email === 'learner2@example.com',
  )!;

  await EnrollmentModel.insertMany([
    { user: learner._id, course: courses[0]._id },
    { user: anotherLearner._id, course: courses[1]._id },
  ]);

  console.log('🌱 Seeding progress...');
  await ProgressModel.create({
    user: learner._id,
    lesson: createdLessons.find((l) => l.title === 'Introduction to MongoDB')!
      ._id,
  });

  console.log('✅ Seed completed successfully!');

  const admin = users.find((u) => u.role === 'admin');
  const learners = users.filter((u) => u.role === 'learner');
  console.log('Login as:');
  console.log(`🧑‍💻 Admin: ${admin?.email} / password`);
  learners.forEach((l) => console.log(`👨‍🎓 Learner: ${l.email} / password`));
}

main()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    void mongoose.disconnect();
    process.exit(1);
  });
