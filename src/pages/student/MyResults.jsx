import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/student.service';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MyResults = () => {
  const { user } = useAuth();
  const [groupedResults, setGroupedResults] = useState({});
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!user?.registrationNumber) return;
        const respData = await studentService.getMyResults(user.registrationNumber);
        
        if (respData) {
          const records = respData.data || respData.performance || respData.subjectWiseMarks || [];
          const itemsArray = Array.isArray(records) ? records : (Array.isArray(respData) ? respData : []);

          const formattedResults = itemsArray.map(item => ({
             subjectName: item.subject?.name || item.subjectName || item.subject || 'Unknown',
             subjectCode: item.subject?.code || item.subjectCode || item.code || 'N/A',
             semester: item.semester || item.subject?.semester || 'Legacy',
             marks: item.marks,
             grade: item.grade
          }));

          // Natively Partition arrays by explicit Semester chronological tags!
          const grouped = {};
          formattedResults.forEach(item => {
             const sem = item.semester;
             if (!grouped[sem]) grouped[sem] = [];
             grouped[sem].push(item);
          });
          setGroupedResults(grouped);

          if (respData.performanceSummary) {
             setPerformance(respData.performanceSummary);
          } else if (formattedResults.length > 0) {
             const totalMarks = formattedResults.reduce((sum, r) => sum + (r.marks || 0), 0);
             const percentage = (totalMarks / (formattedResults.length * 100)) * 100;
             setPerformance({ percentage: percentage.toFixed(2) });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [user]);

  const getChartData = () => {
     // Flatten grouped results chronologically explicitly for graphing
     const flatResults = [];
     Object.keys(groupedResults).sort().forEach(sem => {
         flatResults.push(...groupedResults[sem]);
     });
     
    return {
      labels: flatResults.map(r => r.subjectName),
      datasets: [
        {
          label: 'Marks Obtained',
          data: flatResults.map(r => r.marks),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  };

  if(loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  const semestersList = Object.keys(groupedResults).sort();

  return (
    <div className="space-y-6">
  <div>
    <h1 className="text-2xl font-bold text-gray-100">Historical Transcripts</h1>
    <p className="mt-1 text-sm text-gray-400">View your academic performance safely segregated by explicitly tracked Semesters.</p>
  </div>

  {performance && (
     <div className="card bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl shadow-lg border-0 mb-8 p-8">
        <div className="flex justify-between items-center">
          <div>
             <h2 className="text-xl font-bold mb-1">Cumulative Percentage</h2>
             <p className="text-blue-200">Across all graded subjects globally natively.</p>
          </div>
          <div className="text-5xl font-extrabold pb-2">{performance.percentage || 'N/A'}%</div>
        </div>
     </div>
  )}

  {semestersList.length > 0 ? (
    <>
      <div className="space-y-12">
        {semestersList.map(sem => (
            <div key={sem} className="relative">
               <div className="flex items-center mb-6">
                   <h2 className="text-xl font-bold text-gray-200 bg-gray-900 pr-4">Semester {sem} Results</h2>
                   <div className="flex-grow border-t-2 border-dashed border-gray-700"></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {groupedResults[sem].map((item, idx) => (
                       <div key={idx} className="card hover:shadow-md transition border-l-4 border-l-primary-500">
                         <h3 className="font-semibold text-lg text-gray-200 mb-1 truncate" title={item.subjectName}>
                            {item.subjectName}
                         </h3>
                         <p className="text-sm text-gray-400 mb-4">{item.subjectCode}</p>
                         <div className="flex justify-between items-baseline border-t border-gray-700 pt-4 mt-2">
                           <span className="text-sm text-gray-400">Marks:</span>
                           <span className="text-xl font-bold text-gray-100">{item.marks}</span>
                         </div>
                         <div className="flex justify-between items-baseline mt-2">
                           <span className="text-sm text-gray-400">Grade:</span>
                           <span className={`px-2 py-1 rounded text-xs font-bold ${item.grade === 'F' ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                             {item.grade}
                           </span>
                         </div>
                       </div>
                   ))}
               </div>
            </div>
        ))}
      </div>

      <div className="card mt-12 bg-gray-800 border-gray-700">
         <h2 className="text-lg font-semibold mb-4 text-gray-200">Historical Trend (Linear)</h2>
         <div className="w-full max-w-4xl mx-auto hidden sm:block">
           <Line data={getChartData()} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
         </div>
         <p className="sm:hidden text-gray-400 text-sm">Please view on a larger screen to see your performance chart.</p>
      </div>
    </>
  ) : (
    <div className="card text-center p-12">
        <h3 className="text-lg font-medium text-gray-100 mb-2">No Transcripts Recorded</h3>
        <p className="text-gray-400">Your historical parameters have not triggered formally yet.</p>
    </div>
  )}
</div>
  );
};

export default MyResults;
