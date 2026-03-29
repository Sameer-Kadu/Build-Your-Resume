'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/resume-context';
import { checkExtensionInstalled, sendDataToExtension } from '@/lib/extension-utils';
import { X, ExternalLink, Download, Bot, User, CheckCircle2, Info } from 'lucide-react';

interface ApplyFasterModalProps {
  resumeId: string;
  role: string;
  onClose: () => void;
}

const PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/' },
  { id: 'naukri', name: 'Naukri', url: 'https://www.naukri.com/' },
  { id: 'indeed', name: 'Indeed', url: 'https://www.indeed.com/' },
  { id: 'glassdoor', name: 'Glassdoor', url: 'https://www.glassdoor.com/Job/index.htm' },
];

export default function ApplyFasterModal({ resumeId, role, onClose }: ApplyFasterModalProps) {
  const { resumeData, switchResume } = useResume();
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const [mode, setMode] = useState<'selection' | 'manual' | 'automated'>('selection');
  const [autoStatus, setAutomatedStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const checkExt = async () => {
      const installed = await checkExtensionInstalled();
      setIsExtensionInstalled(installed);
    };
    checkExt();
  }, []);

  const handleManualApply = async () => {
    // 1. Ensure this resume is loaded in state
    await switchResume(resumeId);
    
    // 2. Set dynamic title for PDF filename
    const originalTitle = document.title;
    const userName = resumeData.personalInfo.fullName || 'User';
    const safeUserName = userName.replace(/\s+/g, '_');
    const safeRole = role.replace(/\s+/g, '_');
    document.title = `${safeUserName}_${safeRole}_Resume`;

    // 3. Trigger Print (which is how the app generates PDF currently)
    setMode('manual');
    window.print();
    
    // 4. Restore original title and open Platform
    document.title = originalTitle;
    setTimeout(() => {
      window.open(selectedPlatform.url, '_blank');
    }, 1000);
  };

  const handleAutomatedApply = async () => {
    await switchResume(resumeId);
    setMode('automated');
    setAutomatedStatus('sending');
    
    const response = await sendDataToExtension(resumeData, selectedPlatform.id);
    
    if (response.success) {
      setAutomatedStatus('success');
    } else {
      setAutomatedStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-calibri">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-xl text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <Bot className="text-blue-600" size={24} />
              Apply Faster
            </h3>
            <p className="text-sm text-gray-500 font-bold">Applying with: <span className="text-blue-600">{role}</span></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {mode === 'selection' && (
            <div className="space-y-8">
              {/* Platform Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Job Portal</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 font-bold text-sm ${
                        selectedPlatform.id === platform.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-100'
                          : 'border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-gray-50'
                      }`}
                    >
                      <span>{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Modes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Manual Flow Card */}
                <div className="p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition-colors group">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                    <User className="text-gray-600 group-hover:text-blue-600" size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Apply Manually</h4>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    Download your {role} resume as PDF and we'll take you to {selectedPlatform.name} to upload it.
                  </p>
                  <button
                    onClick={handleManualApply}
                    className="w-full py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download & Open
                  </button>
                </div>

                {/* Automated Flow Card */}
                <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50/30 relative overflow-hidden group">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                    <Bot className="text-white" size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Auto Apply</h4>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    Our AI-powered extension fills the application forms for you on {selectedPlatform.name}.
                  </p>
                  
                  {isExtensionInstalled ? (
                    <button
                      onClick={handleAutomatedApply}
                      className="w-full py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                    >
                      <Bot size={16} />
                      Launch Auto Apply
                    </button>
                  ) : (
                    <a
                      href="#"
                      className="w-full py-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed flex flex-col items-center justify-center"
                    >
                      <span>Extension Required</span>
                      <span className="text-[9px] underline text-blue-600 mt-1 cursor-pointer">Install from Web Store</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {mode === 'manual' && (
            <div className="py-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-2 uppercase">Ready to Apply!</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                We've opened <strong>{selectedPlatform.name}</strong> in a new tab. Follow these steps:
              </p>
              
              <div className="text-left bg-gray-50 rounded-2xl p-6 max-w-md mx-auto space-y-4 mb-8">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <p className="text-sm font-bold text-gray-700">Find the job post on {selectedPlatform.name}.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <p className="text-sm font-bold text-gray-700">Click "Upload Resume" and select the PDF you just downloaded.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                  <p className="text-sm font-bold text-gray-700">Review your details and submit!</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {mode === 'automated' && (
            <div className="py-10 text-center animate-in fade-in zoom-in duration-500">
              {autoStatus === 'sending' && (
                <>
                  <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">Communicating with Extension...</h3>
                  <p className="text-gray-500">Sending your {role} data to {selectedPlatform.name} helper.</p>
                </>
              )}
              
              {autoStatus === 'success' && (
                <>
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">Data Sent Successfully!</h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                    The extension has received your data and is now assisting you on {selectedPlatform.name}.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    Got it
                  </button>
                </>
              )}

              {autoStatus === 'error' && (
                <>
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X size={48} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">Connection Failed</h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                    We couldn't connect to the extension. Please ensure it's installed and active.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setMode('selection')}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                    >
                      Try Manual
                    </button>
                    <button
                      onClick={handleAutomatedApply}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                      Retry
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <Info size={12} />
          <span>Compliant with job portal policies • Secure Data Transfer</span>
        </div>
      </div>
    </div>
  );
}
