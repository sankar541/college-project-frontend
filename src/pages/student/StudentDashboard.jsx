import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/student.service';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="card flex items-center space-x-4">
    <div className={`p-4 rounded-full ${colorClass}`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
    </div>
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    semester: 0,
    totalSubjects: 0,
    averageMarks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await studentService.getStudentDashboardStats(user?.registrationNumber);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchStats();
  }, [user]);

  return (
   <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Welcome, {user?.name}!</h1>
        <p className="mt-1 text-sm text-gray-400">
          Reg No: {user?.registrationNumber || 'N/A'} {stats.branch ? `| Branch: ${stats.branch}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Current Semester" value={stats.semester} icon={GraduationCap} colorClass="bg-blue-500" />
        <StatCard title="Total Subjects" value={stats.totalSubjects} icon={BookOpen} colorClass="bg-indigo-500" />
        <StatCard title="Average Score" value={`${stats.averageMarks}%`} icon={TrendingUp} colorClass="bg-green-500" />
      </div>

      <div className="card mt-8 bg-gray-800 border-gray-700">
        <h2 className="text-lg font-bold text-gray-100 mb-2">Check Your Results</h2>
        <p className="text-gray-400 mb-4">
          Your latest semester results have been published by the academic department.
        </p>
        <a
          href="/student/results"
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          View My Results
        </a>
      </div>
    </div>
  );
};

export default StudentDashboard;
