import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

export default function VisaCardResult({ data, onClose }) {
  if (!data) return null;

  // Construct backend URL base for uploaded images
  const SERVER_URL = 'http://localhost:5000';

  const photoUrl = data.photoUrl 
    ? `${SERVER_URL}${data.photoUrl}` 
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

  const attachedDocUrl = data.attachedDocUrl 
    ? `${SERVER_URL}${data.attachedDocUrl}` 
    : null;

  const visaCardImageUrl = data.visaCardImageUrl 
    ? `${SERVER_URL}${data.visaCardImageUrl}` 
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-50 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        
        {/* Navigation Bar */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-200 text-xs font-semibold text-blue-900">
          <button 
            onClick={onClose} 
            className="flex items-center gap-1.5 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Main Card Header Container */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#124d7d] text-white p-6">
              <h2 className="text-2xl font-bold tracking-tight">Visa Application Status</h2>
              <p className="text-xs text-blue-100 mt-0.5">Official State of Kuwait eVisa Portal</p>
            </div>

            <div className="p-6">
              {/* User Identity Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 shadow-xs shrink-0">
                  <img 
                    src={photoUrl} 
                    alt={data.fullName || "Applicant"} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                    {data.fullName || "MABRE SLESHI MULUYE"}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Nationality: <span className="text-slate-800 font-semibold">{data.nationality || "ETHIOPIA"}</span>
                  </p>
                </div>
              </div>

              {/* Data Field Grid */}
              <div className="space-y-3 text-xs">
                {/* Row 1: Visa Number & Passport */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50/50 border border-blue-100/80 p-3.5 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 font-medium flex justify-between">
                      <span>Visa Number</span>
                      <span className="font-sans">رقم التأشيرة</span>
                    </span>
                    <span className="text-blue-900 font-bold text-sm mt-1">{data.visaNumber || "598080"}</span>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100/80 p-3.5 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 font-medium flex justify-between">
                      <span>Passport</span>
                      <span className="font-sans">رقم الجواز</span>
                    </span>
                    <span className="text-slate-900 font-bold text-sm mt-1">{data.passportNumber || "EQ1723007"}</span>
                  </div>
                </div>

                {/* Row 2: Visa Type */}
                <div className="bg-blue-50/50 border border-blue-100/80 p-3.5 rounded-xl flex flex-col justify-between">
                  <span className="text-[11px] text-slate-500 font-medium flex justify-between">
                    <span>Visa Type</span>
                    <span className="font-sans">نوع التأشيرة</span>
                  </span>
                  <span className="text-slate-900 font-bold text-sm mt-1">{data.visaType || "B - Private Sector Work Visa"}</span>
                </div>

                {/* Row 3: Occupation */}
                <div className="bg-blue-50/50 border border-blue-100/80 p-3.5 rounded-xl flex flex-col justify-between">
                  <span className="text-[11px] text-slate-500 font-medium flex justify-between">
                    <span>Occupation</span>
                    <span className="font-sans">المهنة</span>
                  </span>
                  <span className="text-slate-900 font-bold text-sm mt-1">{data.occupation || "Sell officer"}</span>
                </div>

                {/* Row 4: Gender & Birth Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50/50 border border-blue-100/80 p-3.5 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 font-medium flex justify-between">
                      <span>Gender</span>
                      <span className="font-sans">الجنس</span>
                    </span>
                    <span className="text-slate-900 font-bold text-sm mt-1">
                      {data.gender || "Male"} / {data.gender === "Female" ? "أنثى" : "ذكر"}
                    </span>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100/80 p-3.5 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 font-medium flex justify-between">
                      <span>Birth Date</span>
                      <span className="font-sans">تاريخ الميلاد</span>
                    </span>
                    <span className="text-slate-900 font-bold text-sm mt-1">{data.birthDate || "2003-03-03"}</span>
                  </div>
                </div>

                {/* Row 5: Issue Date & Expiry Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50/50 border border-blue-100/80 p-3.5 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 font-medium flex justify-between">
                      <span>Issue Date</span>
                      <span className="font-sans">تاريخ الإصدار</span>
                    </span>
                    <span className="text-slate-900 font-bold text-sm mt-1">{data.issueDate || "2026-09-16"}</span>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100/80 p-3.5 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] text-slate-500 font-medium flex justify-between">
                      <span>Expiry Date</span>
                      <span className="font-sans">تاريخ الانتهاء</span>
                    </span>
                    <span className="text-amber-600 font-bold text-sm mt-1">{data.expiryDate || "2029-10-19"}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold">
                  <Check className="w-4 h-4 stroke-[3]" /> Approved & Active
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Attached Documents Banner & Image */}
          <div className="text-center pt-2">
            <span className="text-emerald-700 text-xs font-medium">Congratulations</span>
            <h3 className="text-xl font-bold text-blue-950 mb-4">Visa information found</h3>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left">
              <p className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
                <span>Attached Documents</span>
                <span className="font-sans text-slate-500 font-normal">المستندات المرفقة</span>
              </p>
              <div className="border border-slate-200 rounded-xl p-2 max-w-[200px] bg-slate-50">
                {attachedDocUrl ? (
                  <img src={attachedDocUrl} alt="Attached Document" className="w-full h-auto rounded border" />
                ) : (
                  <div className="p-3 bg-white border border-slate-200 rounded text-[10px] text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">IMG_20260916_160347_161.jpg</p>
                    <div className="h-12 bg-slate-100 rounded border border-dashed flex items-center justify-center text-[9px] text-slate-400">
                      Document Preview
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Official Graphic Visa Card / Image Graphic */}
          <div>
            {visaCardImageUrl ? (
              <img src={visaCardImageUrl} alt="Kuwait eVisa Graphic" className="w-full h-auto rounded-xl shadow-md border" />
            ) : (
              /* High-Fidelity Fallback Graphic Card */
              <div className="bg-[#f2f6f9] border border-amber-300/60 rounded-xl p-5 shadow-md relative overflow-hidden text-slate-800">
                {/* Header Graphic */}
                <div className="flex justify-between items-start border-b border-amber-200/80 pb-3 mb-4">
                  <div>
                    <h4 className="text-xs font-extrabold tracking-wider text-blue-950">KUWAIT MINISTRY</h4>
                    <p className="text-[9px] font-semibold text-slate-500 tracking-tight">OF INTERIOR • ELECTRONIC VISA</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-amber-400/30 border border-amber-500 mx-auto flex items-center justify-center text-[9px] font-bold text-amber-900">
                      🇰🇼
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-bold text-blue-950 font-sans">وزارة الداخلية الكويتية</h4>
                    <p className="text-[9px] font-semibold text-slate-500 font-sans">التأشيرة الإلكترونية</p>
                  </div>
                </div>

                {/* Card Fields Body */}
                <div className="grid grid-cols-12 gap-3 text-[10px]">
                  <div className="col-span-4 space-y-2">
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase">FULL NAME • الاسم الكامل</p>
                      <p className="font-extrabold text-slate-900 uppercase leading-tight">{data.fullName || "MABRE SLESHI MULUYE"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase">NATIONALITY • الجنسية</p>
                      <p className="font-bold text-slate-800">{data.nationality || "ETHIOPIA"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase">PASSPORT NO. • رقم الجواز</p>
                      <p className="font-bold text-blue-900">{data.passportNumber || "EQ1723007"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase">OCCUPATION • المهنة</p>
                      <p className="font-bold text-slate-800">{data.occupation || "Sell officer"}</p>
                    </div>
                  </div>

                  {/* Center Photo & Badge */}
                  <div className="col-span-4 flex flex-col items-center justify-start gap-1">
                    <div className="w-20 h-24 rounded border border-slate-300 overflow-hidden shadow-xs bg-slate-200">
                      <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <span className="bg-blue-900 text-white text-[8px] px-2 py-0.5 rounded font-medium tracking-wider">
                      OFFICIAL • رسمي
                    </span>
                  </div>

                  <div className="col-span-4 space-y-2 text-right">
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase">DATE OF BIRTH • تاريخ الميلاد</p>
                      <p className="font-bold text-slate-800">{data.birthDate || "03/03/2003"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase">GENDER • الجنس</p>
                      <p className="font-bold text-slate-800">{data.gender || "Male"} / {data.gender === "Female" ? "أنثى" : "ذكر"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase">ISSUE DATE • تاريخ الإصدار</p>
                      <p className="font-bold text-slate-800">{data.issueDate || "16/09/2026"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500 uppercase">EXPIRY DATE • تاريخ الانتهاء</p>
                      <p className="font-bold text-amber-700">{data.expiryDate || "19/10/2029"}</p>
                    </div>
                  </div>
                </div>

                {/* Machine Readable Zone (MRZ) */}
                <div className="mt-4 pt-2 border-t border-slate-200/80 font-mono text-[9px] tracking-wider text-slate-600 break-all leading-tight">
                  <p>V&lt;MLSMABRE&lt;SLESHI&lt;MULUYE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
                  <p>EQ17230070ETH0303030M2910190&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
                </div>

                {/* Bottom Footer Ribbon */}
                <div className="mt-3 pt-2 border-t border-amber-200/80 flex items-center justify-between text-[9px]">
                  <span className="font-semibold text-slate-600">KUWAIT MINISTRY OF INTERIOR • وزارة الداخلية الكويتية</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                    APPROVED • معتمدة
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}