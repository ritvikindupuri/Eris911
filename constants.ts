
import { User, UserRole, EmergencyCall, CallStatus, PatientCareRecord } from './types';

export const USERS: User[] = [
  { id: 1, username: 'dispatcher1', password: 'password', role: UserRole.DISPATCHER },
  { id: 2, username: 'emt1', password: 'password', role: UserRole.EMT },
  { id: 3, username: 'supervisor1', password: 'password', role: UserRole.SUPERVISOR },
  { id: 4, username: 'emt2', password: 'password', role: UserRole.EMT },
];

export const EMERGENCY_CALLS: EmergencyCall[] = [
  {
    id: 1,
    timestamp: new Date('2024-07-29T10:00:00Z'),
    callerName: 'John Doe',
    phone: '555-0101',
    location: '123 Main St, Cityville',
    description: 'Chest pains, difficulty breathing.',
    priority: 1,
    status: CallStatus.DISPATCHED,
    assignedTo: 2,
  },
  {
    id: 2,
    timestamp: new Date('2024-07-29T10:05:00Z'),
    callerName: 'Jane Smith',
    phone: '555-0102',
    location: '456 Oak Ave, Townsville',
    landmark: 'Near the public library',
    description: 'Fall from a ladder, possible broken leg.',
    priority: 2,
    status: CallStatus.ON_SCENE,
    assignedTo: 4,
  },
  {
    id: 3,
    timestamp: new Date('2024-07-29T10:15:00Z'),
    callerName: 'Peter Jones',
    phone: '555-0103',
    location: '789 Pine Ln, Villagetown',
    description: 'Minor car accident, driver complaining of neck pain.',
    priority: 3,
    status: CallStatus.PENDING,
  },
   {
    id: 4,
    timestamp: new Date('2024-07-28T22:30:00Z'),
    callerName: 'Mary Williams',
    phone: '555-0104',
    location: '101 River Rd, Hamlet',
    description: 'Patient feels dizzy and weak.',
    priority: 3,
    status: CallStatus.COMPLETED,
    assignedTo: 2,
    pcrId: 1
  },
];

export const PCRs: PatientCareRecord[] = [
    {
        id: 1,
        callId: 4,
        patientVitals: 'BP: 130/85, HR: 90, SpO2: 97%',
        treatmentsAdministered: 'IV established, normal saline.',
        medications: 'None',
        transferDestination: 'City General Hospital',
        notes: 'Patient was stable on transport.'
    }
]
