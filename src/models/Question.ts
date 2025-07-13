import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  fromUser?: mongoose.Types.ObjectId; // Optional for anonymous questions
  toUser: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  isAnonymous: boolean;
  status: 'pending' | 'answered' | 'ignored';
  createdAt: Date;
  answeredAt?: Date;
}

const questionSchema = new Schema<IQuestion>({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for anonymous questions
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  answer: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'answered', 'ignored'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answeredAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
questionSchema.index({ toUser: 1, status: 1 });
questionSchema.index({ fromUser: 1 });
questionSchema.index({ createdAt: -1 });

export default mongoose.model<IQuestion>('Question', questionSchema); 