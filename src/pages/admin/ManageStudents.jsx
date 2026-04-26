import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import { toast } from 'react-toastify';
import { Loader2, Search, ArrowUpCircle, Filter } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Cohort Filters
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  // Promotion State
  const [promotingId, setPromotingId] = useState(null);

  const fetchStudents = async () => {
    if (!filterBranch || !filterSemester) {
       return toast.warn("Please explicitly declare a Cohort Mapping Branch and Semester locally to bypass payload limits.");
    }

    setLoading(true);
    try {
      const data = await adminService.getStudents(filterBranch, filterSemester);
      setStudents(data);
    } catch (err) {
      toast.error('Failed to load students mapping');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (studentId, currentSem) => {
    const targetSemester = currentSem + 1;
    if (targetSemester > 8) {
        return toast.error("Maximum Academic parameter threshold physically exceeded.");
    }
    
    setPromotingId(studentId);
    try {
      await adminService.promoteStudent(studentId, targetSemester);
      toast.success(`Student securely passed strictly into Semester ${targetSemester}!`);
      fetchStudents(); // organic reload natively wiping isolated arrays locally
    } catch (err) {
      toast.error(err.response?.data?.message || 'Promotion explicitly rejected by backend logic.');
    } finally {
      setPromotingId(null);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.registrationNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
    <div>
      <h1 className="text-2xl font-bold text-gray-100">Manage Students</h1>
      <p className="mt-1 text-sm text-gray-400">Administrate specific isolated cohorts natively updating their progression structurally.</p>
    </div>
    
    <div className="mt-4 sm:mt-0 relative max-w-sm w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search explicitly by name or Registration Nb..."
        className="input-field pl-10 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

  <div className="card bg-gray-800 mb-6 p-4">
     <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
       <Filter className="w-4 h-4 mr-2"/> Target Cohort Filters
     </h2>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select className="input-field shadow-sm bg-gray-800" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
            <option value="">Select Target Branch...</option>
            <option value="IT">Information Technology (IT)</option>
            <option value="CSE">Computer Science (CSE)</option>
            <option value="CSE-AIML">CSE - Artificial Intelligence (AIML)</option>
        </select>
        <select className="input-field shadow-sm bg-gray-800" value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)}>
            <option value="">Select Target Semester...</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        <button 
           onClick={fetchStudents} 
           disabled={loading || !filterBranch || !filterSemester}
           className="btn-primary shadow-sm hover:shadow-md transition w-full md:w-auto flex justify-center"
        >
           {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch Cohort'}
        </button>
     </div>
  </div>

  <div className="card overflow-hidden">
    {loading ? (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    ) : students.length === 0 ? (
       <div className="text-center p-12 text-gray-400 font-medium">
         Please explicitly compile a configuration query above to locate Active Cohorts.
       </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Registration Nb</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student Matrix</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cohort (Sem)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pass Forward</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredStudents.length > 0 ? filteredStudents.map((st) => (
              <tr key={st._id} className="hover:bg-gray-700 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-300">{st.registrationNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{st.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <span className="px-2 py-1 bg-indigo-900 text-indigo-300 rounded-md font-bold text-xs shadow-sm">
                    {st.branch} • Sem {st.semester}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {st.semester >= 8 ? (
                     <span className="text-gray-500 font-medium italic text-xs">Graduated Cohort</span>
                  ) : (
                     <button
                       onClick={() => handlePromote(st._id, st.semester)}
                       disabled={promotingId === st._id}
                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-all active:scale-95"
                     >
                       {promotingId === st._id ? (
                           <Loader2 className="w-5 h-5 animate-spin" />
                       ) : (
                           <><ArrowUpCircle className="w-5 h-5 mr-2" /> Pass (+1)</>
                       )}
                     </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                  Zero configurations structurally matched the layout searches natively.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>
  );
};

export default ManageStudents;
