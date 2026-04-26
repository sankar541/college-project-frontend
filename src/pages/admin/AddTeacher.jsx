import React, { useState } from 'react';
import { adminService } from '../../services/admin.service';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.createTeacher(formData);
      toast.success('Teacher account created successfully!');
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create teacher account');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="max-w-2xl mx-auto space-y-6">
  <div>
    <h1 className="text-2xl font-bold text-gray-100">Add New Teacher</h1>
    <p className="mt-1 text-sm text-gray-400">Create login credentials for a new teacher.</p>
  </div>

  <div className="card">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            required
            className="input-field"
            placeholder="Jane Smith"
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
            placeholder="teacher@outr.ac.in"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Assign Initial Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="input-field"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
         <button type="submit" disabled={loading} className="btn-primary w-32 flex justify-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Teacher'}
         </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default AddTeacher;
