import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Professor from '@/models/Professor';

// GET: Fetch all professors (for Dropdowns)
export async function GET() {
  await connectDB();
  try {
    const professors = await Professor.find({}).sort({ name: 1 });
    return NextResponse.json(professors);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch professors' }, { status: 500 });
  }
}

// POST: Register a new professor
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    
    // Check if email already exists
    const existing = await Professor.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    const newProf = await Professor.create(body);
    return NextResponse.json(newProf, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const resolvedParams = await params; 
    
    await Professor.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ message: 'Professor deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}