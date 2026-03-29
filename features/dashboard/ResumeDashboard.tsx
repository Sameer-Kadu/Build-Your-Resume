'use client';

import React, { useState } from 'react';
import { useResume } from '@/context/resume-context';
import { Plus, Trash2, Copy, FileText, ChevronRight, LayoutDashboard, X } from 'lucide-react';

const PREDEFINED_ROLES = ['SDE', 'SDET', 'DevOps', 'AI/ML', 'Data Analyst'];

export default function ResumeDashboard() {
  const { 
    resumes, 
    activeResumeId, 
    switchResume, 
    createNewResume, 
    deleteExistingResume 
  } = useResume();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newRole.trim()) return;
    await createNewResume(newRole.trim());
    setIsAdding(false);
    setNewRole('');
    setIsCustomRole(false);
  };

  const handleDuplicate = async (id: string, role: string) => {
    await createNewResume(`${role} (Copy)`, id);
  };

  const activeResume = resumes.find(r => r.id === activeResumeId);

  return (
    <div className="font-calibri">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Your Resumes</h2>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={16} /> New Resume
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map((resume) => (
          <div 
            key={resume.id}
            className={`group relative p-4 rounded-xl border-2 transition-all ${
              activeResumeId === resume.id 
                ? 'border-blue-500 bg-blue-50/30' 
                : 'border-gray-100 bg-white hover:border-blue-200'
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm text-blue-600">
                  <FileText size={20} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDuplicate(resume.id, resume.role)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition"
                    title="Duplicate"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => setIsDeleting(resume.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 truncate pr-8">{resume.role}</h3>
              <p className="text-xs text-gray-500 mt-1">Ready for application</p>

              <button
                onClick={() => switchResume(resume.id)}
                disabled={activeResumeId === resume.id}
                className={`mt-4 w-full py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-1 ${
                  activeResumeId === resume.id
                    ? 'bg-blue-600 text-white cursor-default'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {activeResumeId === resume.id ? 'Active' : 'Switch to this'}
                {activeResumeId !== resume.id && <ChevronRight size={14} />}
              </button>
            </div>
          </div>
        ))}

        {resumes.length === 0 && (
          <div className="col-span-full py-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
            <FileText size={48} className="mb-2 opacity-20" />
            <p className="font-bold">No resumes found</p>
            <button 
                onClick={() => setIsAdding(true)}
                className="mt-2 text-sm text-blue-600 hover:underline"
            >
                Create your first resume
            </button>
          </div>
        )}
      </div>

      {/* Add Resume Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 uppercase">Create New Resume</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Role</label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_ROLES.map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setNewRole(role);
                        setIsCustomRole(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition ${
                        newRole === role && !isCustomRole
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsCustomRole(true);
                      setNewRole('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition ${
                      isCustomRole
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {isCustomRole && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Custom Role Name</label>
                  <input
                    type="text"
                    autoFocus
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Mobile Developer"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              )}
            </div>
            <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newRole.trim()}
                className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-md shadow-blue-200"
              >
                Create Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 uppercase tracking-tight">Delete Resume?</h3>
            <p className="text-gray-600 text-sm mb-6">
              This will move the resume file to trash on your Google Drive. You can restore it from there if needed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleting(null)}
                className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
              >
                Keep it
              </button>
              <button
                onClick={async () => {
                  await deleteExistingResume(isDeleting);
                  setIsDeleting(null);
                }}
                className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-md shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
