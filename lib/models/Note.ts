import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INote extends Document {
  userId: Types.ObjectId;
  sessionIds: Types.ObjectId[];
  body: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
  sentiment?: string;
  keywords?: string[];
}

const NoteSchema = new Schema<INote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Session',
      default: [],
    },
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
    },
    sentiment: {
      type: String,
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ body: 'text' }); // Full-text search index

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
