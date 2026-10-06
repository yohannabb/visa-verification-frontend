import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://visa-verification-backend.onrender.com').replace(/\/+$/, '');

export default function AdminRegisterModal({ onClose, onLogout }) {
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    otp: '',
    visaNumber: '',
    passportNumber: '',
    visaType: '',
    occupation: '',
    gender: 'Male',
    birthDate: '',
    issueDate: '',
    expiryDate: ''
  });

  const [files, setFiles] = useState({
    applicantPhoto: null,
    attachedDocument: null,
    bottomVisaGraphic: null
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (files.applicantPhoto) data.append('applicantPhoto', files.applicantPhoto);
      if (files.attachedDocument) data.append('attachedDocument', files.attachedDocument);
      if (files.bottomVisaGraphic) data.append('bottomVisaGraphic', files.bottomVisaGraphic);

      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${API_BASE_URL}/api/visa/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      if (response.data.success) {
        setStatusMsg({ type: 'success', text: 'Visa record saved successfully!' });
        setFormData({
          fullName: '',
          nationality: '',
          otp: '',
          visaNumber: '',
          passportNumber: '',
          visaType: '',
          occupation: '',
          gender: 'Male',
          birthDate: '',
          issueDate: '',
          expiryDate: ''
        });
        setFiles({ applicantPhoto: null, attachedDocument: null, bottomVisaGraphic: null });
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save visa record. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white my-8 w-full max-w-2xl p-6 sm:p-8 rounded-lg shadow-2xl border border-slate-100 relative">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-6 text-sm font-semibold">
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            &larr; Back to Home
          </button>
          <button 
            type="button" 
            onClick={onLogout} 
            className="text-red-600 hover:text-red-700 font-bold transition-colors"
          >
            Logout
          </button>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-[#1d3557] mb-8">
          Register Visa Record
        </h2>

        {statusMsg.text && (
          <div className={`p-3 text-xs font-semibold rounded-md mb-6 text-center ${
            statusMsg.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-sm">
          {/* Full Name */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="MABRE SLESHI MULUYE"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 uppercase"
              required
            />
          </div>

          {/* Nationality & Access Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nationality</label>
              <input
                type="text"
                name="nationality"
                placeholder="ETHIOPIA"
                value={formData.nationality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Access Code / OTP (Passcode)</label>
              <input
                type="text"
                name="otp"
                placeholder="1234"
                value={formData.otp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                required
              />
            </div>
          </div>

          {/* Visa Number & Passport Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Visa Number</label>
              <input
                type="text"
                name="visaNumber"
                placeholder="598080"
                value={formData.visaNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Passport Number</label>
              <input
                type="text"
                name="passportNumber"
                placeholder="EQ1723007"
                value={formData.passportNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 uppercase"
                required
              />
            </div>
          </div>

          {/* Visa Type & Occupation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Visa Type</label>
              <input
                type="text"
                name="visaType"
                placeholder="B - Private Sector Work Visa"
                value={formData.visaType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Occupation</label>
              <input
                type="text"
                name="occupation"
                placeholder="Sell officer"
                value={formData.occupation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                required
              />
            </div>
          </div>

          {/* Gender & Birth Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
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
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                required
              />
            </div>
          </div>

          {/* Issue Date & Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Issue Date</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                required
              />
            </div>
          </div>

          {/* File Upload 1: Applicant Photo */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Applicant Photo Image (Upload from Device)
            </label>
            <input
              type="file"
              name="applicantPhoto"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border border-slate-300 rounded-md p-2 text-xs file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          {/* File Upload 2: Attached Document */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Attached Document Image (Upload from Device)
            </label>
            <input
              type="file"
              name="attachedDocument"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border border-slate-300 rounded-md p-2 text-xs file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          {/* File Upload 3: Bottom Visa Card Graphic */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Bottom Visa Card Graphic Image (Upload from Device)
            </label>
            <input
              type="file"
              name="bottomVisaGraphic"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border border-slate-300 rounded-md p-2 text-xs file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1d4ed8] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 text-base"
            >
              {loading ? 'Saving Record...' : 'Save Visa Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}