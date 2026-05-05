"use client";

import React from "react";
import { clsx } from "clsx";

interface ActionSidebarProps {
  onCheckConflict: () => void;
  onViewChange: (view: "CLASS" | "FACULTY") => void;
  onSave: () => void;
  onUndo: () => void;
  onExportPDF: () => void;
  currentView: "CLASS" | "FACULTY"; // This prop controls which button is blue
  statusMessage?: string;
}

const ActionSidebar: React.FC<ActionSidebarProps> = ({
  onCheckConflict,
  onViewChange,
  onSave,
  onUndo,
  onExportPDF,
  currentView,
  statusMessage = "Ready.",
}) => {
  return (
    <div className="w-64 bg-gray-50 border-l border-gray-300 h-screen sticky top-0 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-3 bg-gray-200 border-b border-gray-300 font-bold text-sm flex justify-between items-center">
        <span>Perform Actions</span>
      </div>

      {/* Status Console */}
      <div className="p-4 grow-0">
        <label className="text-xs text-gray-500 font-bold mb-1 block">
          Status / Logs:
        </label>
        <textarea
          readOnly
          value={statusMessage}
          className="w-full h-48 p-2 border border-gray-400 rounded bg-white text-xs font-mono resize-none focus:outline-none shadow-inner text-gray-700"
        />
      </div>

      {/* Action Buttons Area */}
      <div className="p-4 space-y-3 flex flex-col">
        {/* Row 1: Check Conflict & Class Routine */}
        <div className="flex gap-2">
          <button
            onClick={onCheckConflict}
            className="flex-1 bg-gray-200 border border-gray-400 px-2 py-2 text-xs font-medium hover:bg-gray-300 active:bg-gray-400 rounded shadow-sm transition-all"
          >
            Check Conflict
          </button>

          <button
            onClick={() => onViewChange("CLASS")}
            className={clsx(
              "flex-1 px-2 py-2 text-xs font-medium border rounded shadow-sm transition-all",
              currentView === "CLASS"
                ? "bg-blue-600 text-white border-blue-800 shadow-inner" // Active Blue
                : "bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300", // Inactive Gray
            )}
          >
            For Class Routine
          </button>
        </div>

        {/* Row 2: Undo & Faculty Routine */}
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            className="w-1/3 bg-gray-200 border border-gray-400 px-2 py-2 text-xs font-medium hover:bg-gray-300 active:bg-gray-400 rounded shadow-sm transition-all"
          >
            Undo
          </button>

          {/* --- THIS IS THE UPDATED FACULTY BUTTON --- */}
          <button
            onClick={() => onViewChange("FACULTY")}
            className={clsx(
              "flex-1 px-2 py-2 text-xs font-medium border rounded shadow-sm transition-all",
              currentView === "FACULTY"
                ? "bg-blue-600 text-white border-blue-800 shadow-inner" // Active Blue
                : "bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300", // Inactive Gray
            )}
          >
            For Faculty Routine
          </button>
        </div>

        <div className="flex gap-2">
          {/* --- NEW EXPORT BUTTON --- */}
          <button
            onClick={onExportPDF}
            className="flex-1 bg-amber-100 text-amber-900 border border-amber-400 px-2 py-2 text-xs font-bold hover:bg-amber-200 active:bg-amber-300 rounded shadow-sm transition-all"
          >
            Export to PDF
          </button>

          <button
            onClick={onSave}
            className="flex-1 bg-green-600 text-white border border-green-800 px-2 py-2 text-xs font-medium hover:bg-green-700 active:bg-green-800 rounded shadow-sm transition-all"
          >
            Save Routine
          </button>
        </div>
        {/* Row 3: Misc Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gray-200 border border-gray-400 px-2 py-2 text-xs font-medium hover:bg-gray-300 active:bg-gray-400 rounded shadow-sm transition-all opacity-50 cursor-not-allowed">
            For Faculty Subjects
          </button>

          <button
            onClick={onSave}
            className="flex-1 bg-green-600 text-white border border-green-800 px-2 py-2 text-xs font-medium hover:bg-green-700 active:bg-green-800 rounded shadow-sm transition-all"
          >
            Save Routine
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionSidebar;
