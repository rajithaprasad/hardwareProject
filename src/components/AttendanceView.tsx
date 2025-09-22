import React, { useState } from 'react';
import { Clock, Play, Square, Calendar, Building2, User } from 'lucide-react';
import { AttendanceRecord, ConstructionSite } from '../types/material';
import { mockAttendance, mockConstructionSites } from '../data/mockData';

interface AttendanceViewProps {
  userRole: string;
  userId: string;
  userName: string;
}

export default function AttendanceView({ userRole, userId, userName }: AttendanceViewProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [currentSession, setCurrentSession] = useState<AttendanceRecord | null>(
    attendance.find(record => record.employeeId === userId && record.status === 'in-progress') || null
  );

  const isEmployee = userRole === 'employee';
  const userAttendance = attendance.filter(record => 
    isEmployee ? record.employeeId === userId : true
  );

  const handleStartWork = () => {
    if (!selectedSiteId) return;

    const site = mockConstructionSites.find(s => s.id === selectedSiteId);
    const newRecord: AttendanceRecord = {
      id: `a${Date.now()}`,
      employeeId: userId,
      employeeName: userName,
      constructionSiteId: selectedSiteId,
      constructionSiteName: site?.name || '',
      date: new Date(),
      startTime: new Date(),
      status: 'in-progress'
    };

    setAttendance(prev => [newRecord, ...prev]);
    setCurrentSession(newRecord);
  };

  const handleEndWork = () => {
    if (!currentSession) return;

    const endTime = new Date();
    const totalHours = (endTime.getTime() - currentSession.startTime!.getTime()) / (1000 * 60 * 60);

    const updatedRecord: AttendanceRecord = {
      ...currentSession,
      endTime,
      status: 'present',
      totalHours: Math.round(totalHours * 100) / 100
    };

    setAttendance(prev => prev.map(record => 
      record.id === currentSession.id ? updatedRecord : record
    ));
    setCurrentSession(null);
  };

  const getTodayHours = () => {
    const today = new Date().toDateString();
    const todayRecords = userAttendance.filter(record => 
      record.date.toDateString() === today && record.totalHours
    );
    return todayRecords.reduce((total, record) => total + (record.totalHours || 0), 0);
  };

  const getWeekHours = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekRecords = userAttendance.filter(record => 
      record.date >= weekStart && record.totalHours
    );
    return weekRecords.reduce((total, record) => total + (record.totalHours || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isEmployee ? 'Track your work hours' : 'Employee attendance records'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Clock In/Out */}
      {isEmployee && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Clock In/Out</h2>
          
          {!currentSession ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Construction Site *
                </label>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="">Choose construction site...</option>
                  {mockConstructionSites.filter(site => site.isActive).map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleStartWork}
                disabled={!selectedSiteId}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                <Play className="w-5 h-5" />
                Start Work
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-800 dark:text-green-400">Currently Working</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Started at {currentSession.startTime?.toLocaleTimeString()} at {currentSession.constructionSiteName}
                </p>
              </div>
              <button
                onClick={handleEndWork}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Square className="w-5 h-5" />
                End Work
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hours Summary */}
      {isEmployee && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getTodayHours().toFixed(1)}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getWeekHours().toFixed(1)}h</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {isEmployee ? 'Your Attendance History' : 'All Employee Attendance'}
        </h2>
        
        {userAttendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                  {!isEmployee && <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Employee</th>}
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Site</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Start Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">End Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Hours</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {userAttendance.map(record => (
                  <tr key={record.id} className="border-b border-gray-100 dark:border-slate-700/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {record.date.toLocaleDateString()}
                    </td>
                    {!isEmployee && (
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {record.employeeName}
                      </td>
                    )}
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