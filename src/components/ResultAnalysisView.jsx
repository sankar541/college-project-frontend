import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultAnalysisView = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <p className="text-gray-400 font-medium">No results data found for this analysis.</p>
    </div>
    );
  }

  // Build chart datasets
  const labels = data.map((d) => d.subjectName);
  
  const chartData = {
    labels,
    datasets: [
      { label: 'O', data: data.map(d => d.O), backgroundColor: '#3b82f6' }, // blue
      { label: 'E', data: data.map(d => d.E), backgroundColor: '#f97316' }, // orange
      { label: 'A', data: data.map(d => d.A), backgroundColor: '#9ca3af' }, // gray
      { label: 'B', data: data.map(d => d.B), backgroundColor: '#eab308' }, // yellow
      { label: 'C', data: data.map(d => d.C), backgroundColor: '#3b82f6' }, // blue 2
      { label: 'D', data: data.map(d => d.D), backgroundColor: '#22c55e' }, // green
      { label: 'F', data: data.map(d => d.F), backgroundColor: '#1e3a8a' }, // dark blue
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Result Analysis (Grade Distribution)' },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="space-y-8">
    <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-700 text-sm border-collapse">
        <thead>
          <tr className="bg-gray-900">
            <th className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 whitespace-nowrap">Sl. No</th>
            <th className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 whitespace-nowrap">Course</th>
            <th className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 whitespace-nowrap">Branch</th>
            <th className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 whitespace-nowrap">Semester</th>
            <th className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 whitespace-nowrap">Subject</th>
            <th className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 whitespace-nowrap">Sub. Code</th>
            <th className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 whitespace-nowrap">Name of the Faculty</th>
            <th className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 whitespace-nowrap">No. of Students</th>
            <th className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 whitespace-nowrap">Feedback Score</th>
            <th colSpan="7" className="px-4 py-3 border border-gray-700 font-semibold text-gray-300 text-center whitespace-nowrap bg-gray-800">Result</th>
          </tr>
          <tr className="bg-gray-800">
            <th colSpan="9" className="border border-gray-700"></th>
            <th className="px-3 py-2 border border-gray-700 font-semibold text-gray-400">O</th>
            <th className="px-3 py-2 border border-gray-700 font-semibold text-gray-400">E</th>
            <th className="px-3 py-2 border border-gray-700 font-semibold text-gray-400">A</th>
            <th className="px-3 py-2 border border-gray-700 font-semibold text-gray-400">B</th>
            <th className="px-3 py-2 border border-gray-700 font-semibold text-gray-400">C</th>
            <th className="px-3 py-2 border border-gray-700 font-semibold text-gray-400">D</th>
            <th className="px-3 py-2 border border-gray-700 font-semibold text-gray-400">F</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-700 text-center">
              <td className="px-4 py-3 border border-gray-700 text-gray-400">{index + 1}</td>
              <td className="px-4 py-3 border border-gray-700 text-gray-100">{row.course}</td>
              <td className="px-4 py-3 border border-gray-700 text-gray-100">{row.branch}</td>
              <td className="px-4 py-3 border border-gray-700 text-gray-100">{row.semester}</td>
              <td className="px-4 py-3 border border-gray-700 text-gray-100">{row.subjectName}</td>
              <td className="px-4 py-3 border border-gray-700 text-gray-100">{row.subjectCode}</td>
              <td className="px-4 py-3 border border-gray-700 text-gray-100">{row.facultyName}</td>
              <td className="px-4 py-3 border border-gray-700 font-semibold text-gray-300">{row.studentsCount}</td>
              <td className="px-4 py-3 border border-gray-700 text-gray-100 font-medium">{row.feedbackScore}</td>
              <td className="px-3 py-3 border border-gray-700 text-gray-200">{row.O}</td>
              <td className="px-3 py-3 border border-gray-700 text-gray-200">{row.E}</td>
              <td className="px-3 py-3 border border-gray-700 text-gray-200">{row.A}</td>
              <td className="px-3 py-3 border border-gray-700 text-gray-200">{row.B}</td>
              <td className="px-3 py-3 border border-gray-700 text-gray-200">{row.C}</td>
              <td className="px-3 py-3 border border-gray-700 text-gray-200">{row.D}</td>
              <td className="px-3 py-3 border border-gray-700 text-gray-200">{row.F}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="bg-gray-800 p-6 border border-gray-700 rounded-lg shadow-sm">
      <Bar options={chartOptions} data={chartData} />
    </div>
  </div>
  );
};

export default ResultAnalysisView;
