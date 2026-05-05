import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RoutineSlot from '@/models/RoutineSlot';

export async function POST(req: Request) {
  await connectDB();
  
  try {
    const body = await req.json();

    // MODE 1: SINGLE SLOT CHECK (Used by Modal before saving)
    if (body.type === 'SINGLE') {
      const { professor, day, period, batch } = body;
      
      const conflict = await RoutineSlot.findOne({
        professor,
        day,
        period,
        batch: { $ne: batch } // Exclude current batch
      }).populate('subject');

      if (conflict) {
        return NextResponse.json({
          hasConflict: true,
          message: `Prof is busy in ${conflict.batch} (${(conflict.subject as any)?.courseId ?? 'unknown'})`
        });
      }
      return NextResponse.json({ hasConflict: false });
    }

    // MODE 2: BULK SYSTEM CHECK (Used by Sidebar Button)
    // We use MongoDB Aggregation to find ANY prof teaching 2 classes at once
    const conflicts = await RoutineSlot.aggregate([
      {
        // 1. Group by Day + Period + Professor
        $group: {
          _id: { day: "$day", period: "$period", professor: "$professor" },
          count: { $sum: 1 },
          batches: { $push: "$batch" } // Collect the batch names
        }
      },
      {
        // 2. Keep only groups where count > 1 (Double Booking!)
        $match: {
          count: { $gt: 1 }
        }
      },
      {
        // 3. Lookup Professor details to get their Name (instead of ID)
        $lookup: {
          from: "professors",
          localField: "_id.professor",
          foreignField: "_id",
          as: "profDetails"
        }
      },
      {
        // 4. Clean up the output
        $project: {
          day: "$_id.day",
          period: "$_id.period",
          professorName: { $arrayElemAt: ["$profDetails.name", 0] },
          batches: 1
        }
      }
    ]);

    if (conflicts.length > 0) {
      // Create a summary message from the first conflict found
      const c = conflicts[0];
      return NextResponse.json({
        hasConflict: true,
        message: `CONFLICT: ${c.professorName} is double-booked on Day ${c.day}, Period ${c.period} in batches: ${c.batches.join(', ')}`
      });
    }

    return NextResponse.json({ 
      hasConflict: false, 
      message: "System Healthy. No conflicts found." 
    });

  } catch (error: any) {
    console.error("Conflict check failed:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}