import React, { useEffect, useState } from 'react';
import { teacherService } from '../../services/teacher.service';
import { BookOpen, Users, ClipboardList, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ResultAnalysisView from '../../components/ResultAnalysisView';

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

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedSubjects: 0,
    totalStudents: 0,
    pendingMarksEntry: 0,
  });

  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, tableData] = await Promise.all([
          teacherService.getTeacherDashboardStats(),
          teacherService.getTeacherResultAnalysis()
        ]);
        if (statsData) setStats(statsData);
        if (tableData) setAnalysisData(tableData);
      } catch (err) {
        console.error("Teacher dashboard failed to mount gracefully.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Welcome, Professor {user?.name}!</h1>
        <p className="mt-1 text-sm text-gray-400">Here's your teaching overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Assigned Subjects" value={stats.assignedSubjects} icon={BookOpen} colorClass="bg-blue-500" />
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} colorClass="bg-indigo-500" />
        <StatCard title="Pending Marks Entry" value={stats.pendingMarksEntry} icon={ClipboardList} colorClass="bg-red-500" />
      </div>

      <div className="mt-8 pt-4">
         <h2 className="text-xl font-bold text-gray-200 mb-6">Your Personal Result Analysis</h2>
         {loading ? (
             <div className="flex justify-center p-12">
               <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
             </div>
         ) : analysisData.length > 0 ? (
            <ResultAnalysisView data={analysisData} />
         ) : (
            <div className="p-12 border border-gray-700 rounded-lg text-center bg-gray-800 text-gray-400">
               No subjects or grades found to generate an analysis.
            </div>
         )}
      </div>

    </div>
  );
};

export default TeacherDashboard;
