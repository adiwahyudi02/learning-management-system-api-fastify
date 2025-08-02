import { Schema, model, Document, Types } from 'mongoose';

export interface LessonDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  course: Types.ObjectId;
  order: number;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<LessonDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, default: 0 },
    videoUrl: { type: String },
  },
  { timestamps: true },
);

export const LessonModel = model<LessonDocument>('Lesson', lessonSchema);
