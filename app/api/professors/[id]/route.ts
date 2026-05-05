import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Professor from '@/models/Professor';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const resolvedParams = await params; // <--- And make sure this line is here
    
    await Professor.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ message: 'Professor deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}