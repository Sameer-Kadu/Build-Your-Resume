'use client';

import React, { useState } from 'react';
import { useResume } from '@/context/resume-context';

export default function SkillsForm() {
  const { resumeData, updateResumeData } = useResume();
  const { skills } = resumeData;
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!skills.includes(inputValue.trim())) {
        updateResumeData({ skills: [...skills, inputValue.trim()] });
      }
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateResumeData({
      skills: skills.filter((skill) => skill !== skillToRemove),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Technical Skills (Press Enter to add)
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="React, Next.js, TypeScript..."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 group transition hover:bg-blue-100"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-2 text-blue-400 hover:text-blue-600 transition"
            >
              ×
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-gray-400 italic">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}
