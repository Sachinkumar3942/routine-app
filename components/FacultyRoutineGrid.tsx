'use client';

import React from 'react';
import { RoutineSlot } from '@/types';
import { DAYS as CONST_DAYS, PERIODS as CONST_PERIODS } from '@/lib/constants';

interface FacultyRoutineGridProps {
  professorName: string;
  scheduleData: RoutineSlot[];
}

const DAYS = [1, 2, 3, 4, 5]; // Mon-Fri
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function FacultyRoutineGrid({ professorName, scheduleData }: FacultyRoutineGridProps) {
  const getSlot = (day: number, period: number) => {
    return scheduleData.find((s) => s.day === day && s.period === period);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 bg-blue-50 p-2 rounded inline-block">
        👨‍🏫 {professorName}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100 text-gray-600 w-24">Day</th>
              {PERIODS.map(p => <th key={p} className="border p-2 bg-gray-100 text-gray-600 text-xs">{CONST_PERIODS[p]}</th>)}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day}>
                <td className="border p-2 font-bold bg-gray-50 text-gray-700">{CONST_DAYS[day].substring(0, 3)}</td>
                {PERIODS.map(period => {
                  const slot = getSlot(day, period);
                  return (
                    <td key={period} className={`border p-2 min-w-30 ${slot ? 'bg-indigo-50 border-indigo-200' : 'bg-white'}`}>
                      {slot ? (
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-indigo-800">{slot.subject?.courseId}</span>
                          <span className="text-xs text-indigo-600 font-medium">{slot.batch}</span>
                          {slot.roomNumber && <span className="text-[10px] text-gray-500 mt-1">{slot.roomNumber}</span>}
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}