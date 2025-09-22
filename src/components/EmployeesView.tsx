import React, { useState } from 'react';
import { Users, Search, Calendar, Building2, Eye, Clock } from 'lucide-react';
import { mockUsers, mockAttendance } from '../data/mockData';
import { AttendanceRecord } from '../types/material';

interface EmployeesViewProps {
  canModify: boolean;
}

export default function EmployeesView({ canModify }: EmployeesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const employees = mockUsers.filter(user => user.role === 'employee');
  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeeAttendance = (employeeId: string) => {
    return mockAttendance.filter(record => record.employeeId === employeeId);
  };

  const getEmployeeStats = (employeeId: string) => {
    const attendance = getEmployeeAttendance(employeeId);
    const totalHours = attendance.reduce((sum, record) => sum + (record.totalHours || 0), 0);
    const presentDays = attendance.filter(record => record.status === 'present').length;
    
    return { totalHours, presentDays, totalRecords: attendance.length };
  };

  if (selectedEmployeeId) {
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    const attendance = getEmployeeAttendance(selectedEmployeeId);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedEmployeeId(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                ← Back
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{employee?.fullName}</h1>
                <p className="text-gray-600 dark:text-gray-400">Attendance Records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Attendance History</h2>
          
          {attendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Site</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Start Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">End Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Hours</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map(record => (
                    <tr key={record.id} className="border-b border-gray-100 dark:border-slate-700/50">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {record.date.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {record.constructionSiteName}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {record.startTime?.toLocaleTimeString() || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {record.endTime?.toLocaleTimeString() || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {record.totalHours ? `${record.totalHours}h` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : record.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {record.status === 'present' && 'Present'}
                          {record.status === 'in-progress' && 'In Progress'}
                          {record.status === 'absent' && 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No attendance records found</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage employee information and attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(employee => {
          const stats = getEmployeeStats(employee.id);
          return (
            <div
              key={employee.id}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  Employee
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {employee.fullName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">@{employee.username}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalHours.toFixed(1)}h</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.presentDays}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Present Days</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployeeId(employee.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl transition-all duration-200 text-sm font-semibold"
              >
                <Eye className="w-4 h-4" />
                View Attendance
              </button>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No employees found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'No employees in the system'}
          </p>
        </div>
      )}
    </div>
  );
}