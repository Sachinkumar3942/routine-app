import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Professor from '@/models/Professor';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    await Professor.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Professor deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}