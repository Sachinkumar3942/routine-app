import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Professor from '@/models/Professor';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const resolvedParams = await params; // resolve Promise to get params
    
    await Professor.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ message: 'Professor deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}