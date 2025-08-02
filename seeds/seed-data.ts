import { Types } from 'mongoose';

export const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
  },
  {
    name: 'Learner 1',
    email: 'learner@example.com',
    password: 'password',
    role: 'learner',
  },
  {
    name: 'Learner 2',
    email: 'learner2@example.com',
    password: 'password',
    role: 'learner',
  },
];

export const courses = [
  {
    _id: new Types.ObjectId(),
    title: 'MongoDB Fundamentals',
    description: 'Learn the basics of MongoDB',
  },
  {
    _id: new Types.ObjectId(),
    title: 'Advanced Node.js',
    description: 'Deep dive into Node.js internals',
  },
];

export const lessons = [
  // Lessons for MongoDB Fundamentals
  {
    title: 'Introduction to MongoDB',
    content: 'Intro content...',
    course: courses[0]._id,
    order: 1,
    videoUrl: 'https://video.example.com/mongo1',
  },
  {
    title: 'CRUD Operations',
    content: 'CRUD content...',
    course: courses[0]._id,
    order: 2,
    videoUrl: 'https://video.example.com/mongo2',
  },
  {
    title: 'Indexes & Aggregations',
    content: 'Index content...',
    course: courses[0]._id,
    order: 3,
    videoUrl: 'https://video.example.com/mongo3',
  },
  {
    title: 'Schema Design',
    content: 'Schema content...',
    course: courses[0]._id,
    order: 4,
    videoUrl: 'https://video.example.com/mongo4',
  },
  {
    title: 'Performance Tuning',
    content: 'Performance content...',
    course: courses[0]._id,
    order: 5,
    videoUrl: 'https://video.example.com/mongo5',
  },

  // Lessons for Advanced Node.js
  {
    title: 'Event Loop Deep Dive',
    content: 'Event loop content...',
    course: courses[1]._id,
    order: 1,
    videoUrl: 'https://video.example.com/node1',
  },
  {
    title: 'Streams & Buffers',
    content: 'Streams content...',
    course: courses[1]._id,
    order: 2,
    videoUrl: 'https://video.example.com/node2',
  },
  {
    title: 'Cluster & Worker Threads',
    content: 'Cluster content...',
    course: courses[1]._id,
    order: 3,
    videoUrl: 'https://video.example.com/node3',
  },
  {
    title: 'Performance Optimization',
    content: 'Performance content...',
    course: courses[1]._id,
    order: 4,
    videoUrl: 'https://video.example.com/node4',
  },
];
