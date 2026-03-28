'use client';

import React from 'react';
import { useResume } from '@/context/resume-context';
import { Plus, Trash2, Info, Award, Globe } from 'lucide-react';

export default function AdditionalInfoForm() {
  const { resumeData, updateResumeData } = useResume();

  const updateAdditional = (field: string, value: any) => {
    updateResumeData({
      additionalInfo: { ...resumeData.additionalInfo, [field]: value }
    });
  };

  const addCertification = () => {
    updateResumeData({ certifications: [...resumeData.certifications, ''] });
  };

  const updateCertification = (index: number, value: string) => {
    const newCerts = [...resumeData.certifications];
    newCerts[index] = value;
    updateResumeData({ certifications: newCerts });
  };

  const removeCertification = (index: number) => {
    updateResumeData({
      certifications: resumeData.certifications.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Certifications */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
          <h3 className="flex items-center gap-2">
            <Award size={18} className="text-blue-600" />
            Certifications
          </h3>
          <button
            onClick={addCertification}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
          >
            <Plus size={14} /> Add Certification
          </button>
        </div>
        
        <div className="space-y-3">
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={cert}
                onChange={(e) => updateCertification(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. AWS Certified Solutions Architect"
              />
              <button
                onClick={() => removeCertification(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {resumeData.certifications.length === 0 && (
            <p className="text-xs text-gray-400 italic">No certifications added.</p>
          )}
        </div>
      </div>

      {/* Other Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Info size={18} className="text-blue-600" />
          Other Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
              <Globe size={10} /> Languages (comma separated)
            </label>
            <input
              type="text"
              value={resumeData.additionalInfo.languages.join(', ')}
              onChange={(e) => updateAdditional('languages', e.target.value.split(',').map(s => s.trim()))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. English, Hindi, Marathi"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Work Authorization</label>
            <input
              type="text"
              value={resumeData.additionalInfo.workAuthorization}
              onChange={(e) => updateAdditional('workAuthorization', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. India"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Notice Period</label>
            <input
              type="text"
              value={resumeData.additionalInfo.noticePeriod}
              onChange={(e) => updateAdditional('noticePeriod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Immediate / 30 Days"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
