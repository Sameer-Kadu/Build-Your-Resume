'use client';

import { useResume } from '@/context/resume-context';

export default function SummaryForm() {
  const { resumeData, updateResumeData } = useResume();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateResumeData({ summary: e.target.value });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Summary
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Briefly describe your career goals and key achievements.
        </p>
        <textarea
          value={resumeData.summary}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          placeholder="Results-driven professional with expertise in..."
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="text-sm font-semibold text-blue-800 mb-1">Pro Tip</h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          For an ATS-friendly summary, focus on keywords related to your target role. 
          Mention years of experience, core technologies, and 1-2 major achievements.
        </p>
      </div>
    </div>
  );
}
