import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  courseId: string;
  credits?: number; // Optional field
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Please provide the subject name.'],
      trim: true,
    },
    courseId: { 
      type: String, 
      required: [true, 'Please provide a Course ID (e.g., CS1401).'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    credits: {
      type: Number,
      default: 3,
    }
  },
  {
    timestamps: true,
  }
);

const Subject: Model<ISubject> = mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;