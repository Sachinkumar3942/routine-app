import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoom extends Document {
  roomNo: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema(
  {
    roomNo: { 
      type: String, 
      required: [true, 'Please provide the room number.'],
      unique: true,
      trim: true,
      uppercase: true,
    }
  },
  {
    timestamps: true,
  }
);

const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
