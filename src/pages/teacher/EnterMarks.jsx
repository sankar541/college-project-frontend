import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services/teacher.service';
import { adminService } from '../../services/admin.service';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const EnterMarks = () => {
  const [subjects, setSubjects] = useState([]);
  
  // Cascading Selection State
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const [students, setStudents] = useState([]);
  const [marksState, setMarksState] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetches ONLY subjects assigned strictly to this active teacher
    const fetchSubjects = async () => {
      try {
        const data = await adminService.getSubjects();
        setSubjects(data || []);
      } catch (err) {
        toast.error('Failed to load subjects');
      }
    };
    fetchSubjects();
  }, []);

  // Compute dynamic dropdown options based on selections
  const uniqueBranches = [...new Set(subjects.map(s => s.branch))];
  const uniqueSemesters = [...new Set(subjects.filter(s => s.branch === selectedBranch).map(s => s.semester))];
  const availableSubjects = subjects.filter(s => s.branch === selectedBranch && s.semester == selectedSemester);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedSubjectId) {
        setStudents([]);
        return;
      }
      
      setLoading(true);
      try {
        const resp = await teacherService.getStudentsBySubject(selectedSubjectId);
        const studentsList = Array.isArray(resp) ? resp : (resp.data || []);
        setStudents(studentsList);
        
        // Init marks state array locally
        const initialMarks = {};
        studentsList.forEach(st => {
          initialMarks[st._id] = '';
        });
        setMarksState(initialMarks);
      } catch (err) {
        toast.error('Failed to load students for this subject filter path');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedSubjectId]);

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedSemester('');
    setSelectedSubjectId('');
  }

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    setSelectedSubjectId('');
  }

  const handleSubjectChange = (e) => {
    setSelectedSubjectId(e.target.value);
  }

  const handleMarkChange = (studentId, val) => {
    setMarksState(prev => ({
      ...prev,
      [studentId]: val
    }));
  };

  const determineGrade = (marks) => {
    if (marks >= 90) return 'O';
    if (marks >= 80) return 'E';
    if (marks >= 70) return 'A';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
  };

  const handleSaveMarks = async () => {
    setSaving(true);
    try {
      const subjectObj = subjects.find(s => s._id === selectedSubjectId);
      if(!subjectObj) throw new Error("Mapped Subject not locked correctly");

      const payloads = students.map(st => {
        const markVal = parseInt(marksState[st._id] || 0);
        return {
          registrationNumber: st.registrationNumber,
          subjectId: selectedSubjectId,
          marks: markVal
        };
      });

      await teacherService.submitMarks(payloads);
      toast.success('Grades synchronized flawlessly!');
      // Filter the submitted students directly returning empty buffer effectively locking grading duplications UI wise
      setStudents([]); 
    } catch (err) {
      toast.error(err.message || 'Failed to save marks payload');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
  <div>
    <h1 className="text-2xl font-bold text-gray-100">Enter Class Marks</h1>
    <p className="mt-1 text-sm text-gray-400">Isolate your specific class environment hierarchically to prevent parallel syllabus collisions!</p>
  </div>

  <div className="card">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">1. Select Assigned Branch</label>
          <select className="input-field" value={selectedBranch} onChange={handleBranchChange}>
             <option value="">-- Start Here --</option>
             {uniqueBranches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">2. Select Target Semester</label>
          <select className="input-field" value={selectedSemester} onChange={handleSemesterChange} disabled={!selectedBranch}>
             <option value="">-- Auto Generated --</option>
             {uniqueSemesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">3. Pinpoint Target Subject</label>
          <select className="input-field" value={selectedSubjectId} onChange={handleSubjectChange} disabled={!selectedSemester}>
             <option value="">-- Specific Class --</option>
             {availableSubjects.map(s => (
               <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
             ))}
          </select>
        </div>
     </div>
  </div>

  {loading ? (
    <div className="flex justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  ) : students.length > 0 ? (
    <div className="card animate-fade-in">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 flex-col">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reg. No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marks (out of 100)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Auto Eval</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {students.map((st) => {
              const m = marksState[st._id];
              const grade = m !== '' ? determineGrade(parseInt(m)) : '-';
              return (
                <tr key={st._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100 font-bold">{st.registrationNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{st.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-24 px-3 py-1 border border-gray-600 rounded bg-gray-900 text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                      value={m}
                      onChange={(e) => handleMarkChange(st._id, e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-300">
                    <span className={`px-2 py-1 rounded text-xs shadow-sm ${grade === 'F' ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                      {grade}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end pb-2">
        <button onClick={handleSaveMarks} disabled={saving} className="btn-primary flex items-center shadow-md">
           {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Permanently Finalize Marks
        </button>
      </div>
    </div>
  ) : selectedSubjectId && !loading && (
    <div className="text-center p-10 bg-gray-800 border border-gray-700 rounded-xl my-4 text-gray-400 animate-fade-in shadow-inner">
       Either all enrolled students evaluate correctly, or your system is disconnected from the class matrix entirely natively.
    </div>
  )}
</div>
  );
};

export default EnterMarks;
