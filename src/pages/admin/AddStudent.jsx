import React, { useState } from 'react';
import { adminService } from '../../services/admin.service';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    branch: 'CSE',
    semester: 1,
  });
  const [loading, setLoading] = useState(false);

  const branches = ["IT", "CSE", "CSE-AIML"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        branch: formData.branch,
        semester: formData.semester,
        students: [{
          name: formData.name,
          email: formData.email,
          registrationNumber: formData.registrationNumber
        }]
      };
      
      await adminService.createStudent(payload);
      toast.success('Student added successfully!');
      setFormData({ name: '', email: '', registrationNumber: '', branch: 'CSE', semester: 1 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="max-w-2xl mx-auto space-y-6">
  <div>
    <h1 className="text-2xl font-bold text-gray-100">Add New Student</h1>
    <p className="mt-1 text-sm text-gray-400">Create a new student entry in the portal.</p>
  </div>

  <div className="card">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            required
            className="input-field"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            className="input-field"
            placeholder="Ex: student@outr.ac.in"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Registration Number
          </label>
          <input
            name="registrationNumber"
            type="text"
            required
            className="input-field"
            placeholder="Ex: 23110680"
            value={formData.registrationNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Branch
          </label>
          <select
            name="branch"
            className="input-field"
            value={formData.branch}
            onChange={handleChange}
          >
            {branches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Semester
          </label>
          <select
            name="semester"
            className="input-field"
            value={formData.semester}
            onChange={handleChange}
          >
            {semesters.map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
         <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 mr-3"
            onClick={() => setFormData({ name: '', registrationNumber: '', branch: 'CSE', semester: 1 })}
          >
            Reset
         </button>
         <button type="submit" disabled={loading} className="btn-primary w-32 flex justify-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Student'}
         </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default AddStudent;
