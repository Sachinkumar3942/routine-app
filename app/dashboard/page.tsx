"use client";

import React, { useState, useEffect, useRef } from "react";
import { toPng } from 'html-to-image';
import {jsPDF} from 'jspdf';
import { useSession } from "next-auth/react";
import RoutineGrid from "@/components/RoutineGrid";
import ActionSidebar from "@/components/ActionSidebar";
import BookingModal from "@/components/BookingModal";
import { RoutineSlot, Professor, Subject, Room } from "@/types";
import FacultyRoutineGrid from "@/components/FacultyRoutineGrid";

const BRANCHES_LIST = ["CSE", "ECE", "EE", "MECH", "PIE", "ECM", "META"];
const BASE_BATCHES: string[] = [];
for (const branch of BRANCHES_LIST) {
  for (let s = 1; s <= 8; s++) {
    BASE_BATCHES.push(`${branch} ${s}S`);
  }
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const match = userEmail.match(/^admin([a-z]+)@/i);
  const adminBranch = match ? match[1].toUpperCase() : "";

  const BATCHES = [...BASE_BATCHES].sort((a, b) => {
    if (!adminBranch) return 0;
    const aIsBranch = a.includes(adminBranch);
    const bIsBranch = b.includes(adminBranch);
    if (aIsBranch && !bIsBranch) return -1;
    if (!aIsBranch && bIsBranch) return 1;
    return 0;
  });

  // --- STATE MANAGEMENT ---
  const [scheduleData, setScheduleData] = useState<RoutineSlot[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]); // <--- Stores list for dropdown
  const [subjects, setSubjects] = useState<Subject[]>([]); // <--- Stores list for dropdown
  const [rooms, setRooms] = useState<Room[]>([]); // <--- Stores list for dropdown
  const printRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState("Ready.");
  const [viewMode, setViewMode] = useState<"CLASS" | "FACULTY">("CLASS");
  const [loading, setLoading] = useState(false);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: number;
    period: number;
    batch: string;
  } | null>(null);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      setStatusMessage("Loading data...");
      try {
        // Fetch everything in parallel
        const [routineRes, profRes, subRes, roomRes] = await Promise.all([
          fetch("/api/routine"),
          fetch("/api/professors"),
          fetch("/api/subjects"),
          fetch("/api/rooms"),
        ]);

        const routineData = await routineRes.json();
        const profData = await profRes.json();
        const subData = await subRes.json();
        const roomData = await roomRes.json();

        setScheduleData(routineData);
        setProfessors(profData);
        setSubjects(subData);
        setRooms(roomData);
        setStatusMessage("System Ready.");
      } catch (error) {
        console.error(error);
        setStatusMessage("Error loading initial data.");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const fetchRoutine = async () => {
    try {
      const res = await fetch("/api/routine");
      const data = await res.json();
      setScheduleData(data);
    } catch (error) {
      console.error("Failed to refresh routine", error);
    }
  };

  // --- ACTIONS (Sidebar & Grid Logic) ---

  const handleSlotClick = (day: number, period: number, batch: string) => {
    if (!session) {
      alert("Please login to assign or modify classes.");
      return;
    }
    
    // For admin, check if branch matches
    if (adminBranch && !batch.includes(adminBranch)) {
      alert(`Permission Denied: You can only assign classes for ${adminBranch}.`);
      return;
    }

    // 1. Set which cell we are editing
    setSelectedSlot({ day, period, batch });
    // 2. Open the popup
    setIsModalOpen(true);
    setStatusMessage(`Editing: ${batch} [Day ${day} : Period ${period}]`);
  };

  const handleModalSave = async (
    profId: string,
    subId: string,
    roomId: string,
  ) => {
    if (!selectedSlot) return;

    setStatusMessage("Saving slot...");

    try {
      // 1. Send data to backend
      const res = await fetch("/api/routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: selectedSlot.day,
          period: selectedSlot.period,
          batch: selectedSlot.batch,
          professor: profId,
          subject: subId,
          roomNumber: roomId,
          branch: selectedSlot.batch.split(" ")[0], // Extract branch dynamically
        }),
      });

      // 2. Handle Response
      if (res.ok) {
        setStatusMessage("Saved successfully!");
        setIsModalOpen(false); // Close modal
        fetchRoutine(); // Refresh grid to show new data
      } else {
        const err = await res.json();
        setStatusMessage(`ERROR: ${err.message}`);
        alert(`Failed to save: ${err.message}`);
      }
    } catch (error) {
      setStatusMessage("Network error saving slot.");
    }
  };

  const handleCheckConflict = async () => {
    setStatusMessage("Scanning database for conflicts...");

    try {
      // We don't need to send data anymore; the server will scan the DB itself.
      const res = await fetch("/api/conflict-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "BULK" }), // <--- Send "BULK" flag
      });

      const result = await res.json();

      if (result.hasConflict) {
        // Show the specific conflict message from the server
        setStatusMessage(result.message);
        alert(result.message); // Also pop up an alert so the user definitely sees it
      } else {
        setStatusMessage(
          "✅ Success: No conflicts found in the entire routine.",
        );
      }
    } catch (e) {
      console.error(e);
      setStatusMessage("Error: Could not perform conflict check.");
    }
  };

  const handleSave = async () => {
    // Logic remains same as before...
    setStatusMessage("Routine saved (Manual Trigger).");
  };

  const handleExportPDF = async () => {
    
    setStatusMessage("Generating PDF... please wait.");
    
    const element = printRef.current;
    
    if (!element) {
      setStatusMessage("❌ Error: Could not find the grid to export.");
      return;
    }

    

    try {
      // Use html-to-image instead of html2canvas
      const dataUrl = await toPng(element, { 
        quality: 1.0,
        backgroundColor: '#ffffff', // Forces a white background 
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate height to maintain aspect ratio
      const pdfHeight = (element.clientHeight * pdfWidth) / element.clientWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Semester_Routine.pdf');
      setStatusMessage("✅ PDF Export Complete! Check your downloads.");
    } catch (error) {
      setStatusMessage("❌ Error generating PDF. Check console.");
    }
  };
  const handleUndo = () => {
    setStatusMessage("Undo performed (Not implemented yet).");
  };

  // --- RENDER ---
  return (
    <div className="flex w-full h-full relative">
      {/* LEFT: Scrollable Grid Area */}
      <div className="flex-1 overflow-auto p-4 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
            <span className="text-blue-600 font-bold">Loading...</span>
          </div>
        )}

        <div ref={printRef} className="space-y-8 pb-20">
          {viewMode === "CLASS"
            ? BATCHES.map((batch) => (
                <RoutineGrid
                  key={batch}
                  batchName={batch}
                  scheduleData={scheduleData.filter((s) => s.batch === batch)}
                  onSlotClick={handleSlotClick}
                />
              ))
            : professors.map((prof) => {
                // Find all classes this specific professor is teaching
                const profSchedule = scheduleData.filter(
                  (s) => s.professor?._id === prof._id,
                );

                // If they have no classes, don't show an empty grid
                if (profSchedule.length === 0) return null;

                return (
                  <FacultyRoutineGrid
                    key={prof._id}
                    professorName={prof.name}
                    scheduleData={profSchedule}
                  />
                );
              })}
        </div>
      </div>

      {/* RIGHT: Fixed Sidebar */}
      <ActionSidebar
        onCheckConflict={handleCheckConflict}
        onSave={handleSave}
        onUndo={handleUndo}
        onExportPDF={handleExportPDF}
        onViewChange={setViewMode}
        currentView={viewMode} // <--- ADD THIS LINE
        statusMessage={statusMessage}
      />

      {/* --- THE MODAL (The new part) --- */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        day={selectedSlot?.day || 1}
        period={selectedSlot?.period || 1}
        batch={selectedSlot?.batch || ""}
        professors={professors} // Passing fetched data
        subjects={subjects} // Passing fetched data
        rooms={rooms} // Passing fetched data
      />
    </div>
  );
}
