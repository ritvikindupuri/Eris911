
import React, { useState, useMemo } from 'react';
import { EmergencyCall, CallStatus, User } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { NoResultsIcon } from './icons/NoResultsIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { FileTextIcon } from './icons/FileTextIcon';

interface EmtDashboardProps {
  user: User;
  calls: EmergencyCall[];
  onFilePCR: (call: EmergencyCall) => void;
  onUpdateCallStatus: (callId: number, status: CallStatus) => void;
}

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1: return 'bg-red-500';
    case 2: return 'bg-yellow-500';
    case 3: return 'bg-blue-500';
    case 4: return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getStatusColor = (status: CallStatus) => {
    switch (status) {
        case CallStatus.PENDING: return 'text-yellow-600 dark:text-yellow-400';
        case CallStatus.DISPATCHED: return 'text-blue-600 dark:text-blue-400';
        case CallStatus.ON_SCENE: return 'text-indigo-600 dark:text-indigo-400';
        case CallStatus.TRANSPORTING: return 'text-purple-600 dark:text-purple-400';
        case CallStatus.COMPLETED: return 'text-green-600 dark:text-green-400';
        case CallStatus.CANCELLED: return 'text-gray-500 dark:text-gray-400';
        default: return 'text-gray-700 dark:text-gray-200';
    }
}

const EmtDashboard: React.FC<EmtDashboardProps> = ({ user, calls, onFilePCR, onUpdateCallStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const assignedCalls = useMemo(() => {
    return calls
      .filter(call => call.assignedTo === user.id)
      .filter(call =>
        call.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [calls, searchTerm, user.id]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">EMT Dashboard</h1>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon />
            </span>
            <input
                type="text"
                placeholder="Search assigned calls..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            {assignedCalls.length > 0 ? (
                 <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                 {assignedCalls.map((call) => (
                     <li key={call.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                             <div className="flex-1">
                                 <div className="flex items-center gap-3">
                                     <span className={`flex-shrink-0 w-3 h-3 rounded-full ${getPriorityColor(call.priority)}`} title={`Priority ${call.priority}`}></span>
                                     <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{call.location}</p>
                                 </div>
                                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2"><MapPinIcon className="h-4 w-4" />{call.callerName} - {call.phone}</p>
                                 <p className="mt-2 text-gray-700 dark:text-gray-300">{call.description}</p>
                             </div>
                             <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
                                 <p className={`font-bold text-sm ${getStatusColor(call.status)}`}>{call.status}</p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">{call.timestamp.toLocaleString()}</p>
                                 <select 
                                     value={call.status}
                                     onChange={(e) => onUpdateCallStatus(call.id, e.target.value as CallStatus)}
                                     disabled={call.status === CallStatus.COMPLETED || call.status === CallStatus.CANCELLED}
                                     className="mt-2 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md py-1 disabled:opacity-50"
                                 >
                                     <option value={CallStatus.DISPATCHED}>Dispatched</option>
                                     <option value={CallStatus.ON_SCENE}>On Scene</option>
                                     <option value={CallStatus.TRANSPORTING}>Transporting</option>
                                     <option value={CallStatus.COMPLETED}>Completed</option>
                                 </select>
                                {call.status === CallStatus.COMPLETED && !call.pcrId && (
                                    <button onClick={() => onFilePCR(call)} className="mt-2 flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-lg transition">
                                        <FileTextIcon className="h-4 w-4" />
                                        File PCR
                                    </button>
                                )}
                                {call.pcrId && (
                                    <p className="mt-2 text-sm text-green-700 dark:text-green-400 font-semibold">PCR Filed</p>
                                )}
                             </div>
                         </div>
                     </li>
                 ))}
                 </ul>
            ) : (
                <div className="text-center py-16 px-6">
                    <NoResultsIcon />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No assigned calls</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                       You currently have no calls assigned to you.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EmtDashboard;
