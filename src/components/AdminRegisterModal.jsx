import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ArrowLeft, LogOut, X, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://visa-verification-backend.onrender.com';

export default function AdminRegisterModal({ onClose, onLogout }) {
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    nationality: '',
    country: '',
    passcode: '',
    issueDate: '',
    agency: '',
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB.' });
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setMessage({ type: '', text: '' });
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
      setMessage({ type: 'error', text: 'Admin session expired. Please log in again.' });
      setLoading(false);
      return;
    }

    try {
      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key]);
      });

      if (photo) {
        submissionData.append('photo', photo);
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/visa/register`,
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Visa record registered successfully!' });
        setFormData({
          fullName: '',
          passportNumber: '',
          nationality: '',
          country: '',
          passcode: '',
          issueDate: '',
          agency: '',
        });
        handleRemovePhoto();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to register visa record. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-blue-800 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold">Register New Visa Record</h2>
              <p className="text-xs text-blue-200">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Photo Upload Area */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Applicant Photo
              </label>
              {photoPreview ? (
                <div className="relative w-28 h-36 rounded-lg overflow-hidden border-2 border-slate-200 shadow-xs">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/30 flex flex-col items-center justify-center gap-1"
                >
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="font-semibold text-slate-600">Click to upload photo</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG up to 5MB</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Abebe Bikila"
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Passport Number</label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. EP123456"
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="e.g. Ethiopian"
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Destination Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g. Saudi Arabia"
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">OTP Passcode (6 digits)</label>
                <input
                  type="text"
                  name="passcode"
                  value={formData.passcode}
                  onChange={handleInputChange}
                  placeholder="e.g. 849201"
                  maxLength={6}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Issue Date</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Agency Name</label>
                <input
                  type="text"
                  name="agency"
                  value={formData.agency}
                  onChange={handleInputChange}
                  placeholder="e.g. Ethio-Abroad Employment Agency"
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Visa Record'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}