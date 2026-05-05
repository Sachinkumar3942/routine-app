import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoutineSlot extends Document {
  day: number;      // 1-7 (Monday-Sunday)
  period: number;   // 1-10 (Time slots)
  professor: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  batch: string;    // e.g., "CSE 4S"
  roomNumber: string;
  branch: string;   // e.g., "CSE" (For filtering by Branch Head)
  createdAt: Date;
  updatedAt: Date;
}

const RoutineSlotSchema: Schema = new Schema(
  {
    day: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 7 
    },
    period: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 10 
    },
    professor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Professor', 
      required: true 
    },
    subject: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Subject', 
      required: true 
    },
    batch: { 
      type: String, 
      required: true, 
      trim: true 
    },
    roomNumber: { 
      type: String, 
      required: true, 
      trim: true 
    },
    branch: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
  }
);

// --- THE INTEGRITY LOCKS ---

// 1. Professor Conflict: A Professor cannot teach two classes at the same time.
// This acts as your "Primary Key" for logic purposes.
RoutineSlotSchema.index({ professor: 1, day: 1, period: 1 }, { unique: true });

// 2. Room Conflict: Two classes cannot happen in the same room at the same time.
RoutineSlotSchema.index({ roomNumber: 1, day: 1, period: 1 }, { unique: true });

// 3. Batch Conflict: A single batch cannot have two classes at the same time.
RoutineSlotSchema.index({ batch: 1, day: 1, period: 1 }, { unique: true });

const RoutineSlot: Model<IRoutineSlot> = mongoose.models.RoutineSlot || mongoose.model<IRoutineSlot>('RoutineSlot', RoutineSlotSchema);

export default RoutineSlot;