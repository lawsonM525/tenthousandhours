import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  tz: string;
  createdAt: Date;
  settings: {
    rounding: number;
    weekStart: number;
    aiEnabled: boolean;
    notificationsEnabled: boolean;
    timeFormat: string;
  };
}

const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tz: {
    type: String,
    required: true,
    default: 'UTC',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  settings: {
    rounding: {
      type: Number,
      default: 1,
      enum: [1, 5, 15],
    },
    weekStart: {
      type: Number,
      default: 1,
      enum: [0, 1], // 0 = Sunday, 1 = Monday
    },
    aiEnabled: {
      type: Boolean,
      default: true,
    },
    notificationsEnabled: {
      type: Boolean,
      default: false,
    },
    timeFormat: {
      type: String,
      default: '12h',
      enum: ['12h', '24h'],
    },
  },
});

// Create index on clerkId
UserSchema.index({ clerkId: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
