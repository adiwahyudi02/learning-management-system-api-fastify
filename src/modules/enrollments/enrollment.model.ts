import { Schema, model, Document, Types } from 'mongoose';

export interface EnrollmentDocument extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId;
  enrolledAt: Date;
}

const enrollmentSchema = new Schema<EnrollmentDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
});

export const EnrollmentModel = model<EnrollmentDocument>(
  'Enrollment',
  enrollmentSchema,
);
