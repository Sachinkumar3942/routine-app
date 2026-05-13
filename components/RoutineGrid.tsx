'use client';

import React from 'react';
import CellSlot from './CellSlot';
import { DAYS, PERIODS } from '@/lib/constants'; // Your constants file

// Define the shape of the data passed to this grid
interface RoutineGridProps {
  batchName: string; // e.g., "CSE 4S"
  scheduleData: any[]; // The raw array of slots from DB
  onSlotClick: (day: number, period: number, batch: string) => void;
}

const RoutineGrid: React.FC<RoutineGridProps> = ({ 
  batchName, 
  scheduleData, 
  onSlotClick 
}) => {
  // Helper to find data for a specific cell
  const getSlotData = (day: number, period: number) => {
    const slot = scheduleData.find(s => s.day === day && s.period === period);
    if (!slot) return null;
    
    return {
      subjectCode: slot.subject.name, // Assuming populated data
      profName: slot.professor.name,
      room: slot.roomNumber,
      isConflict: false // You would calculate this via logic or API response
    };
  };

  return (
    <div className="mb-8 border border-gray-400 shadow-sm bg-white">
      {/* Header: Batch Name */}
      <div className="bg-gray-200 p-2 font-bold border-b border-gray-400 flex justify-between">
        <span>{batchName}</span>
        <span className="text-xs text-gray-500 font-normal self-center">Weekly Routine</span>
      </div>

      <div className="flex">
        {/* Left Column: Day Headers (Mon, Tue, Wed...) */}
        <div className="flex flex-col border-r border-gray-400 bg-orange-100 w-12 shrink-0">
           {/* Empty top-left corner slot for alignment */}
           <div className="h-8 border-b border-gray-400 bg-gray-300"></div>
           {[1, 2, 3, 4, 5].map((day) => ( // Showing Mon-Fri
             <div key={day} className="h-16 flex items-center justify-center font-bold text-xs border-b border-gray-300">
               {DAYS[day].substring(0, 3)}
             </div>
           ))}
        </div>

        {/* Main Grid Area */}
        <div className="flex-1">
          {/* Top Row: Period Headers (Time Slots) */}
          <div className="grid grid-cols-8">
            {Object.keys(PERIODS).map((p) => (
              <div key={p} className="h-8 bg-yellow-100 border-r border-b border-gray-400 flex items-center justify-center text-[10px] leading-tight font-bold text-gray-700 text-center px-1">
                {PERIODS[Number(p)]}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          {[1, 2, 3, 4, 5].map((day) => (
            <div key={day} className="grid grid-cols-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
                <CellSlot
                  key={`${day}-${period}`}
                  day={day}
                  period={period}
                  data={getSlotData(day, period)}
                  onClick={() => onSlotClick(day, period, batchName)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutineGrid;