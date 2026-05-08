import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RoutineSlot from '@/models/RoutineSlot';

// 🚨 VERCEL FIX: Explicitly import models so Mongoose knows what to populate!
import '@/models/Professor';
import '@/models/Subject';

// GET: Fetch the entire routine (or filter by query params)
export async function GET(req: Request) {
  await connectDB();

  // Optional: You can get query params like ?batch=CSE4S
  const { searchParams } = new URL(req.url);
  const batchFilter = searchParams.get('batch');
  const query = batchFilter ? { batch: batchFilter } : {};

  try {
    const slots = await RoutineSlot.find(query)
      .populate('professor', 'name email branch') // Fill in Prof details
      .populate('subject', 'name courseId')       // Fill in Subject details
      .lean(); // Convert to plain JS object for better performance

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Routine Fetch Error:", error); // Added to help debug in Vercel logs if it fails again
    return NextResponse.json({ message: 'Failed to load routine' }, { status: 500 });
  }
}

// POST: Save a new slot (Upsert logic)
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();

    // "Upsert": If a slot exists at this Day/Period/Batch, overwrite it.
    // Otherwise, create a new one.
    const filter = {
      day: body.day,
      period: body.period,
      batch: body.batch
    };

    const update = { ...body };

    const result = await RoutineSlot.findOneAndUpdate(filter, update, {
      new: true,   // Return the updated document
      upsert: true, // Create if doesn't exist
      runValidators: true
    });

    return NextResponse.json(result);
  } catch (error: any) {
    // Check for Duplicate Key Error (MongoDB Code 11000)
    // This happens if our Conflict Check failed and we tried to save a conflict anyway
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Conflict detected! Slot cannot be saved.' }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}