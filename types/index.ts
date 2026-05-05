// 1. The Professor Type (Frontend shape)
export interface Professor {
  _id: string;
  name: string;
  email: string;
  branch: string;
}

// 2. The Subject Type (Frontend shape)
export interface Subject {
  _id: string;
  name: string;
  courseId: string;
  credits?: number;
}

// 3. The Routine Slot Type (The main connector)
export interface RoutineSlot {
  _id: string;
  day: number;      // 1-7 (Mon-Sun)
  period: number;   // 1-10 (8am-6pm)
  
  // These are "Populated" objects, meaning they contain the full details,
  // not just the ID string.
  professor: Professor; 
  subject: Subject;
  
  batch: string;    // "CSE 4S"
  roomNumber: string;
  branch: string;
  
  // Optional: Used for UI state (highlighting conflicts)
  hasConflict?: boolean;
}