import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  userId: Types.ObjectId;
  name: string;
  color: string;
  type: 'skill' | 'life' | 'admin' | 'social' | 'other';
  countsTowardMastery: boolean;
  targetWeeklyHours: number;
  parentId?: Types.ObjectId;
  archived: boolean;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    enum: ['#F11D75', '#16C7A8', '#3A8DFF', '#8B5CF6', '#45E06F', '#FFB020', '#FF5C5C', '#22D3EE'],
  },
  type: {
    type: String,
    required: true,
    enum: ['skill', 'life', 'admin', 'social', 'other'],
    default: 'other',
  },
  countsTowardMastery: {
    type: Boolean,
    default: false,
  },
  targetWeeklyHours: {
    type: Number,
    default: 0,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  archived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
CategorySchema.index({ userId: 1, name: 1 });
CategorySchema.index({ userId: 1, archived: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
