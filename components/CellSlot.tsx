'use client';

import React from 'react';
import { clsx } from 'clsx'; 

interface CellData {
  subjectCode: string; // e.g., "CS1401" or "DBMS"
  profName?: string;   // e.g., "Dr. Dinesh"
  room?: string;       // e.g., "LH-1"
  isConflict?: boolean; // Highlight red if true
}

interface CellSlotProps {
  data?: CellData | null;
  onClick?: () => void;
  day: number;
  period: number;
}

const CellSlot: React.FC<CellSlotProps> = ({ data, onClick, day, period }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "h-16 w-full border-r border-b border-gray-300 p-1 text-xs flex flex-col justify-center items-center cursor-pointer transition-colors hover:bg-blue-50",
        // Conditional Styling based on data state
        !data && "bg-white",
        data && !data.isConflict && "bg-green-100", // Scheduled
        data?.isConflict && "bg-red-200 border-red-500 border-2" // Conflict!
      )}
    >
      {data ? (
        <>
          <span className="font-bold text-gray-800">{data.subjectCode}</span>
          <span className="text-[10px] text-gray-600 truncate max-w-full">
            {data.profName}
          </span>
          {data.room && (
            <span className="text-[9px] text-gray-500">Room: {data.room}</span>
          )}
        </>
      ) : (
        <span className="text-gray-300 select-none">+</span>
      )}
    </div>
  );
};

export default CellSlot;