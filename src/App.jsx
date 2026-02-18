import React, { useState, useEffect } from 'react';
import { 
 Watch, Search, Plus, Camera, MessageCircle, CheckCircle, Clock, Shield, 
 Menu, X, LogOut, User, FileText, Wrench, DollarSign, BarChart3, Lock, Smartphone, 
 Send, AlertTriangle, History, Box, Filter, ChevronRight, CreditCard, Check, 
 Printer, ArrowLeft, MapPin, QrCode, ClipboardCheck, Settings, Bell, Calendar,
 PlayCircle, PauseCircle, CheckSquare, List, Layout, Users, Package,
 TrendingUp, BookOpen, Briefcase, BellRing, Moon, Globe,
 CalendarDays, ShoppingBag, Truck, Receipt, Database, Activity, LayoutGrid, AlertCircle,
 Home, Battery, Wifi, Signal, MoreHorizontal, UserCircle, LogOut as LogOutIcon
} from 'lucide-react';

// --- 1. CONSTANTS & DATA MODELS ---

const ROLES = {
 ADVISOR: 'Service Advisor',
 TECH: 'Watchmaker',
 MANAGER: 'Workshop Manager',
 CLIENT: 'Client'
};

const SOP_STAGES = [
 { id: 'intake', label: 'Intake', role: ROLES.ADVISOR },
 { id: 'diagnosis', label: 'Diagnosis', role: ROLES.TECH },
 { id: 'approval', label: 'Approval', role: ROLES.ADVISOR },
 { id: 'repair', label: 'Repair', role: ROLES.TECH },
 { id: 'qc', label: 'Quality Control', role: ROLES.TECH },
 { id: 'ready', label: 'Ready', role: ROLES.ADVISOR }
];

const MOCK_JOBS = [
 {
  id: 'JOB-1024',
  stage: 'diagnosis',
  customer: 'Ali Al-Salem',
  mobile: '+965 9999 1234',
  brand: 'Rolex',
  model: 'Submariner Date',
  serial: '8293XJ2',
  intakeDate: '2026-01-20',
  technician: 'Jean-Pierre',
  quoteAmount: 120.000,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400',
  description: 'Running fast, bezel stuck.',
  priority: 'Normal',
  history: [{ stage: 'intake', date: '2026-01-20 09:30', user: 'Reception', note: 'Received with box.' }]
 },
 {
  id: 'JOB-1025',
  stage: 'approval',
  customer: 'Sarah Kuwaiti',
  mobile: '+965 6666 5678',
  brand: 'Chopard',
  model: 'Happy Diamonds',
  serial: 'CH9921',
  intakeDate: '2026-01-21',
  technician: 'Ahmed',
  quoteAmount: 450.000,
    image: 'https://images.unsplash.com/photo-1594576722512-582bcd46fba3?auto=format&fit=crop&q=80&w=400',
  description: 'Polishing required, stone loose.',
  priority: 'VIP',
  history: [{ stage: 'intake', date: '2026-01-21 10:00', user: 'Reception' }]
 },
 {
  id: 'JOB-1026',
  stage: 'ready',
  customer: 'Fahad Al-Otaibi',
  mobile: '+965 5555 9876',
  brand: 'Patek Philippe',
  model: 'Nautilus',
  serial: 'PP-5711',
  intakeDate: '2026-01-15',
  technician: 'Jean-Pierre',
  quoteAmount: 0,
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=400',
  description: 'Warranty service. Routine check.',
  priority: 'VIP',
  history: [{ stage: 'intake', date: '2026-01-15', user: 'Reception' }]
 }
];

const MOCK_INVENTORY = [
 { id: 'P-3135-MS', name: 'Mainspring (Caliber 3135)', stock: 15, min: 5, price: 45.000, loc: 'A-12', status: 'OK' },
 { id: 'P-SAP-295', name: 'Sapphire Crystal (Ref 25-295)', stock: 2, min: 3, price: 120.000, loc: 'B-04', alert: true, status: 'LOW' },
 { id: 'P-Cr-Au', name: 'Crown Tube (Gold)', stock: 8, min: 5, price: 85.000, loc: 'A-09', status: 'OK' },
 { id: 'P-GSK-Sub', name: 'Case Back Gasket', stock: 50, min: 10, price: 5.000, loc: 'C-01', status: 'OK' }
];

const MOCK_MESSAGES = [
 { id: 1, from: 'Sarah Kuwaiti', text: 'Hi, is my Chopard ready yet?', time: '10:30 AM', unread: true },
 { id: 2, from: 'Ali Al-Salem', text: 'Approved the quote. Thanks.', time: 'Yesterday', unread: false }
];

const MOCK_CLIENTS = [
 { id: 'C-1001', name: 'Ali Al-Salem', mobile: '+965 9999 1234', tier: 'Gold', spend: 12500, jobs: 4 },
 { id: 'C-1002', name: 'Sarah Kuwaiti', mobile: '+965 6666 5678', tier: 'Platinum', spend: 45000, jobs: 12 },
 { id: 'C-1003', name: 'Fahad Al-Otaibi', mobile: '+965 5555 9876', tier: 'Silver', spend: 3200, jobs: 1 }
];

const MOCK_SUPPLIERS = [
  { id: 'SUP-01', name: 'Rolex Geneva SA', type: 'Parts', contact: 'parts@rolex.com' },
  { id: 'SUP-02', name: 'Bergeon & Cie', type: 'Tools', contact: 'sales@bergeon.ch' }
];

// --- 2. UTILS ---

const getStageIndex = (stageId) => SOP_STAGES.findIndex(s => s.id === stageId);

const useNavigation = (initialView = 'dashboard') => {
 const [history, setHistory] = useState([{ view: initialView, params: {} }]);
 const current = history[history.length - 1];
 const navigate = (view, params = {}) => setHistory([...history, { view, params }]);
 const back = () => { if (history.length > 1) setHistory(history.slice(0, -1)); };
 return { view: current.view, params: current.params, navigate, back };
};

// --- 3. SHARED COMPONENTS ---

const SOPStepper = ({ currentStage }) => {
 const currentIdx = getStageIndex(currentStage);
 return (
  <div className="w-full py-4 overflow-x-auto">
   <div className="flex items-center justify-between min-w-[600px] px-2">
    {SOP_STAGES.map((step, idx) => {
     const isActive = idx === currentIdx;
     const isCompleted = idx < currentIdx;
     return (
      <div key={step.id} className="flex flex-col items-center relative flex-1 group">
       {idx !== 0 && <div className={`absolute top-4 -left-[50%] right-[50%] h-1 ${isCompleted ? 'bg-amber-400' : 'bg-slate-200'}`} />}
       <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold text-xs transition-all duration-300 border-2 ${isActive ? 'bg-slate-900 text-amber-400 border-slate-900 scale-110 shadow-lg' : isCompleted ? 'bg-amber-400 text-slate-900 border-amber-400' : 'bg-white text-slate-300 border-slate-200'}`}>
        {isCompleted ? <Check size={14} strokeWidth={4}/> : idx + 1}
       </div>
       <span className={`mt-2 text-xs font-medium uppercase tracking-wider ${isActive ? 'text-slate-900 font-bold' : isCompleted ? 'text-amber-600' : 'text-slate-300'}`}>{step.label}</span>
      </div>
     );
    })}
   </div>
  </div>
 );
};

const SimpleTable = ({ title, headers, rows, actionLabel, navigate }) => (
 <div className="p-8 animate-in fade-in">
  <button onClick={() => navigate && navigate('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back to Dashboard</button>
  <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-slate-900">{title}</h1><button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> {actionLabel}</button></div>
  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
   <table className="w-full text-left">
    <thead className="bg-slate-50 border-b"><tr>{headers.map(h => <th key={h} className="p-4 text-xs font-bold text-slate-500 uppercase">{h}</th>)}<th className="p-4"></th></tr></thead>
    <tbody>{rows.map((row, i) => <tr key={i} className="border-b last:border-0 hover:bg-slate-50">{Object.values(row).map((cell, j) => <td key={j} className="p-4 text-sm text-slate-700">{typeof cell === 'object' ? JSON.stringify(cell) : cell}</td>)}<td className="p-4 text-right"><button className="text-blue-600 font-bold text-xs hover:underline">View</button></td></tr>)}</tbody>
   </table>
  </div>
 </div>
);

// --- 4. MOBILE COMPONENTS & SCREENS (Advisor) ---

const MobileFrame = ({ children, onBack, title, footer, headerRight }) => (
 <div className="relative w-[393px] h-[852px] bg-slate-50 rounded-[55px] border-[8px] border-slate-900 shadow-2xl overflow-hidden flex flex-col font-sans mx-auto">
  <div className="absolute top-0 left-0 w-full h-[54px] z-50 flex justify-between items-center px-8 pt-3 text-black">
   <span className="font-bold text-sm tracking-wide">9:41</span>
   <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[126px] h-[37px] bg-black rounded-full flex items-center justify-center"></div>
   <div className="flex gap-1.5 items-center">
    <Signal size={16} fill="black" />
    <Wifi size={16} />
    <Battery size={20} />
   </div>
  </div>
   
  <div className="flex-1 overflow-y-auto no-scrollbar pt-14 bg-slate-50 relative">
   {title && (
    <div className="px-6 pb-4 pt-2 flex items-center justify-between">
     <div className="flex items-center gap-2">
      {onBack && <button onClick={onBack}><ArrowLeft size={24} className="text-slate-900"/></button>}
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
     </div>
     {headerRight}
    </div>
   )}
   <div className="pb-32"> {/* Added padding bottom to prevent content being hidden by footer */}
    {children}
   </div>
  </div>

  {/* Fixed Footer Container */}
  {footer && (
   <div className="absolute bottom-0 w-full z-40">
    {footer}
   </div>
  )}

  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-slate-900/20 rounded-full z-50 pointer-events-none"></div>
 </div>
);

const MobileBottomNav = ({ active, navigate }) => (
 <div className="w-full h-[88px] bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-around items-start pt-4 pb-8">
  <button onClick={() => navigate('dashboard')} className={`flex flex-col items-center gap-1 ${active === 'dashboard' ? 'text-amber-500' : 'text-slate-400'}`}>
   <Home size={26} strokeWidth={active === 'dashboard' ? 2.5 : 2} fill={active === 'dashboard' ? "currentColor" : "none"} className={active === 'dashboard' ? "text-amber-500/20" : ""}/>
   <span className="text-[10px] font-medium">Home</span>
  </button>
  <button onClick={() => navigate('intake')} className={`flex flex-col items-center gap-1 ${active === 'intake' ? 'text-amber-500' : 'text-slate-400'}`}>
   <div className="bg-slate-900 text-white p-3 rounded-full -mt-6 shadow-lg border-4 border-slate-50">
    <Plus size={24} />
   </div>
   <span className="text-[10px] font-medium mt-1">Intake</span>
  </button>
  <button onClick={() => navigate('messages')} className={`flex flex-col items-center gap-1 ${active === 'messages' ? 'text-amber-500' : 'text-slate-400'}`}>
   <div className="relative">
    <MessageCircle size={26} strokeWidth={active === 'messages' ? 2.5 : 2} />
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">2</div>
   </div>
   <span className="text-[10px] font-medium">Chats</span>
  </button>
 </div>
);

const MobileAdvisorHome = ({ navigate, userRole }) => (
 <MobileFrame 
  title="Concierge" 
  footer={<MobileBottomNav active="dashboard" navigate={navigate} />}
  headerRight={
   <button onClick={() => navigate('profile')} className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors">
    <User size={20} className="text-slate-700"/>
   </button>
  }
 >
  <div className="px-6 space-y-6">
   <div className="bg-slate-200/50 p-3 rounded-2xl flex items-center gap-3">
    <Search className="text-slate-400" size={20}/>
    <input type="text" placeholder="Search Client or Job ID" className="bg-transparent w-full outline-none text-slate-800 placeholder-slate-400 font-medium"/>
   </div>
   <div className="grid grid-cols-2 gap-4">
    <div onClick={() => navigate('client_registry')} className="bg-slate-900 text-white p-5 rounded-3xl flex flex-col justify-between h-32 shadow-lg shadow-slate-300 active:scale-95 transition-transform cursor-pointer">
     <Users size={28} className="text-amber-400"/>
     <div><p className="text-2xl font-bold">Clients</p><p className="text-xs text-slate-400">Lookup & CRM</p></div>
    </div>
    <div onClick={() => navigate('delivery', {job: MOCK_JOBS[2]})} className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col justify-between h-32 shadow-sm active:scale-95 transition-transform cursor-pointer">
     <div className="flex justify-between"><CheckCircle size={28} className="text-green-500"/><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">1 Ready</span></div>
     <div><p className="text-lg font-bold text-slate-800 leading-tight">Ready for Pickup</p></div>
    </div>
   </div>
    
   {/* Quick Action for Invoices */}
   <div onClick={() => navigate('invoices')} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between active:bg-slate-100 cursor-pointer">
     <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100"><Receipt size={20} className="text-slate-700"/></div>
      <span className="font-bold text-slate-700">Recent Invoices</span>
     </div>
     <ChevronRight size={20} className="text-slate-400"/>
   </div>

   <div>
    <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-slate-800">Active Jobs</h2><button className="text-amber-600 text-sm font-bold">See All</button></div>
    <div className="space-y-4">
     {MOCK_JOBS.map(job => (
      <div key={job.id} onClick={() => navigate('job_card', {job})} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center active:scale-95 transition-transform">
       <img src={job.image} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
       <div className="flex-1">
        <div className="flex justify-between items-start"><h3 className="font-bold text-slate-900">{job.brand}</h3><span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${job.stage === 'ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{job.stage}</span></div>
        <p className="text-xs text-slate-500">{job.model}</p>
        <p className="text-xs font-medium text-slate-800 mt-1">{job.customer}</p>
       </div>
       <ChevronRight size={20} className="text-slate-300"/>
      </div>
     ))}
    </div>
   </div>
  </div>
 </MobileFrame>
);

const MobileProfile = ({ navigate, setCurrentUser }) => (
 <MobileFrame title="My Profile" onBack={() => navigate('dashboard')} footer={<MobileBottomNav active="dashboard" navigate={navigate} />}>
   <div className="px-6 space-y-6 pt-4">
    {/* Profile Header */}
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center text-3xl font-serif mb-4 shadow-xl">AA</div>
      <h2 className="text-2xl font-bold text-slate-900">Ahmed Al-Sabah</h2>
      <p className="text-slate-500 font-medium">Service Advisor</p>
      <span className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
    </div>

    {/* Outlet Card - Main Feature */}
    <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin size={80}/></div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Current Assignment</p>
      <h3 className="text-xl font-bold mb-1">Trafalgar Flagship</h3>
      <p className="text-sm text-slate-300 mb-4">The Avenues Mall, Phase IV</p>
      <div className="flex gap-2">
       <span className="px-2 py-1 bg-white/20 rounded text-[10px]">ID: TFG-ADV-04</span>
       <span className="px-2 py-1 bg-white/20 rounded text-[10px]">Zone A</span>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
       <p className="text-2xl font-bold text-slate-900">42</p>
       <p className="text-xs text-slate-500 uppercase">Jobs This Month</p>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
       <p className="text-2xl font-bold text-amber-500">4.9</p>
       <p className="text-xs text-slate-500 uppercase">Client Rating</p>
      </div>
    </div>

    {/* Settings List */}
    <div className="space-y-2">
      <button className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between active:bg-slate-50">
       <div className="flex items-center gap-3"><Settings size={20} className="text-slate-400"/><span className="font-bold text-slate-700">App Settings</span></div>
       <ChevronRight size={20} className="text-slate-300"/>
      </button>
      <button className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between active:bg-slate-50">
       <div className="flex items-center gap-3"><Shield size={20} className="text-slate-400"/><span className="font-bold text-slate-700">Security</span></div>
       <ChevronRight size={20} className="text-slate-300"/>
      </button>
    </div>

    <button onClick={() => setCurrentUser(null)} className="w-full py-4 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 rounded-2xl transition-colors">
      <LogOutIcon size={20}/> Sign Out
    </button>
   </div>
 </MobileFrame>
);

const MobileIntake = ({ navigate, back }) => {
 const [step, setStep] = useState(1);
 return (
  <MobileFrame onBack={step === 1 ? () => navigate('dashboard') : () => setStep(step - 1)} footer={<MobileBottomNav active="intake" navigate={navigate} />}>
   <div className="px-6 min-h-full pb-24">
    <div className="flex gap-2 mb-8 mt-2">
     {[1,2,3].map(i => <div key={i} className={`h-1.5 rounded-full flex-1 ${step >= i ? 'bg-amber-500' : 'bg-slate-200'}`}></div>)}
    </div>
    {step === 1 && (
     <div className="space-y-6 animate-in slide-in-from-right">
      <div><h1 className="text-3xl font-bold text-slate-900">Who is this for?</h1><p className="text-slate-500 mt-2">Search for an existing client or scan their digital ID.</p></div>
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center"><Search className="ml-3 text-slate-400"/><input className="w-full p-4 outline-none font-medium" placeholder="Mobile Number..."/></div>
      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest my-4">OR</div>
      <button className="w-full py-12 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-colors"><QrCode size={32} /><span className="font-bold">Scan Digital ID</span></button>
      <div className="pt-8"><button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-300 active:scale-95 transition-transform">Next Step</button></div>
     </div>
    )}
    {step === 2 && (
     <div className="space-y-6 animate-in slide-in-from-right">
      <div><h1 className="text-3xl font-bold text-slate-900">Watch Details</h1><p className="text-slate-500 mt-2">Capture the asset information.</p></div>
      <div className="space-y-4">
       <div><label className="text-xs font-bold text-slate-500 uppercase ml-1">Brand</label><select className="w-full p-4 bg-white border border-slate-200 rounded-2xl mt-1 font-bold outline-none"><option>Rolex</option><option>Patek Philippe</option></select></div>
       <div><label className="text-xs font-bold text-slate-500 uppercase ml-1">Model Ref</label><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl mt-1 font-medium outline-none" placeholder="e.g. 116610LN"/></div>
       <div><label className="text-xs font-bold text-slate-500 uppercase ml-1">Serial Number</label><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl mt-1 font-medium outline-none" placeholder="Case Serial..."/></div>
      </div>
      <div className="bg-slate-100 h-40 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 text-slate-500 active:bg-slate-200"><Camera size={32} className="mb-2"/><span className="font-bold text-sm">Capture 360° Video</span></div>
      <div className="pt-4"><button onClick={() => setStep(3)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-300 active:scale-95 transition-transform">Review & Sign</button></div>
     </div>
    )}
    {step === 3 && (
     <div className="space-y-8 animate-in slide-in-from-right text-center pt-10">
      <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200"><Check size={48} strokeWidth={3}/></div>
      <div><h1 className="text-3xl font-bold text-slate-900">Success!</h1><p className="text-slate-500 mt-2">Job <span className="font-mono font-bold text-slate-900">#1030</span> has been created.</p></div>
      <button onClick={() => navigate('dashboard')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-300 active:scale-95 transition-transform">Done</button>
     </div>
    )}
   </div>
  </MobileFrame>
 );
};

const MobileJobCard = ({ job, navigate }) => (
 <MobileFrame onBack={() => navigate('dashboard')} title="Job Details" footer={<MobileBottomNav active="dashboard" navigate={navigate} />}>
  <div className="px-6 pb-24">
   <div className="w-full h-64 bg-slate-100 rounded-3xl overflow-hidden mb-6 shadow-md relative"><img src={job.image} className="w-full h-full object-cover"/><div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide">{job.stage}</div></div>
   <div className="space-y-1 mb-8"><h2 className="text-2xl font-bold text-slate-900">{job.brand} {job.model}</h2><p className="text-slate-500 font-medium">{job.customer}</p><p className="text-slate-400 text-sm font-mono">{job.serial} • {job.id}</p></div>
   <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6"><h3 className="font-bold text-slate-900 mb-4">Service Status</h3><div className="relative pl-4 space-y-6"><div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-slate-100"></div>{SOP_STAGES.map((s, i) => { const isDone = i <= getStageIndex(job.stage); return (<div key={s.id} className="relative flex items-center gap-4 z-10"><div className={`w-3 h-3 rounded-full outline outline-4 ${isDone ? 'bg-slate-900 outline-slate-900' : 'bg-white outline-slate-200'}`}></div><span className={`text-sm ${isDone ? 'font-bold text-slate-900' : 'text-slate-400'}`}>{s.label}</span></div>) })}</div></div>
   <div className="grid grid-cols-2 gap-4"><button className="bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-bold flex flex-col items-center gap-2 active:bg-slate-50"><Printer size={24}/><span className="text-xs">Print Card</span></button>{job.stage === 'ready' && <button className="bg-green-500 text-white py-4 rounded-2xl font-bold flex flex-col items-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-transform"><CheckCircle size={24}/><span className="text-xs">Handover</span></button>}</div>
  </div>
 </MobileFrame>
);

const MobileMessages = ({ navigate }) => (
 <MobileFrame title="Chats" onBack={() => navigate('dashboard')} footer={<MobileBottomNav active="messages" navigate={navigate} />}>
  <div className="px-4 pb-24">
   <div className="space-y-2">
    {MOCK_MESSAGES.map(m => (
     <div key={m.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center active:bg-slate-50"><div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg">{m.from.charAt(0)}</div><div className="flex-1"><div className="flex justify-between items-center mb-1"><h3 className="font-bold text-slate-900">{m.from}</h3><span className="text-xs text-slate-400">{m.time}</span></div><p className={`text-sm truncate ${m.unread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{m.text}</p></div>{m.unread && <div className="w-3 h-3 bg-red-500 rounded-full"></div>}</div>
    ))}
   </div>
  </div>
  <MobileBottomNav active="messages" navigate={navigate} />
 </MobileFrame>
);

const MobileClientRegistry = ({ navigate }) => (
 <MobileFrame title="Clients" onBack={() => navigate('dashboard')} footer={<MobileBottomNav active="dashboard" navigate={navigate} />}>
  <div className="px-4">
   {/* Search */}
   <div className="bg-slate-100 p-3 rounded-xl flex items-center gap-3 mb-4">
    <Search className="text-slate-400" size={20}/>
    <input type="text" placeholder="Search clients..." className="bg-transparent w-full outline-none text-slate-800 placeholder-slate-400"/>
   </div>
    
   <div className="space-y-3">
    {MOCK_CLIENTS.map(client => (
     <div key={client.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center active:bg-slate-50">
      <div>
       <h3 className="font-bold text-slate-900">{client.name}</h3>
       <p className="text-xs text-slate-500">{client.mobile}</p>
      </div>
      <div className="text-right">
       <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${client.tier === 'Platinum' ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-800'}`}>{client.tier}</span>
       <p className="text-xs text-slate-400 mt-1">{client.jobs} Jobs</p>
      </div>
     </div>
    ))}
   </div>
    
   <button className="absolute bottom-24 right-6 bg-slate-900 text-white p-4 rounded-full shadow-xl shadow-slate-400 active:scale-95 transition-transform" onClick={() => navigate('intake')}>
    <Plus size={24}/>
   </button>
  </div>
 </MobileFrame>
);

const MobileInvoices = ({ navigate }) => (
 <MobileFrame title="Invoices" onBack={() => navigate('dashboard')} footer={<MobileBottomNav active="dashboard" navigate={navigate} />}>
  <div className="px-4 pt-2">
    <div className="space-y-3">
     {MOCK_JOBS.filter(j => j.quoteAmount > 0).map(job => (
       <div key={job.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <p className="font-bold text-slate-900">{job.customer}</p>
          <p className="text-xs text-slate-500">Job: {job.id}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900">{job.quoteAmount} KWD</p>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">PAID</span>
        </div>
       </div>
     ))}
     {/* Mock Past Invoices */}
     <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center opacity-75">
       <div><p className="font-bold text-slate-900">Jassim Al-Kharafi</p><p className="text-xs text-slate-500">Job: JOB-0992</p></div>
       <div className="text-right"><p className="font-bold text-slate-900">12.500 KWD</p><span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">ARCHIVED</span></div>
     </div>
    </div>
  </div>
 </MobileFrame>
);

const MobileDelivery = ({ job, navigate }) => (
 <MobileFrame title="Handover" onBack={() => navigate('dashboard')} footer={<MobileBottomNav active="dashboard" navigate={navigate} />}>
  <div className="px-6 pt-4">
    <div className="bg-slate-900 text-white p-6 rounded-3xl text-center mb-8 shadow-xl shadow-slate-200">
     <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
       <Lock size={32} className="text-amber-400"/>
     </div>
     <h2 className="text-2xl font-bold">Secure Release</h2>
     <p className="text-slate-400 text-sm mt-1">{job?.brand || 'Rolex'} {job?.model || 'Submariner'}</p>
    </div>

    <div className="space-y-6">
     <div>
       <label className="text-xs font-bold text-slate-500 uppercase ml-1">Client Verification</label>
       <p className="text-sm text-slate-400 mb-2 ml-1">Ask {job?.customer || 'Client'} for the 4-digit OTP code.</p>
       <div className="flex gap-3">
        {[1,2,3,4].map(i => <input key={i} type="number" className="w-full h-16 bg-white border-2 border-slate-200 rounded-2xl text-center text-2xl font-bold focus:border-amber-400 outline-none transition-colors" />)}
       </div>
     </div>

     <div className="bg-white p-4 rounded-2xl border border-slate-100">
       <h3 className="font-bold text-slate-900 mb-2 text-sm">Checklist</h3>
       <label className="flex items-center gap-3 p-2 border-b border-slate-50"><input type="checkbox" className="w-5 h-5 accent-slate-900" defaultChecked/> <span className="text-sm">Payment Confirmed</span></label>
       <label className="flex items-center gap-3 p-2 border-b border-slate-50"><input type="checkbox" className="w-5 h-5 accent-slate-900"/> <span className="text-sm">Warranty Card Stamped</span></label>
       <label className="flex items-center gap-3 p-2"><input type="checkbox" className="w-5 h-5 accent-slate-900"/> <span className="text-sm">Old Parts Returned</span></label>
     </div>

     <button onClick={() => {alert("Handover Complete"); navigate('dashboard')}} className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
       <CheckCircle /> Confirm Handover
     </button>
    </div>
  </div>
 </MobileFrame>
);

// --- 5. DESKTOP SCREENS & DASHBOARDS ---

const LoginScreen = ({ onLogin }) => (
 <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
  <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full flex flex-col md:flex-row overflow-hidden relative">
   <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
   <div className="md:w-1/2 flex flex-col justify-center items-start space-y-6 p-4 border-r border-slate-100">
    <div className="flex items-center space-x-3 mb-4">
     <div className="bg-slate-900 p-3 rounded-xl"><Watch className="text-amber-400 w-8 h-8" /></div>
     <div><h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">TRAFALGAR</h1><p className="text-xs tracking-[0.2em] text-slate-500 uppercase font-medium">Service Hub</p></div>
    </div>
    <h2 className="text-2xl font-semibold text-slate-800">Select Access Level</h2>
   </div>
   <div className="md:w-1/2 flex flex-col justify-center p-4 gap-3">
    {Object.values(ROLES).map((role) => (
     <button key={role} onClick={() => onLogin(role)} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-amber-400 hover:shadow-md transition-all group bg-white">
      <span className="font-medium text-slate-700 group-hover:text-amber-600">{role}</span>
      <div className="bg-slate-100 p-2 rounded-full group-hover:bg-amber-100 transition-colors"><User size={20} className="text-slate-600 group-hover:text-amber-600" /></div>
     </button>
    ))}
   </div>
  </div>
 </div>
);

const JobCardScreen = ({ job, back, navigate }) => (
 <div className="p-8 animate-in zoom-in-95 duration-200 max-w-5xl mx-auto">
  <div className="flex items-center justify-between mb-6 no-print">
    <button onClick={back} className="flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back to List</button>
    <div className="flex gap-2">
     <button onClick={() => window.print()} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 font-medium"><Printer size={18}/> Print</button>
     <button onClick={() => navigate('tech_workbench', { job })} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 font-bold shadow-lg"><Wrench size={18}/> Workbench</button>
    </div>
  </div>
  <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-black">
    <div className="h-2 bg-gradient-to-r from-slate-900 via-amber-500 to-slate-900"></div>
    <div className="p-8">
     <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
       <div className="flex items-center gap-4">
        <div className="bg-slate-900 text-white p-3 rounded-lg"><Watch size={32} className="text-amber-400"/></div>
        <div><h1 className="text-3xl font-serif font-bold text-slate-900">JOB ORDER</h1><p className="text-slate-500 font-mono tracking-widest">{job.id}</p></div>
       </div>
       <div className="text-right">
        <div className="inline-block bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 mb-2"><p className="text-xs text-slate-500 uppercase font-bold">Status</p><p className="text-lg font-bold text-amber-600 uppercase">{SOP_STAGES.find(s => s.id === job.stage)?.label}</p></div>
        <p className="text-sm text-slate-400">Date: {job.intakeDate}</p>
       </div>
     </div>
     <SOPStepper currentStage={job.stage} />
     <div className="grid grid-cols-2 gap-8 mt-10">
       <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Client</h3>
        <p className="font-bold text-slate-900 text-lg">{job.customer}</p>
        <p className="font-mono text-slate-500">{job.mobile}</p>
       </div>
       <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Asset</h3>
        <p className="font-bold text-slate-900 text-lg">{job.brand} {job.model}</p>
        <p className="font-mono text-slate-500">SN: {job.serial}</p>
       </div>
     </div>
    </div>
  </div>
 </div>
);

const TechWorkbench = ({ job, navigate, back }) => {
 const [activeTab, setActiveTab] = useState('diagnosis');
 const [timerRunning, setTimerRunning] = useState(false);
 const [time, setTime] = useState(0);

 useEffect(() => {
   let interval;
   if (timerRunning) interval = setInterval(() => setTime(t => t+1), 1000);
   return () => clearInterval(interval);
 }, [timerRunning]);

 const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  
 return (
  <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom-5">
    <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
     <div className="flex items-center gap-4"><button onClick={back} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button><div><h1 className="font-bold text-lg">{job.brand} {job.model}</h1><p className="text-xs text-slate-400 font-mono">{job.id}</p></div></div>
     <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
       {[{id: 'diagnosis', label: 'Diagnosis'}, {id: 'repair', label: 'Repair'}, {id: 'qc', label: 'QC'}].map(tab => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === tab.id ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>{tab.label}</button>
       ))}
     </div>
     <div className="flex items-center gap-4">
       <div className="bg-slate-800 px-3 py-1.5 rounded flex items-center gap-3 border border-slate-700"><span className="font-mono font-bold text-amber-400">{formatTime(time)}</span><button onClick={() => setTimerRunning(!timerRunning)}>{timerRunning ? <PauseCircle className="text-red-500"/> : <PlayCircle className="text-green-500"/>}</button></div>
       <button onClick={() => navigate('dashboard')} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm">Complete Stage</button>
     </div>
    </div>
    <div className="flex-1 flex overflow-hidden">
     <div className="w-80 bg-slate-50 border-r p-4"><img src={job.image} className="w-full h-48 object-cover rounded-lg shadow-sm mb-4"/><div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900"><p className="font-bold">Note:</p><p>{job.description}</p></div></div>
     <div className="flex-1 bg-white p-8"><h2 className="text-2xl font-bold text-slate-800 capitalize mb-4">{activeTab} Phase</h2><textarea className="w-full h-64 border rounded-xl p-4" placeholder={`Enter ${activeTab} details...`}></textarea></div>
    </div>
  </div>
 );
};

const ManagerDashboard = ({ navigate }) => (
 <div className="p-8 animate-in fade-in">
  <div className="flex justify-between items-center mb-8">
   <div><h1 className="text-2xl font-bold text-slate-900">Workshop Overview</h1><p className="text-slate-500">Financials & Performance Metrics</p></div>
   <div className="flex gap-2">
    <button onClick={() => navigate('system_audit')} className="bg-white border text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50">Audit Log</button>
    <button onClick={() => navigate('staff')} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">Manage Staff</button>
   </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
   {[
    { label: 'Total Revenue', val: '45,250 KWD', icon: DollarSign, color: 'text-green-600' },
    { label: 'Avg Turnaround', val: '14 Days', icon: Clock, color: 'text-blue-600' },
    { label: 'Efficiency Rate', val: '94%', icon: BarChart3, color: 'text-purple-600' },
    { label: 'Pending Approvals', val: '3', icon: Lock, color: 'text-red-600' },
   ].map((stat, i) => (
    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
     <div><p className="text-sm text-slate-500 mb-1">{stat.label}</p><h3 className="text-2xl font-bold text-slate-800">{stat.val}</h3></div>
     <stat.icon className={`${stat.color} opacity-80`} size={28} />
    </div>
   ))}
  </div>

  <div className="grid grid-cols-2 gap-8 mb-8">
   <div className="bg-white p-6 rounded-xl border border-slate-200">
    <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-slate-800">Inventory Alerts</h3><button onClick={() => navigate('inventory')} className="text-sm text-blue-600 hover:underline">Manage All</button></div>
    <table className="w-full text-sm"><tbody>{MOCK_INVENTORY.slice(0,3).map(p => <tr key={p.id} className="border-b"><td className="p-2">{p.name}</td><td className="p-2 font-bold">{p.stock}</td><td className="p-2"><span className={`px-2 py-1 rounded text-[10px] font-bold ${p.status==='LOW'?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{p.status}</span></td></tr>)}</tbody></table>
   </div>
   <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-slate-50" onClick={() => navigate('virtual_safe')}>
     <Lock size={48} className="text-amber-500 mb-4"/>
     <h3 className="font-bold text-slate-800">Virtual Safe Status</h3>
     <p className="text-sm text-slate-500">18/20 Slots Available</p>
     <button className="mt-4 text-blue-600 font-bold text-sm">View Vault Layout</button>
   </div>
  </div>
 </div>
);

const TechDashboard = ({ navigate }) => (
 <div className="p-8 animate-in fade-in">
  <div className="flex justify-between items-center mb-8">
    <div><h1 className="text-2xl font-bold text-slate-900">My Workbench</h1><p className="text-slate-500">Jean-Pierre • Senior Watchmaker</p></div>
    <button onClick={() => navigate('sop_library')} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50"><BookOpen size={18}/> Technical Library</button>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   {MOCK_JOBS.filter(j => ['diagnosis', 'repair', 'qc'].includes(j.stage)).map(job => (
    <div key={job.id} onClick={() => navigate('tech_workbench', { job })} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4"><img src={job.image} className="w-16 h-16 rounded-lg object-cover" alt="Watch"/><span className={`px-2 py-1 rounded text-xs font-bold uppercase bg-amber-100 text-amber-800`}>{job.stage}</span></div>
      <h3 className="font-bold text-slate-900">{job.brand} {job.model}</h3>
      <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold mt-4">Open Job</button>
    </div>
   ))}
  </div>
 </div>
);

const ProfileScreen = ({ navigate }) => (
 <div className="p-8 animate-in fade-in max-w-4xl mx-auto">
  <button onClick={() => navigate('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back to Dashboard</button>
  <div className="flex justify-between items-end mb-8">
    <div>
      <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
      <p className="text-slate-500">Manage your account settings and employment details</p>
    </div>
    <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">Edit Profile</button>
  </div>

  <div className="grid grid-cols-3 gap-8">
    {/* ID Card Column */}
    <div className="col-span-1">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-serif text-slate-400">
          JP
        </div>
        <h2 className="text-xl font-bold text-slate-900">Jean-Pierre</h2>
        <p className="text-sm text-slate-500 mb-4">Senior Watchmaker</p>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div> Active
        </div>
      </div>
    </div>

    {/* Details Column */}
    <div className="col-span-2 space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Briefcase size={20} className="text-amber-500"/> Employment Details
        </h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Employee ID</label>
            <p className="font-mono text-slate-700 font-medium">TFG-8821</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
            <p className="font-medium text-slate-700">Senior Watchmaker</p>
          </div>
          <div className="col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <MapPin size={24} className="text-red-500"/>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Assigned Outlet</label>
              <p className="font-bold text-slate-900 text-lg">Trafalgar Flagship Boutique</p>
              <p className="text-sm text-slate-500">The Avenues Mall, Phase IV, Kuwait City</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Date Joined</label>
            <p className="font-medium text-slate-700">12 March 2018</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Supervisor</label>
            <p className="font-medium text-slate-700">Ahmed Al-Sabah</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Shield size={20} className="text-blue-500"/> Security & Access
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <div>
              <p className="font-bold text-slate-700">System Access Level</p>
              <p className="text-xs text-slate-400">Determines what you can view and edit</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">Level 2 (Technical)</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="font-bold text-slate-700">Two-Factor Auth</p>
              <p className="text-xs text-slate-400">Required for accessing the Safe</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  </div>
 </div>
);

// --- RESTORED DESKTOP SCREENS ---

const SettingsScreen = ({ navigate }) => (
  <div className="p-8 animate-in fade-in">
   <button onClick={() => navigate('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back</button>
   <h1 className="text-2xl font-bold text-slate-900 mb-6">System Settings</h1>
   <div className="max-w-xl space-y-4">
     <div className="bg-white p-4 rounded-xl border flex justify-between items-center"><span className="font-bold text-slate-700">Notifications</span><div className="w-10 h-6 bg-green-500 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div></div>
     <div className="bg-white p-4 rounded-xl border flex justify-between items-center"><span className="font-bold text-slate-700">Dark Mode</span><div className="w-10 h-6 bg-slate-300 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div></div></div>
     <div className="bg-white p-4 rounded-xl border flex justify-between items-center"><span className="font-bold text-slate-700">Language (Arabic/English)</span><span className="text-sm font-bold text-blue-600">English</span></div>
   </div>
  </div>
);

const KanbanBoard = ({ navigate }) => (
 <div className="p-8 h-full flex flex-col animate-in fade-in">
  <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-slate-900">Job Pipeline</h1><button onClick={() => navigate('dashboard')} className="text-sm underline">Back</button></div>
  <div className="flex-1 overflow-x-auto pb-4">
   <div className="flex gap-4 min-w-max h-full">
    {SOP_STAGES.map(stage => {
     const stageJobs = MOCK_JOBS.filter(j => j.stage === stage.id);
     return (
      <div key={stage.id} className="w-72 bg-slate-100 rounded-xl flex flex-col max-h-full">
       <div className="p-3 font-bold text-slate-700 uppercase text-xs tracking-wider flex justify-between">{stage.label} <span className="bg-slate-200 px-2 rounded-full">{stageJobs.length}</span></div>
       <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {stageJobs.map(job => (
         <div key={job.id} onClick={() => navigate('job_card', {job})} className="bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md border border-slate-200">
          <div className="flex justify-between items-start mb-2"><span className="font-bold text-sm text-slate-800">{job.brand}</span>{job.priority === 'VIP' && <div className="w-2 h-2 rounded-full bg-amber-400"></div>}</div>
          <p className="text-xs text-slate-500 mb-2 truncate">{job.model}</p>
          <div className="flex justify-between items-center"><span className="text-[10px] font-mono bg-slate-50 px-1 rounded">{job.id}</span><img src={job.image} className="w-6 h-6 rounded-full object-cover" alt="mini"/></div>
         </div>
        ))}
       </div>
      </div>
     )
    })}
   </div>
  </div>
 </div>
);

const ClientRegistry = ({ navigate }) => <SimpleTable title="Client Registry" headers={['ID', 'Name', 'Mobile', 'Tier', 'Total Spend', 'Jobs']} rows={MOCK_CLIENTS} actionLabel="Add Client" navigate={navigate} />;
const SupplierDirectory = ({ navigate }) => <SimpleTable title="Supplier Directory" headers={['ID', 'Company', 'Type', 'Contact']} rows={MOCK_SUPPLIERS} actionLabel="Add Vendor" navigate={navigate} />;
const StaffDirectory = ({ navigate }) => <SimpleTable title="Staff Directory" headers={['ID', 'Name', 'Role', 'Status']} rows={[{id:'ST-01', n:'Jean-Pierre', r:'Watchmaker', s:'Active'}]} actionLabel="Add User" navigate={navigate} />;
const InvoiceHistory = ({ navigate }) => <SimpleTable title="Invoice History" headers={['Inv #', 'Client', 'Date', 'Amount', 'Status']} rows={[{id:'INV-2024', c:'Ali Al-Salem', d:'20/01/26', a:'120.000', s:'Paid'}]} actionLabel="New Invoice" navigate={navigate} />;

const PurchaseOrder = ({ navigate }) => (
 <div className="p-8 animate-in fade-in">
  <button onClick={() => navigate('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back</button>
  <h1 className="text-2xl font-bold mb-6">Create Purchase Order</h1>
  <div className="max-w-2xl bg-white p-6 rounded-xl border shadow-sm">
   <div className="grid grid-cols-2 gap-4 mb-4">
    <div><label className="text-xs font-bold text-slate-500">Supplier</label><select className="w-full border p-3 rounded mt-1"><option>Rolex Geneva SA</option><option>Bergeon</option></select></div>
    <div><label className="text-xs font-bold text-slate-500">Expected Date</label><input type="date" className="w-full border p-3 rounded mt-1"/></div>
   </div>
   <div className="mb-4"><label className="text-xs font-bold text-slate-500">Items List</label><textarea className="w-full border p-3 rounded h-32 mt-1" placeholder="e.g. 5x Mainspring 3135..."></textarea></div>
   <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold w-full hover:bg-slate-800">Generate PO & Send</button>
  </div>
 </div>
);

const VirtualSafe = ({ navigate }) => (
 <div className="p-8 animate-in fade-in">
  <button onClick={() => navigate('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back</button>
  <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Virtual Safe View</h1><div className="flex gap-2"><div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div> Occupied</div><div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 bg-slate-50 border border-slate-200 rounded"></div> Empty</div></div></div>
  <div className="grid grid-cols-5 gap-4">
   {Array(20).fill(0).map((_, i) => (
    <div key={i} className={`h-24 rounded-lg border flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all ${i < 3 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
     <span className={`font-bold ${i < 3 ? 'text-amber-900' : 'text-slate-400'}`}>{i < 3 ? 'OCCUPIED' : `SLOT ${i+1}`}</span>
     {i < 3 && <span className="text-[10px] text-amber-700">Rolex Submariner</span>}
    </div>
   ))}
  </div>
 </div>
);

const ChainOfCustody = ({ navigate }) => (
 <div className="p-8 animate-in fade-in">
  <button onClick={() => navigate('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back</button>
  <h1 className="text-2xl font-bold mb-6">Chain of Custody Log</h1>
  <div className="bg-white border rounded-xl p-6 shadow-sm">
   <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Recent Movements</h3>
   <div className="space-y-4">
    {[{t:'10:00 AM', u:'Reception', a:'Intake', item:'Rolex Sub'}, {t:'10:30 AM', u:'Manager', a:'Moved to Safe', item:'Rolex Sub'}, {t:'02:00 PM', u:'Jean-Pierre', a:'Moved to Bench', item:'Rolex Sub'}].map((l, i) => (
     <div key={i} className="flex items-center gap-4 border-b border-slate-100 pb-3 last:border-0">
      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
      <span className="font-mono text-xs text-slate-400 w-16">{l.t}</span>
      <div className="flex-1"><span className="font-bold text-slate-800 text-sm">{l.u}</span><span className="text-sm text-slate-600 mx-2">performed</span><span className="font-bold text-amber-700 text-sm">{l.a}</span><span className="text-xs text-slate-400 ml-2">({l.item})</span></div>
     </div>
    ))}
   </div>
  </div>
 </div>
);

const SOPLibrary = ({ navigate }) => (
 <div className="p-8 animate-in fade-in">
  <button onClick={() => navigate('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back</button>
  <h1 className="text-2xl font-bold mb-6">SOP & Technical Library</h1>
  <div className="grid grid-cols-3 gap-6">
   {['Rolex Caliber 3135 Oil Chart', 'Water Resistance Standards 2025', 'Polishing Guidelines', 'Customer Interaction Script'].map((doc, i) => (
    <div key={i} className="bg-white p-6 rounded-xl border hover:shadow-md cursor-pointer flex flex-col items-center text-center">
     <BookOpen size={40} className="text-slate-300 mb-4"/>
     <h3 className="font-bold text-slate-800 text-sm">{doc}</h3>
     <span className="text-xs text-slate-400 mt-2">PDF • 2.4 MB</span>
    </div>
   ))}
  </div>
 </div>
);

const SystemAudit = ({ navigate }) => (
 <div className="p-8 animate-in fade-in">
  <button onClick={() => navigate('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back</button>
  <h1 className="text-2xl font-bold mb-6">System Audit Log</h1>
  <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
   <table className="w-full text-left">
    <thead className="bg-slate-50 border-b"><tr><th className="p-3 text-xs font-bold text-slate-500">Timestamp</th><th className="p-3 text-xs font-bold text-slate-500">User</th><th className="p-3 text-xs font-bold text-slate-500">Event</th><th className="p-3 text-xs font-bold text-slate-500">IP Address</th></tr></thead>
    <tbody>
     {[{t:'2026-01-22 09:00:01', u:'admin', e:'Login Success', ip:'192.168.1.1'}, {t:'2026-01-22 09:15:22', u:'tech_jp', e:'Job #1024 Updated', ip:'192.168.1.45'}].map((l, i) => (
      <tr key={i} className="border-b last:border-0"><td className="p-3 font-mono text-xs text-slate-500">{l.t}</td><td className="p-3 text-sm font-bold text-slate-700">{l.u}</td><td className="p-3 text-sm text-slate-600">{l.e}</td><td className="p-3 font-mono text-xs text-slate-400">{l.ip}</td></tr>
     ))}
    </tbody>
   </table>
  </div>
 </div>
);

const ServiceCalendar = () => (
 <div className="p-8 animate-in fade-in">
  <div className="flex justify-between items-center mb-6">
   <h1 className="text-2xl font-bold text-slate-900">Workshop Schedule</h1>
   <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
    <button className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold">Week</button>
    <button className="px-3 py-1 text-slate-500 hover:bg-slate-100 rounded text-xs font-bold">Month</button>
   </div>
  </div>
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
   <div className="grid grid-cols-8 border-b bg-slate-50">
    <div className="p-4 font-bold text-slate-400 text-xs">TECH</div>
    {['MON 20','TUE 21','WED 22','THU 23','FRI 24','SAT 25','SUN 26'].map(d => <div key={d} className="p-4 font-bold text-slate-600 text-xs text-center border-l">{d}</div>)}
   </div>
   {['Jean-Pierre', 'Ahmed', 'Sarah'].map(tech => (
    <div key={tech} className="grid grid-cols-8 border-b h-24">
     <div className="p-4 font-medium text-sm flex items-center border-r bg-slate-50/50">{tech}</div>
     <div className="col-span-7 relative bg-white">
      <div className="absolute top-2 left-[14%] w-[28%] h-8 bg-blue-100 border-l-4 border-blue-500 rounded text-[10px] p-1 text-blue-800 font-bold truncate">JOB-1024 Diagnosis</div>
      <div className="absolute top-12 left-[45%] w-[14%] h-8 bg-purple-100 border-l-4 border-purple-500 rounded text-[10px] p-1 text-purple-800 font-bold truncate">QC Shift</div>
     </div>
    </div>
   ))}
  </div>
 </div>
);

const AnalyticsDashboard = () => (
 <div className="p-8 animate-in fade-in">
  <div className="flex justify-between items-center mb-8">
   <h1 className="text-2xl font-bold text-slate-900">Business Intelligence</h1>
   <button className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border px-3 py-2 rounded-lg"><CalendarDays size={16}/> Jan 2026</button>
  </div>
  <div className="grid grid-cols-3 gap-6 mb-8">
   <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Revenue</p>
    <h2 className="text-3xl font-bold">45,250 <span className="text-lg font-normal text-slate-400">KWD</span></h2>
    <div className="mt-4 h-1 bg-slate-700 rounded overflow-hidden"><div className="h-full bg-green-400 w-[70%]"></div></div>
    <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><TrendingUp size={12}/> +12% vs last month</p>
   </div>
   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Jobs Completed</p>
    <h2 className="text-3xl font-bold text-slate-800">142</h2>
    <div className="mt-4 flex gap-1">
     <div className="h-2 bg-green-500 w-[60%] rounded-l"></div>
     <div className="h-2 bg-amber-400 w-[30%]"></div>
     <div className="h-2 bg-red-500 w-[10%] rounded-r"></div>
    </div>
    <p className="text-xs text-slate-400 mt-2">60% Early • 30% On Time • 10% Late</p>
   </div>
   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Avg Turnaround</p>
    <h2 className="text-3xl font-bold text-slate-800">12.4 <span className="text-lg font-normal text-slate-400">Days</span></h2>
    <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><TrendingUp size={12}/> +0.5 days (Slower)</p>
   </div>
  </div>
  <div className="bg-white p-6 rounded-xl border border-slate-200">
   <h3 className="font-bold text-slate-800 mb-6">Revenue by Brand</h3>
   <div className="space-y-4">
    {[{b:'Rolex', v:45}, {b:'Patek Philippe', v:30}, {b:'Audemars Piguet', v:15}, {b:'Others', v:10}].map(d => (
     <div key={d.b} className="flex items-center gap-4">
      <span className="w-32 text-sm font-medium text-slate-600">{d.b}</span>
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-800" style={{width: `${d.v}%`}}></div></div>
      <span className="w-12 text-sm font-bold text-right">{d.v}%</span>
     </div>
    ))}
   </div>
  </div>
 </div>
);

const NotificationCenter = () => (
 <div className="p-8 animate-in slide-in-from-right max-w-2xl mx-auto">
  <div className="flex justify-between items-center mb-6">
   <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
   <button className="text-sm text-blue-600 font-bold hover:underline">Mark all read</button>
  </div>
  <div className="space-y-4">
   {[
    {t:'System Alert', m:'Inventory low for Sapphire Crystal (Ref 25-295)', time:'10m ago', type:'alert'},
    {t:'Job Update', m:'Jean-Pierre completed QC for Job #1024', time:'1h ago', type:'info'},
    {t:'Client Message', m:'New message from Sarah Kuwaiti', time:'2h ago', type:'msg'},
   ].map((n, i) => (
    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === 'alert' ? 'bg-red-100 text-red-600' : n.type === 'msg' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
      {n.type === 'alert' ? <AlertCircle size={20}/> : n.type === 'msg' ? <MessageCircle size={20}/> : <Bell size={20}/>}
     </div>
     <div>
      <h4 className="font-bold text-slate-800 text-sm">{n.t}</h4>
      <p className="text-sm text-slate-600">{n.m}</p>
      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
     </div>
    </div>
   ))}
  </div>
 </div>
);

const KnowledgeBase = () => (
 <div className="p-8 animate-in fade-in">
  <h1 className="text-2xl font-bold text-slate-900 mb-6">Technical Library</h1>
  <div className="grid grid-cols-4 gap-6">
   {['Caliber 3135 Service Guide', 'Water Resistance ISO 22810', 'Polishing Best Practices', 'Omega Co-Axial Manual', 'Customer Handling Script', 'Safety Protocols'].map((doc, i) => (
    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-amber-400 cursor-pointer group transition-all">
     <BookOpen className="text-slate-300 group-hover:text-amber-500 mb-4" size={32}/>
     <h3 className="font-bold text-slate-800 text-sm leading-tight mb-2">{doc}</h3>
     <p className="text-xs text-slate-400">PDF • Updated 2 days ago</p>
    </div>
   ))}
  </div>
 </div>
);

const ClientProfile = ({ client, back }) => (
 <div className="p-8 animate-in slide-in-from-right">
  <button onClick={back} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={18}/> Back to Directory</button>
  <div className="grid grid-cols-3 gap-8">
   <div className="col-span-1 space-y-6">
    <div className="bg-white p-6 rounded-xl border border-slate-200 text-center relative overflow-hidden">
     <div className="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center text-3xl font-serif mx-auto mb-4">{client.name.charAt(0)}</div>
     <h2 className="text-xl font-bold text-slate-900">{client.name}</h2>
     <p className="text-slate-500 text-sm mb-4">{client.id}</p>
     <div className="flex justify-center gap-2 mb-6">
      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">{client.tier} Member</span>
     </div>
     <div className="grid grid-cols-2 gap-4 border-t pt-4">
      <div><p className="text-xs text-slate-400 uppercase">Spend</p><p className="font-bold">{client.spend} KWD</p></div>
      <div><p className="text-xs text-slate-400 uppercase">Visits</p><p className="font-bold">14</p></div>
     </div>
    </div>
    <div className="bg-white p-6 rounded-xl border border-slate-200">
     <h3 className="font-bold text-slate-800 mb-4">Clienteling Notes</h3>
     <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
      <li>Prefers communication via WhatsApp.</li>
      <li>Collects vintage Patek Philippe.</li>
      <li>Do not call before 11:00 AM.</li>
     </ul>
    </div>
   </div>
   <div className="col-span-2 space-y-6">
    <div className="bg-white p-6 rounded-xl border border-slate-200">
     <h3 className="font-bold text-slate-800 mb-4">Service History</h3>
     <table className="w-full text-sm text-left">
      <thead className="bg-slate-50 text-slate-500"><tr><th className="p-2">Job ID</th><th className="p-2">Date</th><th className="p-2">Watch</th><th className="p-2">Amount</th></tr></thead>
      <tbody>
       <tr className="border-b"><td className="p-2 font-mono">JOB-1024</td><td className="p-2">Jan 20, 2026</td><td className="p-2">Rolex Submariner</td><td className="p-2">120.000</td></tr>
       <tr className="border-b"><td className="p-2 font-mono">JOB-0988</td><td className="p-2">Dec 12, 2025</td><td className="p-2">Cartier Tank</td><td className="p-2">45.000</td></tr>
      </tbody>
     </table>
    </div>
    <div className="bg-white p-6 rounded-xl border border-slate-200">
     <h3 className="font-bold text-slate-800 mb-4">Collection</h3>
     <div className="flex gap-4 overflow-x-auto pb-2">
      {[1,2,3].map(i => (
       <div key={i} className="min-w-[120px] h-32 bg-slate-100 rounded-lg flex items-center justify-center border text-slate-400">Watch Photo</div>
      ))}
     </div>
    </div>
   </div>
  </div>
 </div>
);

// --- APP COMPONENT ---

export default function App() {
 const [currentUser, setCurrentUser] = useState(null);
 const { view, params, navigate, back } = useNavigation('dashboard');

 if (!currentUser) return <LoginScreen onLogin={setCurrentUser} />;

 // CLIENT BYPASS
 if (currentUser === ROLES.CLIENT) {
  return (
   <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
     <h1 className="text-2xl font-bold text-slate-900">Client Portal</h1>
     <p className="text-slate-500">Please access via your mobile link.</p>
     <button onClick={() => setCurrentUser(null)} className="mt-4 text-red-500 underline">Logout</button>
    </div>
   </div>
  )
 }

 // ADVISOR MOBILE MOCKUP
 if (currentUser === ROLES.ADVISOR) {
  const renderMobileView = () => {
   switch(view) {
    case 'dashboard': return <MobileAdvisorHome navigate={navigate} userRole={currentUser} />;
    case 'intake': return <MobileIntake navigate={navigate} />;
    case 'job_card': return <MobileJobCard job={params.job} navigate={navigate} />;
    case 'messages': return <MobileMessages navigate={navigate} />;
    case 'client_registry': return <MobileClientRegistry navigate={navigate} />;
    case 'invoices': return <MobileInvoices navigate={navigate} />;
    case 'delivery': return <MobileDelivery job={params.job} navigate={navigate} />;
    case 'profile': return <MobileProfile navigate={navigate} setCurrentUser={setCurrentUser} />;
    default: return <MobileAdvisorHome navigate={navigate} userRole={currentUser} />;
   }
  };

  return (
   <div className="min-h-screen bg-slate-200 flex items-center justify-center p-8 font-sans">
    <div className="scale-90 md:scale-100 transition-transform">
     {renderMobileView()}
    </div>
   </div>
  );
 }

 // DESKTOP VIEWS (Manager, Tech)
 const renderDesktopView = () => {
  switch(view) {
    case 'dashboard': 
     if (currentUser === ROLES.MANAGER) return <ManagerDashboard navigate={navigate}/>;
     if (currentUser === ROLES.TECH) return <TechDashboard navigate={navigate}/>;
     return <div>Unknown Role</div>;
    case 'job_card': return <JobCardScreen job={params.job} back={back} navigate={navigate}/>;
    case 'tech_workbench': return <TechWorkbench job={params.job} back={back} navigate={navigate}/>;
    
    // FULL DESKTOP SCREENS
    case 'inventory': return <InventoryScreen navigate={navigate}/>;
    case 'system_audit': return <SystemAudit navigate={navigate}/>;
    case 'staff': return <StaffDirectory navigate={navigate}/>;
    case 'virtual_safe': return <VirtualSafe navigate={navigate}/>;
    case 'sop_library': return <SOPLibrary navigate={navigate}/>;
    case 'settings': return <SettingsScreen navigate={navigate}/>;
    case 'kanban': return <KanbanBoard navigate={navigate}/>;
    case 'analytics': return <AnalyticsDashboard/>;
    case 'calendar': return <ServiceCalendar/>;
    case 'knowledge': return <KnowledgeBase/>;
    case 'notifications': return <NotificationCenter/>;
    case 'client_registry': return <ClientRegistry navigate={navigate}/>;
    case 'suppliers': return <SupplierDirectory navigate={navigate}/>;
    case 'invoices': return <InvoiceHistory navigate={navigate}/>;
    case 'chain_custody': return <ChainOfCustody navigate={navigate}/>;
    case 'purchase_order': return <PurchaseOrder navigate={navigate}/>;
    case 'client_profile': return <ClientProfile client={params.client} back={back}/>;
    case 'profile': return <ProfileScreen navigate={navigate} />; 

    default: return <div className="p-8">404 View Not Found</div>;
  }
 };

 const Sidebar = () => (
  <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full overflow-y-auto">
    <div 
     className="p-6 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
     onClick={() => navigate('profile')}
    >
     <div className="flex items-center gap-2 text-white font-serif font-bold text-lg mb-2"><Watch className="text-amber-400"/> TRAFALGAR</div>
     <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center font-bold text-amber-400">JP</div>
      <div>
        <div className="text-sm font-bold text-white">{currentUser}</div>
        <div className="text-xs text-slate-400">View Profile</div>
      </div>
     </div>
    </div>
    
    <nav className="flex-1 p-4 space-y-1">
     <p className="px-4 pt-4 pb-2 text-xs font-bold text-slate-500 uppercase">Main</p>
     <button onClick={() => navigate('dashboard')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><Layout size={18}/> Dashboard</button>
     <button onClick={() => navigate('kanban')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><LayoutGrid size={18}/> Pipeline</button>
     <button onClick={() => navigate('notifications')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><BellRing size={18}/> Notifications</button>
      
     {currentUser === ROLES.MANAGER && (
      <>
       <p className="px-4 pt-4 pb-2 text-xs font-bold text-slate-500 uppercase">Management</p>
       <button onClick={() => navigate('client_registry')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><Users size={18}/> Clients</button>
       <button onClick={() => navigate('inventory')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><Package size={18}/> Inventory</button>
       <button onClick={() => navigate('analytics')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><TrendingUp size={18}/> Analytics</button>
       <button onClick={() => navigate('purchase_order')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><ShoppingBag size={18}/> Purchasing</button>
        
       <p className="px-4 pt-4 pb-2 text-xs font-bold text-slate-500 uppercase">Operations</p>
       <button onClick={() => navigate('calendar')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><Calendar size={18}/> Schedule</button>
       <button onClick={() => navigate('virtual_safe')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><Lock size={18}/> Virtual Safe</button>
       <button onClick={() => navigate('staff')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><Briefcase size={18}/> Staff</button>
      </>
     )}

     {currentUser === ROLES.TECH && (
       <>
        <p className="px-4 pt-4 pb-2 text-xs font-bold text-slate-500 uppercase">Tools</p>
        <button onClick={() => navigate('sop_library')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><BookOpen size={18}/> Manuals</button>
        <button onClick={() => navigate('inventory')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><Package size={18}/> Parts Check</button>
       </>
     )}

     <div className="mt-4 pt-4 border-t border-slate-800">
       <button onClick={() => navigate('settings')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-3 text-sm"><Settings size={18}/> Settings</button>
     </div>
    </nav>
    <div className="p-4 border-t border-slate-800"><button onClick={() => setCurrentUser(null)} className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 flex items-center gap-3"><LogOut size={18}/> Sign Out</button></div>
  </div>
 );

 return (
  <div className="flex h-screen bg-slate-50 font-sans">
    <Sidebar/>
    <div className="flex-1 overflow-auto bg-slate-50">{renderDesktopView()}</div>
  </div>
 );
}