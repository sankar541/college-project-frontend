import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { Users, BookOpen, GraduationCap, Building2, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    totalBranches: 4
  });

  // Table Data States
  const [analysisData, setAnalysisData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        if (data) setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const handleGenerateAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
       const freshData = await adminService.getBranchResultAnalysis(selectedBranch, selectedSemester);
       setAnalysisData(freshData);
    } catch (err) {
       console.error("Analysis pull failed.");
       setAnalysisData([]);
    } finally {
       setLoadingAnalysis(false);
    }
  };

  return (
   <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Welcome back, {user?.name}!</h1>
        <p className="mt-1 text-sm text-gray-400">Here's an overview of the portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents} icon={GraduationCap} colorClass="bg-blue-500" />
        <StatCard title="Total Teachers" value={stats.totalTeachers} icon={Users} colorClass="bg-indigo-500" />
        <StatCard title="Total Subjects" value={stats.totalSubjects} icon={BookOpen} colorClass="bg-green-500" />
        <StatCard title="Total Branches" value={stats.totalBranches} icon={Building2} colorClass="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/admin/add-student')}
              className="p-4 border border-gray-700 rounded-lg hover:border-primary-500 hover:text-primary-400 transition-colors flex flex-col items-center justify-center space-y-2 text-gray-300"
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-sm font-medium">Add Student</span>
            </button>
            <button 
              onClick={() => navigate('/admin/add-teacher')}
              className="p-4 border border-gray-700 rounded-lg hover:border-primary-500 hover:text-primary-400 transition-colors flex flex-col items-center justify-center space-y-2 text-gray-300"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Add Teacher</span>
            </button>
          </div>
        </div>
        
        <div className="card">
           <h2 className="text-lg font-semibold mb-4 text-gray-200">Master Query Filter</h2>
           <div className="space-y-4">
             <div className="flex gap-4">
               <select className="input-field w-full" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                 <option value="CSE">CSE</option>
                 <option value="IT">IT</option>
                 <option value="CSE-AIML">CSE-AIML</option>
               </select>
               <select className="input-field w-full" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                 {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
               </select>
             </div>
             <button onClick={handleGenerateAnalysis} disabled={loadingAnalysis} className="btn-primary w-full flex justify-center items-center">
                 {loadingAnalysis ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                 Generate Result Analysis
             </button>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-4">
         <h2 className="text-xl font-bold text-gray-200 mb-6">Departmental Result Analysis</h2>
         {analysisData.length > 0 ? (
            <ResultAnalysisView data={analysisData} />
         ) : (
            <div className="p-12 border-2 border-dashed border-gray-700 rounded-lg text-center bg-gray-800 text-gray-400">
               Configure filters above and click Generate to run analytics engine.
            </div>
         )}
      </div>

    </div>
  );
};

export default AdminDashboard;
