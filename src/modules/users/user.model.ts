import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'learner';
  createdAt: Date;
  updatedAt: Date;
  refreshTokens: mongoose.Types.ObjectId[];

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'learner'], default: 'learner' },
    refreshTokens: [{ type: Schema.Types.ObjectId, ref: 'RefreshToken' }],
  },
  { timestamps: true },
);

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Add instance method to compare password
 */
userSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password as string);
};

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
