
import React, { useMemo } from 'react';
import { EmergencyCall, CallStatus, User, UserRole } from '../types';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ReportIcon } from './icons/ReportIcon';
import { UsersIcon } from './icons/UsersIcon';

interface SupervisorDashboardProps {
  calls: EmergencyCall[];
  users: User[];
}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ calls, users }) => {

  const stats = useMemo(() => {
    const totalCalls = calls.length;
    const pendingCalls = calls.filter(c => c.status === CallStatus.PENDING).length;
    const completedCalls = calls.filter(c => c.status === CallStatus.COMPLETED).length;
    const averagePriority = totalCalls > 0 ? (calls.reduce((acc, call) => acc + call.priority, 0) / totalCalls) : 0;
    const totalDispatchers = users.filter(u => u.role === UserRole.DISPATCHER).length;
    const totalEMTs = users.filter(u => u.role === UserRole.EMT).length;

    return {
      totalCalls,
      pendingCalls,
      completedCalls,
      averagePriority: averagePriority.toFixed(1),
      totalDispatchers,
      totalEMTs,
    };
  }, [calls, users]);

  const recentCalls = useMemo(() => {
    return [...calls].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);
  }, [calls]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Supervisor Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Operational Overview & Analytics</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full"><ChartBarIcon className="h-6 w-6 text-blue-500"/></div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Calls</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCalls}</p>
            </div>
        </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full"><ReportIcon className="h-6 w-6 text-yellow-500"/></div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending / Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingCalls} / {stats.completedCalls}</p>
            </div>
        </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full"><UsersIcon className="h-6 w-6 text-green-500"/></div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dispatchers / EMTs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalDispatchers} / {stats.totalEMTs}</p>
            </div>
        </div>
      </div>

      {/* Recent Calls Table */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">Recent Emergency Calls</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentCalls.map((call) => (
                <tr key={call.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{call.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{call.priority}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${call.status === CallStatus.COMPLETED ? 'green' : 'yellow'}-100 text-${call.status === CallStatus.COMPLETED ? 'green' : 'yellow'}-800 dark:bg-opacity-20`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{call.timestamp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
