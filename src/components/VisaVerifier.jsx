import React, { useState } from 'react';
import axios from 'axios';
import { 
  ChevronLeft, ChevronRight, ArrowRight, Phone, Mail, MapPin, 
  Menu, X, Globe, Lock
} from 'lucide-react';
import VisaCardResult from './VisaCardResult';
import AdminRegisterModal from './AdminRegisterModal';

// Vite environment variable with hardcoded Render fallback and trailing slash cleanup
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://visa-verification-backend.onrender.com').replace(/\/+$/, '');

const slides = [
  {
    title: "State Minister",
    titleAmharic: "ሚኒስትር ዴኤታ",
    name: "H.E. Ato Nebiy Mohammed Abdulhakim",
    nameAmharic: "ክቡር አቶ ነቢይ መሐመድ አብዱልሐኪም",
    badge: "የተጨማሪ ያንብቡ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz1LrOp5aCfCUdqrevyWGIHboeDORTEZcO2m34Pp_DAlvYiIJ_RSFeSPs&s=10"
  },
  {
    title: "Minister of Labor",
    titleAmharic: "የሥራና ክህሎት ሚኒስትር",
    name: "H.E. Muferihat Kamil",
    nameAmharic: "ክብርት ሙፈሪያት ካሚል",
    badge: "የተጨማሪ ያንብቡ",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Minister_of_Labour_and_Skills_Development_Muferihat_Kamil_Ahmed.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"
  }
];

export default function VisaVerifier() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [visaData, setVisaData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Admin Auth & Modal States
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminRegisterOpen, setIsAdminRegisterOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [adminError, setAdminError] = useState('');

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Please enter a valid OTP / Passcode number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/visa/verify`, { passcode: passcode.trim() });
      if (response.data.success) {
        setVisaData(response.data.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid passcode or visa record not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, adminCredentials);
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.data.token);
        setIsAdminLoggedIn(true);
        setIsAdminLoginOpen(false);
        setIsAdminRegisterOpen(true);
        setAdminCredentials({ email: '', password: '' });
      }
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Invalid admin email or password.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    setIsAdminLoginOpen(false);
    setIsAdminRegisterOpen(false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-white">
      {/* HEADER */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-blue-900 text-base leading-tight">Ministry of Labor and Skills</h1>
              <p className="text-xs text-slate-500">Federal Democratic Republic of Ethiopia</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <a href="#home" className="text-blue-700 font-semibold">Home</a>
            <a href="#about" className="hover:text-blue-700 transition-colors">About</a>
            <a href="#administration" className="hover:text-blue-700 transition-colors">Administration</a>
            <a href="#information" className="hover:text-blue-700 transition-colors">Information</a>
            <a href="#media" className="hover:text-blue-700 transition-colors">Media</a>
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAdminRegisterOpen(true)} 
                  className="bg-blue-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleAdminLogout} 
                  className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAdminLoginOpen(true)} 
                className="bg-blue-900 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
              >
                Admin
              </button>
            )}
          </nav>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b px-6 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="#home" className="text-blue-700">Home</a>
            <a href="#about">About</a>
            <a href="#administration">Administration</a>
            <a href="#information">Information</a>
            <a href="#media">Media</a>
            {isAdminLoggedIn ? (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setMobileMenuOpen(false); setIsAdminRegisterOpen(true); }} 
                  className="bg-blue-900 text-white text-left px-3 py-2 rounded-md text-xs font-semibold w-full"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleAdminLogout(); }} 
                  className="bg-red-600 text-white text-left px-3 py-2 rounded-md text-xs font-semibold w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setMobileMenuOpen(false); setIsAdminLoginOpen(true); }} 
                className="bg-blue-900 text-white text-left px-3 py-2 rounded-md text-xs font-semibold w-full"
              >
                Admin
              </button>
            )}
          </div>
        )}
      </header>

      {/* HERO SLIDER */}
      <section id="home" className="relative bg-slate-100 overflow-hidden h-[480px] sm:h-[540px]">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, idx) => (
            <div key={idx} className="w-full h-full shrink-0 relative bg-slate-200">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/30 to-transparent" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pointer-events-none">
          <div className="bg-white/85 backdrop-blur-md p-8 rounded-2xl max-w-md border border-white/40 shadow-xl pointer-events-auto">
            <h2 className="text-3xl font-bold text-blue-950 mb-1">{slides[currentSlide].title}</h2>
            <p className="text-sm font-medium text-blue-800 mb-4">{slides[currentSlide].titleAmharic}</p>
            <p className="text-sm text-slate-700 font-semibold mb-1">{slides[currentSlide].name}</p>
            <p className="text-xs text-slate-500 mb-6">{slides[currentSlide].nameAmharic}</p>
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
              Read More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-slate-800">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-slate-800">
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-blue-700' : 'w-2.5 bg-white/70'}`} />
          ))}
        </div>
      </section>

      {/* OTP FORM */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
            <h2 className="text-2xl font-bold text-blue-950 mb-6">OTP Number</h2>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-Digit OTP Number"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full text-center px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-800 placeholder-slate-400 text-base"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors shadow-md disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section id="media" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-blue-950">Latest News</h2>
            <p className="text-xs text-slate-500 mt-1">Recent updates, announcements, and press releases.</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 flex justify-end">
                  <div className="rounded-xl overflow-hidden shadow-md relative group max-w-sm">
                    <img src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=600" alt="News 1" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                      <span className="text-[10px] text-slate-300">June 24, 2026</span>
                      <h4 className="text-sm font-semibold">New National Skills Program Launched</h4>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex w-4 h-4 rounded-full bg-blue-700 border-4 border-white shadow -translate-x-2 z-10" />
                <div className="md:w-1/2" />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2" />
                <div className="hidden md:flex w-4 h-4 rounded-full bg-blue-700 border-4 border-white shadow -translate-x-2 z-10" />
                <div className="md:w-1/2 flex justify-start">
                  <div className="rounded-xl overflow-hidden shadow-md relative group max-w-sm">
                    <img src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600" alt="News 2" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                      <span className="text-[10px] text-slate-300">May 12, 2026</span>
                      <h4 className="text-sm font-semibold">Labor Rights Reform Signed Into Law</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white pt-12 pb-6 border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-blue-300" />
                <h4 className="font-bold text-sm">Ministry of Labor and Skills</h4>
              </div>
              <p className="text-blue-200 leading-relaxed">
                Empowering the workforce through skills development, fair labor practices, and inclusive economic opportunity for every citizen.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3">QUICK LINKS</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#home" className="hover:text-white">Home</a></li>
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#administration" className="hover:text-white">Administration</a></li>
                <li><a href="#information" className="hover:text-white">Information</a></li>
                <li><a href="#media" className="hover:text-white">Media</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3">CONTACT INFO</h4>
              <ul className="space-y-2 text-blue-200">
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +251 11 000 0000</li>
                <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> info@mols.gov</li>
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Government Ave, Capital City</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-6 text-center text-xs text-blue-300">
            <p>
              © 2026 Ministry of Labor and Skills. All rights reserved. • 
              {isAdminLoggedIn ? (
                <button onClick={handleAdminLogout} className="underline hover:text-white ml-1">
                  Logout Admin
                </button>
              ) : (
                <button onClick={() => setIsAdminLoginOpen(true)} className="underline hover:text-white ml-1">
                  Admin Login
                </button>
              )}
            </p>
          </div>
        </div>
      </footer>

      {/* RESULT MODAL */}
      {isModalOpen && visaData && (
        <VisaCardResult data={visaData} onClose={() => setIsModalOpen(false)} />
      )}

      {/* ADMIN LOGIN MODAL */}
      {isAdminLoginOpen && !isAdminLoggedIn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => setIsAdminLoginOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950">Admin Portal</h3>
              <p className="text-xs text-slate-500 mt-1">Please enter credentials to manage visa records</p>
            </div>

            {adminError && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 mb-4 text-center">
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input 
                  type="text" 
                  value={adminCredentials.email} 
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password</label>
                <input 
                  type="password" 
                  value={adminCredentials.password} 
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg shadow-md transition-colors mt-2"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN REGISTRATION MODAL */}
      {isAdminLoggedIn && isAdminRegisterOpen && (
        <AdminRegisterModal 
          onClose={() => setIsAdminRegisterOpen(false)} 
          onLogout={handleAdminLogout} 
        />
      )}
    </div>
  );
}