import { Schema, model, Document, Types } from 'mongoose';

export interface ProgressDocument extends Document {
  user: Types.ObjectId;
  lesson: Types.ObjectId;
  completedAt: Date;
}

const progressSchema = new Schema<ProgressDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

export const ProgressModel = model<ProgressDocument>(
  'Progress',
  progressSchema,
);
