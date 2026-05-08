import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';

export async function GET() {
  await connectDB();
  try {
    const rooms = await Room.find({}).sort({ roomNo: 1 });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    
    const existing = await Room.findOne({ roomNo: body.roomNo });
    if (existing) {
      return NextResponse.json({ message: 'Room already registered' }, { status: 400 });
    }

    const newRoom = await Room.create(body);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}
