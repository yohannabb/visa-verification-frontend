import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ArrowLeft, LogOut, X, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const INITIAL_FORM_STATE = {
  fullName: 'MABRE SLESHI MULUYE',
  nationality: 'ETHIOPIA',
  passcode: '1234',
  visaNumber: '598080',
  passportNumber: 'EQ1723007',
  visaType: 'B - Private Sector Work Visa',
  occupation: 'Sell officer',
  gender: 'Male',
  birthDate: '',
  issueDate: '',
  expiryDate: ''
};

export default function AdminRegisterModal({ onClose, onLogout }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState({
    photo: null,
    attachedDoc: null,
    visaCardImage: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Refs to manually clear file input elements after submission
  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const cardInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setFiles({ photo: null, attachedDoc: null, visaCardImage: null });
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (docInputRef.current) docInputRef.current.value = '';
    if (cardInputRef.current) cardInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => submitData.append(key, formData[key]));
    if (files.photo) submitData.append('photo', files.photo);
    if (files.attachedDoc) submitData.append('attachedDoc', files.attachedDoc);
    if (files.visaCardImage) submitData.append('visaCardImage', files.visaCardImage);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/visa/register`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success || res.status === 200 || res.status === 201) {
        setMessage({ type: 'success', text: 'Visa Record Registered Successfully!' });
        resetForm();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error registering visa record. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 my-8 border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Modal Close Icon */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header navigation links */}
        <div className="flex items-center justify-between mb-6 border-b pb-4 text-xs font-semibold pr-6">
          <button 
            onClick={onClose} 
            className="text-blue-900 hover:text-blue-700 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          
          {onLogout && (
            <button 
              onClick={onLogout} 
              className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
          Register Visa Record
        </h2>

        {/* Alert Message */}
        {message.text && (
          <div className={`p-3 text-xs rounded-lg mb-6 flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
            />
          </div>

          {/* Nationality & Access Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nationality</label>
              <input 
                type="text" 
                name="nationality" 
                value={formData.nationality} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Access Code / OTP (Passcode)</label>
              <input 
                type="text" 
                name="passcode" 
                value={formData.passcode} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
          </div>

          {/* Visa Number & Passport Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Visa Number</label>
              <input 
                type="text" 
                name="visaNumber" 
                value={formData.visaNumber} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Passport Number</label>
              <input 
                type="text" 
                name="passportNumber" 
                value={formData.passportNumber} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
          </div>

          {/* Visa Type & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Visa Type</label>
              <input 
                type="text" 
                name="visaType" 
                value={formData.visaType} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Occupation</label>
              <input 
                type="text" 
                name="occupation" 
                value={formData.occupation} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
          </div>

          {/* Gender & Birth Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Gender</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Birth Date</label>
              <input 
                type="date" 
                name="birthDate" 
                value={formData.birthDate} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
          </div>

          {/* Issue Date & Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Issue Date</label>
              <input 
                type="date" 
                name="issueDate" 
                value={formData.issueDate} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
              <input 
                type="date" 
                name="expiryDate" 
                value={formData.expiryDate} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Applicant Photo Image (Upload from Device)
              </label>
              <input 
                ref={photoInputRef}
                type="file" 
                name="photo" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="w-full text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border rounded-lg border-slate-300 p-1" 
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Attached Document Image (Upload from Device)
              </label>
              <input 
                ref={docInputRef}
                type="file" 
                name="attachedDoc" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="w-full text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border rounded-lg border-slate-300 p-1" 
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Bottom Visa Card Graphic Image (Upload from Device)
              </label>
              <input 
                ref={cardInputRef}
                type="file" 
                name="visaCardImage" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="w-full text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border rounded-lg border-slate-300 p-1" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg shadow-sm transition-colors mt-6 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Save Visa Record
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}