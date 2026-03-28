'use client';

import React from 'react';
import { useResume } from '@/context/resume-context';

export default function ExperienceForm() {
  const { resumeData, updateResumeData } = useResume();
  const { experience } = resumeData;

  const addExperience = () => {
    const newExp = {
      id: Math.random().toString(36).substr(2, 9),
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    };
    updateResumeData({ experience: [...experience, newExp] });
  };

  const removeExperience = (id: string) => {
    updateResumeData({ experience: experience.filter((exp) => exp.id !== id) });
  };

  const handleChange = (id: string, field: string, value: any) => {
    const updated = experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateResumeData({ experience: updated });
  };

  const handleBulletChange = (expId: string, index: number, value: string) => {
    const updated = experience.map((exp) => {
      if (exp.id === expId) {
        const newBullets = [...exp.description];
        newBullets[index] = value;
        return { ...exp, description: newBullets };
      }
      return exp;
    });
    updateResumeData({ experience: updated });
  };

  const addBullet = (expId: string) => {
    const updated = experience.map((exp) =>
      exp.id === expId ? { ...exp, description: [...exp.description, ''] } : exp
    );
    updateResumeData({ experience: updated });
  };

  return (
    <div className="space-y-8">
      {experience.map((exp) => (
        <div key={exp.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100 relative group">
          <button
            onClick={() => removeExperience(exp.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          >
            Remove
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Job Role</label>
              <input
                type="text"
                value={exp.role}
                onChange={(e) => handleChange(exp.id, 'role', e.target.value)}
                placeholder="Software Engineer"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                placeholder="Google"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                placeholder="Jan 2020"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
              <input
                type="text"
                value={exp.endDate}
                onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                placeholder="Present"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Achievements (Bullet Points)</label>
            <div className="space-y-2">
              {exp.description.map((bullet, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={bullet}
                  onChange={(e) => handleBulletChange(exp.id, idx, e.target.value)}
                  placeholder="Managed a team of 5 and delivered..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                />
              ))}
              <button
                onClick={() => addBullet(exp.id)}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                + Add Bullet Point
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 transition"
      >
        + Add Work Experience
      </button>
    </div>
  );
}
