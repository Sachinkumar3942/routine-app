'use client';

import React, { useState } from 'react';
import { Professor, Subject, Room } from '@/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profId: string, subId: string, roomId: string) => void;
  day: number;
  period: number;
  batch: string;
  professors: Professor[];
  subjects: Subject[];
  rooms: Room[];
}

export default function BookingModal({
  isOpen,
  onClose,
  onSave,
  day,
  period,
  batch,
  professors,
  subjects,
  rooms
}: BookingModalProps) {
  const [selectedProf, setSelectedProf] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [room, setRoom] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProf && selectedSubject && room) {
      onSave(selectedProf, selectedSubject, room);
      // Reset form
      setSelectedProf('');
      setSelectedSubject('');
      setRoom('');
    } else {
      alert("Please select all fields!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Assign Class
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {batch} | Day {day} | Period {period}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              className="w-full border border-gray-300 rounded p-2 mt-1"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.courseId})
                </option>
              ))}
            </select>
          </div>

          {/* Professor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Professor</label>
            <select
              className="w-full border border-gray-300 rounded p-2 mt-1"
              value={selectedProf}
              onChange={(e) => setSelectedProf(e.target.value)}
              required
            >
              <option value="">-- Select Professor --</option>
              {professors.map((prof) => (
                <option key={prof._id} value={prof._id}>
                  {prof.name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Room No.</label>
            <select
              className="w-full border border-gray-300 rounded p-2 mt-1 bg-white"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            >
              <option value="">-- Select Room --</option>
              {rooms.map((r) => (
                <option key={r._id} value={r.roomNo}>
                  {r.roomNo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}