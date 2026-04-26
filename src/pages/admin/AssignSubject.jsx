import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const AssignSubject = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    branch: 'CSE',
    semester: 1,
    teacher: ''
  });
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);

  const branches = ["IT", "CSE", "CSE-AIML"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await adminService.getTeachers();
        setTeachers(data);
      } catch (err) {
        toast.error("Failed to load teachers list");
      } finally {
        setTeachersLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.teacher) {
        toast.error("Please assign a teacher to this subject");
        return;
    }
    setLoading(true);
    try {
      await adminService.createSubject(formData);
      toast.success('Subject assigned successfully!');
      setFormData({ name: '', code: '', branch: 'CSE', semester: 1, teacher: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create and assign subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
  <div>
    <h1 className="text-2xl font-bold text-gray-100">Add & Assign Subject</h1>
    <p className="mt-1 text-sm text-gray-400">Create a new subject and assign it to a teacher.</p>
  </div>

  <div className="card">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Subject Name</label>
          <input name="name" type="text" required className="input-field" placeholder="Data Structures" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Subject Code</label>
          <input name="code" type="text" required className="input-field" placeholder="CS301" value={formData.code} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Branch</label>
          <select name="branch" className="input-field" value={formData.branch} onChange={handleChange}>
            {branches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Semester</label>
          <select name="semester" className="input-field" value={formData.semester} onChange={handleChange}>
            {semesters.map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Assign Teacher</label>
          {teachersLoading ? (
            <div className="input-field text-gray-400 flex items-center bg-gray-800">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading teachers...
            </div>
          ) : (
            <select name="teacher" required className="input-field" value={formData.teacher} onChange={handleChange}>
              <option value="" disabled>-- Select a Teacher --</option>
              {teachers.map(t => (
                <option key={t._id} value={t._id}>{t.name} {t.email ? `(${t.email})` : ''}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
         <button type="submit" disabled={loading} className="btn-primary w-40 flex justify-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Assign Subject'}
         </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default AssignSubject;
