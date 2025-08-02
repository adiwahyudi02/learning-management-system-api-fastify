import { model, Schema, Document } from 'mongoose';

export interface CourseDocument extends Document {
  title: string;
  description: string;
  lessons: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<CourseDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  },
  { timestamps: true },
);

export const CourseModel = model<CourseDocument>('Course', courseSchema);
