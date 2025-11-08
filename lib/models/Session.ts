import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISession extends Document {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  title: string;
  start: Date;
  end: Date | null;
  durationMin: number;
  quality?: number;
  tags: string[];
  noteId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      default: null,
    },
    durationMin: {
      type: Number,
      default: 0,
    },
    quality: {
      type: Number,
      min: 1,
      max: 5,
    },
    tags: {
      type: [String],
      default: [],
    },
    noteId: {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient queries
SessionSchema.index({ userId: 1, start: 1 });
SessionSchema.index({ userId: 1, categoryId: 1, start: 1 });
SessionSchema.index({ userId: 1, end: 1 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
