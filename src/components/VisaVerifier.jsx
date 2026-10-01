import React, { useState } from 'react';
import axios from 'axios';
import { 
  ChevronLeft, ChevronRight, ArrowRight, Phone, Mail, MapPin, 
  Menu, X, FileText, Search, CheckCircle2, Plane, Cog, Globe, ArrowLeft, LogOut, Lock
} from 'lucide-react';
import VisaCardResult from './VisaCardResult';

// Base API URL from Environment Variables (fallback to local if not set)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
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
      const response = await axios.post(`${API_BASE_URL}/api/visa/verify`, { passcode });
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
      // Points to correct admin route and sends 'username'
      const res = await axios.post(`${API_BASE_URL}/api/visa/admin/login`, adminCredentials);
      if (res.data.success) {
        localStorage.setItem('adminToken', 'admin-auth-token');
        setIsAdminLoggedIn(true);
        setIsAdminLoginOpen(false);
        setAdminCredentials({ username: '', password: '' });
      }
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Invalid admin username or password.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    setIsAdminLoginOpen(false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-white">
      {/* SECTION 1: HEADER & HERO SLIDER */}
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
              <button 
                onClick={handleAdminLogout} 
                className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
              >
                Logout
              </button>
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
              <button 
                onClick={() => { setMobileMenuOpen(false); handleAdminLogout(); }} 
                className="bg-red-600 text-white text-left px-3 py-2 rounded-md text-xs font-semibold w-full"
              >
                Logout
              </button>
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

      {/* Hero Carousel */}
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

      {/* SECTION 2: OTP VERIFICATION FORM */}
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

      {/* SECTION 3: LATEST NEWS */}
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

      {/* SECTION 4: VISA INSTRUCTIONS */}
      <section id="information" className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-950">Visa Instructions</h2>
            <p className="text-xs text-slate-500 mt-1">Single Visit • Multiple Visit</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Tourism Visa" },
              { title: "Family Visit Visa" },
              { title: "Government Visa" },
              { title: "Business Visa" }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
                <h3 className="text-lg font-bold text-blue-900 mb-3">{item.title}</h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li><strong className="text-slate-800">Passport validity:</strong> No less than 6 months</li>
                  <li><strong className="text-slate-800">Entry permit validity:</strong> 30 days from the date of issuance</li>
                  <li><strong className="text-slate-800">Stay duration:</strong> No more than 90 days from the date of entry</li>
                  <li><strong className="text-slate-800">Number of entries:</strong> Single entry</li>
                  <li><strong className="text-slate-800">Prohibition:</strong> The visa holder is prohibited from working</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: VISA APPLICATION PROCESS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-950 mb-12">Visa Application Process</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              { icon: FileText, title: "Submit Application", desc: "Fill out the visa form and provide your passport information." },
              { icon: Search, title: "Application Review", desc: "The Ministry of Interior reviews and verifies your details." },
              { icon: CheckCircle2, title: "Visa Approval", desc: "Your visa will be issued after successful verification." },
              { icon: Plane, title: "Travel to Kuwait", desc: "Present your visa and passport at the entry checkpoint." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-blue-950 text-sm mb-2">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: VISA PROCESSING TIMELINE */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Visa Processing Timeline</h2>

          <div className="relative border-l-2 border-blue-500/50 ml-4 sm:ml-1/2 space-y-10 pl-6">
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white" />
              <h4 className="font-bold text-base flex items-center gap-2">Application Submitted <FileText className="w-4 h-4" /></h4>
              <p className="text-xs text-blue-200 mt-1">Your visa application has been received.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white" />
              <h4 className="font-bold text-base flex items-center gap-2">Document Verification <Search className="w-4 h-4" /></h4>
              <p className="text-xs text-blue-200 mt-1">Documents are reviewed by the authorities.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white" />
              <h4 className="font-bold text-base flex items-center gap-2">Processing <Cog className="w-4 h-4" /></h4>
              <p className="text-xs text-blue-200 mt-1">Your visa is currently under processing.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white" />
              <h4 className="font-bold text-base flex items-center gap-2 text-green-400">Visa Approved <CheckCircle2 className="w-4 h-4" /></h4>
              <p className="text-xs text-blue-200 mt-1">Your visa has been approved successfully.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: EXECUTIVE STATEMENT & CARDS */}
      <section id="about" className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs">
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              "Your expertise will add value to the workplace and support ongoing progress."
            </p>
            <p className="font-bold text-blue-950 text-sm">Ahmed Al-Faisal</p>
            <p className="text-xs text-slate-400">CEO</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-700 text-white p-6 rounded-2xl flex flex-col justify-between h-48">
              <div>
                <h4 className="font-bold text-base mb-2">Making a positive difference</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  We are committed to finding new ways of operating more sustainably while supplying products essential for the global transition.
                </p>
              </div>
              <a href="#" className="text-xs font-semibold flex items-center gap-1 hover:underline">Learn more <ArrowRight className="w-3.5 h-3.5" /></a>
            </div>

            <div className="bg-blue-700 text-white p-6 rounded-2xl flex flex-col justify-between h-48">
              <div>
                <h4 className="font-bold text-base mb-2">Over 135 years of resources</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Since 1885, we've played an essential role in improving living standards and facilitating economic growth.
                </p>
              </div>
              <a href="#" className="text-xs font-semibold flex items-center gap-1 hover:underline">Learn more <ArrowRight className="w-3.5 h-3.5" /></a>
            </div>

            <div className="bg-blue-700 text-white p-6 rounded-2xl flex flex-col justify-between h-48">
              <div>
                <h4 className="font-bold text-base mb-2">Delivering for shareholders</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Over the last 12 months our teams have delivered strong and, in some cases, record production.
                </p>
              </div>
              <a href="#" className="text-xs font-semibold flex items-center gap-1 hover:underline">Learn more <ArrowRight className="w-3.5 h-3.5" /></a>
            </div>
          </div>

          <div className="border-2 border-blue-700 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <div>
              <h3 className="text-2xl font-bold text-blue-950">Join Us Today</h3>
              <p className="text-xs text-slate-500 mt-1">Partner with us to shape the future workforce of our nation.</p>
            </div>
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap">
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: FOOTER */}
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
                <label className="block text-slate-700 font-semibold mb-1">Username</label>
                <input 
                  type="text" 
                  value={adminCredentials.username} 
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })} 
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
      {isAdminLoggedIn && (
        <AdminRegisterModal 
          onClose={() => setIsAdminLoggedIn(false)} 
          onLogout={handleAdminLogout} 
        />
      )}
    </div>
  );
}

{/* ADMIN REGISTER FORM COMPONENT */}
function AdminRegisterModal({ onClose, onLogout }) {
  const [formData, setFormData] = useState({
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
  });

  const [files, setFiles] = useState({
    photo: null,
    attachedDoc: null,
    visaCardImage: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
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
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(`${API_BASE_URL}/api/visa/register`, submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Visa Record Registered Successfully!' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error registering visa record.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 my-8 border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b pb-4 text-xs font-semibold">
          <button onClick={onClose} className="text-blue-900 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> ← Back to Home
          </button>
          <button onClick={onLogout} className="text-red-600 hover:underline flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <h2 className="text-2xl font-bold text-blue-950 text-center mb-6">Register Visa Record</h2>

        {message.text && (
          <div className={`p-3 text-xs rounded-lg mb-4 text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nationality</label>
              <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Access Code / OTP (Passcode)</label>
              <input type="text" name="passcode" value={formData.passcode} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Visa Number</label>
              <input type="text" name="visaNumber" value={formData.visaNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Passport Number</label>
              <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Visa Type</label>
              <input type="text" name="visaType" value={formData.visaType} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Occupation</label>
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Birth Date</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Issue Date</label>
              <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-blue-600" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Applicant Photo Image (Upload from Device)</label>
            <input type="file" name="photo" onChange={handleFileChange} accept="image/*" className="w-full p-1.5 border rounded-lg border-slate-300" />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Attached Document Image (Upload from Device)</label>
            <input type="file" name="attachedDoc" onChange={handleFileChange} accept="image/*" className="w-full p-1.5 border rounded-lg border-slate-300" />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Bottom Visa Card Graphic Image (Upload from Device)</label>
            <input type="file" name="visaCardImage" onChange={handleFileChange} accept="image/*" className="w-full p-1.5 border rounded-lg border-slate-300" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-lg shadow mt-6 transition-colors">
            {loading ? 'Saving...' : 'Save Visa Record'}
          </button>
        </form>
      </div>
    </div>
  );
}