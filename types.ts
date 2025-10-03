
export enum UserRole {
  DISPATCHER = 'Dispatcher',
  EMT = 'EMT',
  SUPERVISOR = 'Supervisor',
}

export interface User {
  id: number;
  username: string;
  password?: string;
  role: UserRole;
}

export type Priority = 1 | 2 | 3 | 4;

export enum CallStatus {
    PENDING = 'Pending',
    DISPATCHED = 'Dispatched',
    ON_SCENE = 'On Scene',
    TRANSPORTING = 'Transporting',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

export interface EmergencyCall {
  id: number;
  timestamp: Date;
  callerName: string;
  phone: string;
  location: string;
  landmark?: string;
  description: string;
  priority: Priority;
  status: CallStatus;
  pcrId?: number;
  assignedTo?: number; // EMT user ID
}

export interface PatientCareRecord {
  id: number;
  callId: number;
  patientVitals: string;
  treatmentsAdministered: string;
  medications: string;
  transferDestination: string;
  notes: string;
}
