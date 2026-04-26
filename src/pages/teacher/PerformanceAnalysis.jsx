import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services/teacher.service';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PerformanceAnalysis = () => {
  const [branch, setBranch] = useState('CSE');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const branches = ["IT", "CSE", "CSE-AIML"];

  const fetchAnalytics = async (b) => {
    setLoading(true);
    try {
      const result = await teacherService.getAnalyticsByBranch(b);
      if (result) {
         setData(result);
      }
    } catch (err) {
      toast.error('Failed to analyze branch performance. Check subject integrity.');
      setData({ averageMarks: 0, failedCount: 0, subjectAverages: {} });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(branch);
  }, [branch]);

  const getBarChartData = () => {
    if (!data?.subjectAverages) return null;
    return {
      labels: Object.keys(data.subjectAverages),
      datasets: [
        {
          label: 'Average Marks',
          data: Object.values(data.subjectAverages),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getPieChartData = () => {
    if (!data) return null;
    const passCount = 60 - data.failedCount; // Assuming 60 total for visual sake
    return {
      labels: ['Passed', 'Failed'],
      datasets: [{
        data: [passCount, data.failedCount],
        backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(239, 68, 68, 0.7)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 1,
      }]
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analysis</h1>
          <p className="mt-1 text-sm text-gray-500">Analyze student performance across branches.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter Branch:</label>
          <select 
            className="input-field py-1" 
            value={branch} 
            onChange={(e) => setBranch(e.target.value)}
          >
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
         <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card text-center py-8">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Overall Branch Average</h3>
              <p className="text-4xl font-bold text-primary-600">{data.averageMarks}%</p>
            </div>
            <div className="card text-center py-8">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Failed Students Found</h3>
              <p className="text-4xl font-bold text-red-500">{data.failedCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="card">
               <h2 className="text-lg font-semibold mb-4 text-center">Subject-wise Average Marks</h2>
               {getBarChartData() && <Bar data={getBarChartData()} options={{ responsive: true }} />}
            </div>
            
            <div className="card flex flex-col items-center">
               <h2 className="text-lg font-semibold mb-4 text-center">Pass / Fail Ratio</h2>
               <div className="w-64 h-64">
                 {getPieChartData() && <Pie data={getPieChartData()} options={{ responsive: true }} />}
               </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PerformanceAnalysis;
