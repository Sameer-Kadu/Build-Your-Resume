'use client';

import LoginButton from '@/components/LoginButton';
import ResumeForm from '@/features/resume-form/ResumeForm';
import ResumePreview from '@/features/preview/ResumePreview';
import { useAuth } from '@/context/auth-context';
import { useResume } from '@/context/resume-context';
import { Printer } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { isSyncing, lastSynced } = useResume();

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 print:bg-white print:p-0">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Build Your <span className="text-blue-600">Resume</span>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm md:text-base">
            Professional, ATS-friendly resume generator.
            {isAuthenticated && (
              <span className="hidden md:flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200">
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
                {isSyncing ? 'Syncing...' : lastSynced ? `Last synced: ${new Date(lastSynced).toLocaleTimeString()}` : 'Ready'}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Printer size={18} />
              <span>Export PDF</span>
            </button>
          )}
          <LoginButton />
        </div>
      </header>

      <section className="max-w-7xl mx-auto">
        {!isAuthenticated ? (
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-semibold mb-4">Start your professional resume today</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Login with Google to securely store your data in your own Drive and sync it across devices.
            </p>
            <LoginButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 print:hidden">
              <h2 className="text-xl font-semibold mb-6 border-b pb-4 text-gray-800">Your Resume Editor</h2>
              <ResumeForm />
            </div>
            <div className="lg:sticky lg:top-8 h-fit print:static print:w-full">
              <div className="bg-gray-100 p-4 rounded-t-2xl border-x border-t border-gray-100 flex justify-between items-center print:hidden">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Resume Preview (A4)</span>
                <span className="text-[10px] text-gray-400 italic">Changes are saved automatically</span>
              </div>
              <div className="bg-white shadow-2xl rounded-b-2xl lg:rounded-b-none overflow-hidden print:shadow-none print:rounded-none">
                <ResumePreview />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
