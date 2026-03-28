'use client';

import React from 'react';
import { useResume } from '@/context/resume-context';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

export default function EducationForm() {
  const { resumeData, updateResumeData } = useResume();

  const addEducation = () => {
    const newEdu = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
    };
    updateResumeData({ education: [...resumeData.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    updateResumeData({
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const updateEdu = (id: string, field: string, value: string) => {
    updateResumeData({
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <GraduationCap size={18} className="text-blue-600" />
          Education History
        </h3>
        <button
          onClick={addEducation}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
        >
          <Plus size={14} /> Add Education
        </button>
      </div>

      {resumeData.education.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-sm text-gray-400">No education entries added yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {resumeData.education.map((edu, index) => (
          <div key={edu.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute -top-2 -right-2 p-1 bg-white text-red-500 rounded-full shadow-sm border border-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">School / University</label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEdu(edu.id, 'school', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Stanford University"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Bachelor of Science"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Field of Study</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEdu(edu.id, 'field', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => updateEdu(edu.id, 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Palo Alto, CA"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => updateEdu(edu.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. 2018"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">End Date</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => updateEdu(edu.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. 2022"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
