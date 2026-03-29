'use client';

import React from 'react';
import { useResume } from '@/context/resume-context';
import { Plus, Trash2, Briefcase } from 'lucide-react';

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

  const removeBullet = (expId: string, index: number) => {
    const updated = experience.map((exp) => {
      if (exp.id === expId) {
        // Allow removing even the last bullet if desired, but typically at least one is good.
        // We'll allow it but if it becomes empty we might want to handle it.
        const newBullets = exp.description.filter((_, i) => i !== index);
        return { ...exp, description: newBullets.length > 0 ? newBullets : [''] };
      }
      return exp;
    });
    updateResumeData({ experience: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-calibri">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Briefcase size={18} className="text-blue-600" />
          Work Experience
        </h3>
        <button
          onClick={addExperience}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
        >
          <Plus size={14} /> Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {experience.map((exp) => (
          <div key={exp.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute -top-2 -right-2 p-1 bg-white text-red-500 rounded-full shadow-sm border border-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Job Role</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleChange(exp.id, 'role', e.target.value)}
                  placeholder="Software Engineer"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                  placeholder="Google"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Start Date</label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                  placeholder="Jan 2020"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">End Date</label>
                <input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                  placeholder="Present"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Key Achievements (Bullet Points)</label>
              <div className="space-y-2">
                {exp.description.map((bullet, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleBulletChange(exp.id, idx, e.target.value)}
                      placeholder="Managed a team of 5 and delivered..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                    />
                    <button
                      onClick={() => removeBullet(exp.id, idx)}
                      className="p-2 text-gray-400 hover:text-red-500 transition"
                      title="Remove bullet"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addBullet(exp.id)}
                  className="text-[10px] text-blue-600 font-bold uppercase hover:underline"
                >
                  + Add Bullet Point
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {experience.length === 0 && (
        <button
          onClick={addExperience}
          className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium hover:border-blue-400 hover:text-blue-600 transition flex flex-col items-center justify-center gap-2"
        >
          <Plus size={24} />
          <span>Add Work Experience</span>
        </button>
      )}
    </div>
  );
}
