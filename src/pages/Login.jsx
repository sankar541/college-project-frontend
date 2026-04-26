import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Loader2, User, Users, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    // clear fields optionally
    // setEmail('');
    // setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      
      // Enforce role-based login validation
      if (user.role !== role) {
         toast.error(`You are registered as a ${user.role}, please sign in via the correct portal tab.`);
         return;
      }
      
      toast.success('Login successful!');
      
      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else if (user.role === 'student') navigate('/student');
      else navigate('/');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-soft">
    <div className="flex flex-col items-center">
      <img src="/logo.png" alt="OUTR Logo" className="w-28 h-28 mb-2 object-contain" />
      <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-100 tracking-tight">
        OUTR Result Portal
      </h2>
      <p className="mt-2 text-center text-sm text-gray-400">
        Sign in to access your dashboard
      </p>
    </div>

    {/* Role Tabs */}
    <div className="flex border-b border-gray-700 mt-6 mb-8">
      <button
        type="button"
        className={`flex-1 py-3 text-sm font-medium text-center flex items-center justify-center transition-colors ${role === 'student' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-400 hover:text-gray-200'}`}
        onClick={() => handleRoleChange('student')}
      >
        <User className="w-4 h-4 mr-2" /> Student
      </button>
      <button
        type="button"
        className={`flex-1 py-3 text-sm font-medium text-center flex items-center justify-center transition-colors ${role === 'teacher' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-400 hover:text-gray-200'}`}
        onClick={() => handleRoleChange('teacher')}
      >
        <Users className="w-4 h-4 mr-2" /> Teacher
      </button>
      <button
        type="button"
        className={`flex-1 py-3 text-sm font-medium text-center flex items-center justify-center transition-colors ${role === 'admin' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-400 hover:text-gray-200'}`}
        onClick={() => handleRoleChange('admin')}
      >
        <Shield className="w-4 h-4 mr-2" /> Admin
      </button>
    </div>

    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input-field"
            placeholder="Ex: student@outr.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center btn-primary py-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
              Signing in...
            </>
          ) : (
            `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`
          )}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default Login;
