import React, { useState } from 'react';
import axios from 'axios';
import { 
  ChevronLeft, ChevronRight, ArrowRight, Phone, Mail, MapPin, 
  Menu, X, Globe, Lock, FileText, Search, CheckCircle, Plane, Twitter, Facebook, Youtube
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
    badge: "ተጨማሪ ያንብቡ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz1LrOp5aCfCUdqrevyWGIHboeDORTEZcO2m34Pp_DAlvYiIJ_RSFeSPs&s=10"
  },
  {
    title: "Minister of Labor",
    titleAmharic: "የሥራና ክህሎት ሚኒስትር",
    name: "H.E. Muferihat Kamil",
    nameAmharic: "ክብርት ሙፈሪያት ካሚል",
    badge: "ተጨማሪ ያንብቡ",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Minister_of_Labour_and_Skills_Development_Muferihat_Kamil_Ahmed.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"
  }
];

const visaInstructions = [
  {
    title: "Tourism Visa",
    passportValidity: "No less than 6 months",
    entryPermitValidity: "30 days from the date of issuance",
    stayDuration: "No more than 90 days from the date of entry",
    numberOfEntries: "Single entry",
    prohibition: "The visa holder is prohibited from working"
  },
  {
    title: "Family Visit Visa",
    passportValidity: "No less than 6 months",
    entryPermitValidity: "30 days from the date of issuance",
    stayDuration: "No more than 90 days from the date of entry",
    numberOfEntries: "Single entry",
    prohibition: "The visa holder is prohibited from working"
  },
  {
    title: "Government Visa",
    passportValidity: "No less than 6 months",
    entryPermitValidity: "30 days from the date of issuance",
    stayDuration: "No more than 90 days from the date of entry",
    numberOfEntries: "Single entry",
    prohibition: "The visa holder is prohibited from working"
  },
  {
    title: "Business Visa",
    passportValidity: "No less than 6 months",
    entryPermitValidity: "30 days from the date of issuance",
    stayDuration: "No more than 90 days from the date of entry",
    numberOfEntries: "Single entry",
    prohibition: "The visa holder is prohibited from working"
  }
];

const processSteps = [
  {
    icon: FileText,
    title: "Submit Application",
    desc: "Fill out the visa form and provide your passport information."
  },
  {
    icon: Search,
    title: "Application Review",
    desc: "The Ministry of Interior reviews and verifies your details."
  },
  {
    icon: CheckCircle,
    title: "Visa Approval",
    desc: "Your visa will be issued after successful verification."
  },
  {
    icon: Plane,
    title: "Travel to Kuwait",
    desc: "Present your visa and passport at the entry checkpoint."
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
    <div className="min-h-screen font-sans text-slate-800 bg-[#f8fafc]">
      {/* HEADER */}
      <header className="bg-white sticky top-0 z-40 border-b border-slate-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white font-bold shadow-xs">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-[#1e3a8a] text-lg leading-tight">Ministry of Labor and Skills</h1>
              <p className="text-xs text-slate-400 font-medium">Federal Democratic Republic</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <a href="#home" className="text-[#1d4ed8] hover:text-[#1e3a8a] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#1d4ed8] transition-colors">About</a>
            <a href="#administration" className="hover:text-[#1d4ed8] transition-colors">Administration</a>
            <a href="#information" className="hover:text-[#1d4ed8] transition-colors">Information</a>
            <a href="#media" className="hover:text-[#1d4ed8] transition-colors">Media</a>
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAdminRegisterOpen(true)} 
                  className="bg-[#1d4ed8] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleAdminLogout} 
                  className="bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAdminLoginOpen(true)} 
                className="bg-[#1d4ed8] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
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
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="#home" className="text-[#1d4ed8]">Home</a>
            <a href="#about">About</a>
            <a href="#administration">Administration</a>
            <a href="#information">Information</a>
            <a href="#media">Media</a>
            {isAdminLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={() => { setMobileMenuOpen(false); setIsAdminRegisterOpen(true); }} 
                  className="bg-[#1d4ed8] text-white text-left px-3 py-2 rounded-md text-xs font-semibold w-full"
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
                className="bg-[#1d4ed8] text-white text-left px-3 py-2 rounded-md text-xs font-semibold w-full mt-2"
              >
                Admin
              </button>
            )}
          </div>
        )}
      </header>

      {/* HERO SLIDER SECTION */}
      <section id="home" className="relative bg-[#f1f5f9] overflow-hidden h-[440px] sm:h-[500px]">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, idx) => (
            <div key={idx} className="w-full h-full shrink-0 relative bg-slate-200">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-black/20" />
            </div>
          ))}
        </div>

        {/* HERO CARD FLOATING OVERLAY */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl max-w-md border border-white/60 shadow-xl pointer-events-auto">
            <h2 className="text-3xl font-extrabold text-[#1d4ed8] mb-1">{slides[currentSlide].title}</h2>
            <p className="text-xs font-semibold text-[#1d4ed8] mb-4">{slides[currentSlide].titleAmharic}</p>
            <p className="text-sm text-slate-700 font-medium mb-1">{slides[currentSlide].name}</p>
            <p className="text-xs text-slate-500 mb-6">{slides[currentSlide].nameAmharic}</p>
            <button className="bg-[#1d4ed8] hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm">
              Read More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SLIDER CONTROLS */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-slate-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-slate-700 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* SLIDER DOTS */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)} 
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-6 bg-white' : 'w-2 bg-white/60'}`} 
            />
          ))}
        </div>
      </section>

      {/* OTP FORM SECTION */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 text-center">
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">OTP Number</h2>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-Digit OTP Number"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-center text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition-all text-sm font-medium"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 text-center">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1d4ed8] hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50 text-sm"
              >
                {loading ? 'Verifying...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* LATEST NEWS SECTION */}
      <section id="media" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#1e3a8a]">Latest News</h2>
            <p className="text-xs text-slate-400 mt-1">Recent updates, announcements, and press releases.</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 flex justify-end">
                  <div className="rounded-2xl overflow-hidden shadow-md relative group max-w-sm border border-slate-100">
                    <img src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=600" alt="News 1" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                      <span className="text-[10px] text-slate-300 font-medium">June 24, 2026</span>
                      <h4 className="text-sm font-semibold">New National Skills Program Launched</h4>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex w-3.5 h-3.5 rounded-full bg-[#1d4ed8] border-2 border-white shadow -translate-x-1/2 z-10" />
                <div className="md:w-1/2" />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2" />
                <div className="hidden md:flex w-3.5 h-3.5 rounded-full bg-[#1d4ed8] border-2 border-white shadow -translate-x-1/2 z-10" />
                <div className="md:w-1/2 flex justify-start">
                  <div className="rounded-2xl overflow-hidden shadow-md relative group max-w-sm border border-slate-100">
                    <img src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600" alt="News 2" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                      <span className="text-[10px] text-slate-300 font-medium">May 12, 2026</span>
                      <h4 className="text-sm font-semibold">Labor Rights Reform Signed Into Law</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISA INSTRUCTIONS SECTION */}
      <section id="information" className="py-16 bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1e3a8a]">Visa Instructions</h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">Single Visit · Multiple Visit</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {visaInstructions.map((item, i) => (
              <div key={i} className="bg-white p-7 rounded-3xl shadow-xs border border-slate-100 space-y-2">
                <h3 className="text-lg font-bold text-[#1d4ed8] mb-4">{item.title}</h3>
                <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Passport validity:</span> {item.passportValidity}</p>
                <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Entry permit validity:</span> {item.entryPermitValidity}</p>
                <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Stay duration:</span> {item.stayDuration}</p>
                <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Number of entries:</span> {item.numberOfEntries}</p>
                <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Prohibition:</span> {item.prohibition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISA APPLICATION PROCESS SECTION */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1e3a8a]">Visa Application Process</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {processSteps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div key={idx} className="relative flex flex-col items-center">
                  <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-2xl text-center w-full min-h-[220px] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center mb-4 shadow-xs">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-[#1e3a8a] text-sm mb-2">{step.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < processSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 z-10" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VISA PROCESSING TIMELINE SECTION */}
      <section className="py-16 bg-[#1e3a8a] text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-16">Visa Processing Timeline</h2>

          <div className="relative border-l-2 border-blue-400/30 ml-6 md:ml-1/2 space-y-12">
            <div className="relative pl-8 md:-ml-[280px] md:w-[250px] md:text-right">
              <div className="absolute -left-2 md:left-auto md:-right-[11px] top-1 w-4 h-4 rounded-full bg-white shadow-xs" />
              <div className="flex items-center gap-2 md:justify-end">
                <h4 className="font-bold text-base">Application Submitted</h4>
                <FileText className="w-5 h-5 text-blue-200" />
              </div>
              <p className="text-xs text-blue-200 mt-1">Your visa application has been received.</p>
            </div>

            <div className="relative pl-8 md:ml-8 md:w-[250px]">
              <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-white shadow-xs" />
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-200" />
                <h4 className="font-bold text-base">Document Verification</h4>
              </div>
              <p className="text-xs text-blue-200 mt-1">Documents are reviewed by the authorities.</p>
            </div>

            <div className="relative pl-8 md:-ml-[280px] md:w-[250px] md:text-right">
              <div className="absolute -left-2 md:left-auto md:-right-[11px] top-1 w-4 h-4 rounded-full bg-white shadow-xs" />
              <div className="flex items-center gap-2 md:justify-end">
                <h4 className="font-bold text-base">Processing</h4>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-xs text-blue-200 mt-1">Your visa is currently under processing.</p>
            </div>

            <div className="relative pl-8 md:ml-8 md:w-[250px]">
              <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-white shadow-xs" />
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-bold text-base">Visa Approved</h4>
              </div>
              <p className="text-xs text-blue-200 mt-1">Your visa has been approved successfully.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION & BRAND CARDS */}
      <section className="py-16 bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1d4ed8] text-white p-6 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base mb-2">Making a positive difference</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  We are committed to finding new ways of operating more sustainably while supplying products essential for the global transition to a more sustainable future.
                </p>
              </div>
              <a href="#about" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline pt-2">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-[#1d4ed8] text-white p-6 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base mb-2">Over 135 years of resources</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Since 1885, we've played an essential role in improving living standards and facilitating economic growth. Learn more about our history.
                </p>
              </div>
              <a href="#about" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline pt-2">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-[#1d4ed8] text-white p-6 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base mb-2">Delivering for shareholders</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Over the last 12 months our teams have delivered strong and, in some cases, record production. Learn more about our performance.
                </p>
              </div>
              <a href="#about" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline pt-2">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-white border-2 border-[#1d4ed8] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div>
              <h3 className="text-2xl font-extrabold text-[#1e3a8a]">Join Us Today</h3>
              <p className="text-xs text-slate-500 mt-1">Partner with us to shape the future workforce of our nation.</p>
            </div>
            <button className="bg-[#1d4ed8] hover:bg-blue-800 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap">
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1d4ed8] text-white pt-12 pb-6 border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-blue-200" />
                <h4 className="font-bold text-sm">Ministry of Labor and Skills</h4>
              </div>
              <p className="text-blue-100 leading-relaxed">
                Empowering the workforce through skills development, fair labor practices, and inclusive economic opportunity for every citizen.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#administration" className="hover:text-white transition-colors">Administration</a></li>
                <li><a href="#information" className="hover:text-white transition-colors">Information</a></li>
                <li><a href="#media" className="hover:text-white transition-colors">Media</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3 uppercase tracking-wider">Contact Info</h4>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +251 11 000 0000</li>
                <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> info@mols.gov</li>
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Government Ave, Capital City</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-600/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-200">
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors"><Youtube className="w-4 h-4" /></a>
            </div>

            <p className="text-center">
              © 2026 Ministry of Labor and Skills. All rights reserved. · 
              {isAdminLoggedIn ? (
                <button onClick={handleAdminLogout} className="underline hover:text-white ml-1 font-medium">
                  Admin Logout
                </button>
              ) : (
                <button onClick={() => setIsAdminLoginOpen(true)} className="underline hover:text-white ml-1 font-medium">
                  Admin Login
                </button>
              )}
            </p>
          </div>
        </div>
      </footer>

      {/* VERIFICATION RESULT MODAL */}
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
              <div className="w-12 h-12 bg-blue-100 text-[#1d4ed8] rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1e3a8a]">Admin Portal</h3>
              <p className="text-xs text-slate-400 mt-1">Please enter credentials to manage visa records</p>
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
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-[#1d4ed8] focus:outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password</label>
                <input 
                  type="password" 
                  value={adminCredentials.password} 
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-[#1d4ed8] focus:outline-none" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#1d4ed8] hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg shadow-md transition-colors mt-2 text-sm"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN REGISTRATION FORM / MODAL */}
      {isAdminLoggedIn && isAdminRegisterOpen && (
        <AdminRegisterModal 
          onClose={() => setIsAdminRegisterOpen(false)} 
          onLogout={handleAdminLogout} 
        />
      )}
    </div>
  );
}