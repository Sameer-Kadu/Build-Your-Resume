'use client';

import LoginButton from '@/components/LoginButton';
import ResumeForm from '@/features/resume-form/ResumeForm';
import ResumePreview from '@/features/preview/ResumePreview';
import ResumeDashboard from '@/features/dashboard/ResumeDashboard';
import { useAuth } from '@/context/auth-context';
import { useResume } from '@/context/resume-context';
import { Printer, LayoutDashboard, FileEdit } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { isSyncing, lastSynced, resumes, activeResumeId } = useResume();
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');

  const handlePrint = () => {
    const originalTitle = document.title;
    const userName = resumeData?.personalInfo?.fullName || 'User';
    const role = resumes.find(r => r.id === activeResumeId)?.role || 'Resume';
    const safeUserName = userName.replace(/\s+/g, '_');
    const safeRole = role.replace(/\s+/g, '_');
    
    document.title = `${safeUserName}_${safeRole}_Resume`;
    window.print();
    document.title = originalTitle;
  };

  const activeResume = resumes.find(r => r.id === activeResumeId);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 print:bg-white print:p-0 font-calibri">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase">
            Build Your <span className="text-blue-600">Resume</span>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm md:text-base font-bold">
            ATS-Friendly • Multi-Role Support
            {isAuthenticated && (
              <span className="hidden md:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200">
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
                {isSyncing ? 'Syncing...' : lastSynced ? `Last synced: ${new Date(lastSynced).toLocaleTimeString()}` : 'Ready'}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              {view === 'editor' ? (
                <button
                  onClick={() => setView('dashboard')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <LayoutDashboard size={18} className="text-blue-600" />
                  <span>Dashboard</span>
                </button>
              ) : activeResumeId ? (
                <button
                  onClick={() => setView('editor')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-700 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <FileEdit size={18} />
                  <span>Open Editor</span>
                </button>
              ) : null}
              
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Printer size={18} />
                <span>Export PDF</span>
              </button>
            </>
          )}
          <LoginButton />
        </div>
      </header>

      <section className="max-w-7xl mx-auto">
        {!isAuthenticated ? (
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Start your professional resume today</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto font-bold">
              Create multiple tailored resumes for different roles. Securely stored in your Google Drive.
            </p>
            <LoginButton />
          </div>
        ) : (
          <>
            {view === 'dashboard' ? (
              <ResumeDashboard />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 print:hidden">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
                      Editing: <span className="text-blue-600">{activeResume?.role || 'Resume'}</span>
                    </h2>
                    <button 
                      onClick={() => setView('dashboard')}
                      className="text-xs font-bold text-gray-400 hover:text-blue-600 transition uppercase tracking-widest"
                    >
                      Change Role
                    </button>
                  </div>
                  <ResumeForm />
                </div>
                <div className="lg:sticky lg:top-8 h-fit print:static print:w-full">
                  <div className="bg-gray-100 p-4 rounded-t-2xl border-x border-t border-gray-100 flex justify-between items-center print:hidden">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Resume Preview (A4)</span>
                    <span className="text-[10px] text-gray-400 italic">Auto-saving to Google Drive</span>
                  </div>
                  <div className="bg-white shadow-2xl rounded-b-2xl lg:rounded-b-none overflow-hidden print:shadow-none print:rounded-none">
                    <ResumePreview />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
