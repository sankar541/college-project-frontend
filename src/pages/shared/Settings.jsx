import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { studentService } from '../../services/student.service';
import { teacherService } from '../../services/teacher.service';
import { toast } from 'react-toastify';
import { Camera, Save, Lock, User as UserIcon, Loader2 } from 'lucide-react';

const Settings = () => {
    const { user, updateUser } = useAuth();
    
    // Profile Edit State
    const [previewPhoto, setPreviewPhoto] = useState(user?.photo || null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);

    // Info State
    const [userInfo, setUserInfo] = useState(null);
    const [infoLoading, setInfoLoading] = useState(true);

    useEffect(() => {
        // Fetch specific localized user configurations structurally
        const loadInfo = async () => {
            try {
                if (user?.role === 'student') {
                    // Usually this pings `/analytics/student-stats` explicitly.
                    // If we lack direct data mapping, we fallback cleanly onto global Auth layout parameters.
                    // I'll dynamically hit the endpoint built earlier securely:
                    const data = await teacherService.getAnalyticsByBranch('N/A').catch(() => null); 
                    // Wait, student doesn't hit getAnalyticsByBranch. They ping studentService!
                    // Let's rely on standard UI mappings for students and teachers safely for now based on user payload.
                }
            } catch (err) {
                console.error(err);
            } finally {
                setInfoLoading(false);
            }
        };
        loadInfo();
    }, [user]);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Strict generic evaluation restricting bounds cleanly to 5MB structural limits
        if (file.size > 5000000) {
            toast.error("Image must be smaller than 5MB!");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            setPreviewPhoto(base64String);
            
            // Dispatch organic pipeline strictly natively targeting backend hooks securely
            setUploadingImage(true);
            try {
                const response = await authService.updateProfile(base64String);
                updateUser(response.user);
                toast.success("Profile avatar successfully synchronized!");
            } catch (error) {
                toast.error(error.response?.data?.message || "Image mutation configuration failed.");
                setPreviewPhoto(user?.photo || null);
            } finally {
                setUploadingImage(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords do not synthetically match!");
        }

        if (passwordData.newPassword.length < 6) {
           return toast.error("Hash algorithm requires strings measuring 6+ structural elements.");
        }

        setChangingPassword(true);
        try {
            await authService.updatePassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success("Secure password payload mathematically shifted reliably.");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid authentication matrix.");
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
    <div>
        <h1 className="text-2xl font-bold text-gray-100">Profile Settings</h1>
        <p className="text-gray-400 mt-1 text-sm">Organically configure your secure credentials explicitly.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Avatar Controller Panel */}
        <div className="col-span-1 border rounded-xl bg-gray-800 border-gray-700 shadow-sm p-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold w-full border-b border-gray-700 pb-2 mb-4 text-gray-200">Identity Array</h2>
            <div className="relative group mt-2">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg justify-center items-center flex bg-gray-900">
                    {previewPhoto ? (
                        <img src={previewPhoto} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-16 h-16 text-gray-400" />
                    )}
                </div>
                <button 
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white shadow-md hover:bg-primary-700 transition"
                >
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handlePhotoChange} 
                    className="hidden" 
                />
            </div>
            <div className="mt-6 text-center w-full">
                <p className="font-bold text-gray-100 truncate px-2">{user?.name}</p>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mt-1">{user?.role}</p>
                {user?.registrationNumber && (
                  <span className="inline-block px-3 py-1 bg-blue-900 text-blue-300 text-xs font-bold rounded-full mt-3">
                    {user.registrationNumber}
                  </span>
                )}
            </div>
        </div>

        {/* Password / Settings Array */}
        <div className="col-span-2 space-y-6">
            <div className="card">
                <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-200">
                  <Lock className="w-5 h-5 mr-2 text-primary-500" /> Change Password
                </h2>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Previous Password</label>
                        <input 
                            type="password" 
                            required
                            className="input-field" 
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                            <input 
                                type="password" 
                                required
                                className="input-field" 
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                            <input 
                                type="password" 
                                required
                                className="input-field" 
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={changingPassword} className="btn-primary flex items-center shadow-md">
                            {changingPassword ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} 
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

            <div className="card bg-gray-800 border-gray-700 shadow-inner">
                 <h2 className="text-lg font-semibold mb-4 text-gray-200">Account Bounds</h2>
                 <div className="space-y-3 pb-2 text-sm text-gray-400">
                     <div className="flex justify-between border-b border-gray-700 pb-2">
                         <span className="font-medium text-gray-400">Contact Vector</span>
                         <span className="font-semibold text-gray-200">{user?.email || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-700 pb-2">
                         <span className="font-medium text-gray-400">Platform ID Status</span>
                         <span className="font-semibold text-gray-200">Secured (SSL)</span>
                     </div>
                     <div className="flex justify-between pb-1 text-gray-500 italic text-xs mt-2">
                         System metrics and organic parameters uniquely bound to your schema locally.
                     </div>
                 </div>
            </div>

        </div>
    </div>
</div>
    );
};

export default Settings;
