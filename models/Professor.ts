import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProfessor extends Document {
  name: string;
  email: string;
  branch: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfessorSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Please provide a name for the professor.'],
      trim: true,
    },
    email: { 
      type: String, 
      required: [true, 'Please provide an email address.'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    branch: { 
      type: String, 
      required: [true, 'Please specify the branch (e.g., CSE, ECE).'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Prevent recompilation of model in development (Hot Reload fix)
const Professor: Model<IProfessor> = mongoose.models.Professor || mongoose.model<IProfessor>('Professor', ProfessorSchema);

export default Professor;