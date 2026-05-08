import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const resolvedParams = await params;
    
    await Room.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}
