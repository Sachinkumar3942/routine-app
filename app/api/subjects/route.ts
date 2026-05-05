import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Subject from '@/models/Subject';

// GET: Fetch all subjects
export async function GET() {
  await connectDB();
  try {
    const subjects = await Subject.find({}).sort({ name: 1 });
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch subjects' }, { status: 500 });
  }
}

// POST: Add a new subject
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    
    // Check for duplicate Course ID
    const existing = await Subject.findOne({ courseId: body.courseId });
    if (existing) {
      return NextResponse.json({ message: 'Course ID already exists' }, { status: 400 });
    }

    const newSubject = await Subject.create(body);
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}