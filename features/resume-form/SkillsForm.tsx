'use client';

import React, { useState } from 'react';
import { useResume } from '@/context/resume-context';
import { Plus, Trash2 } from 'lucide-react';

export default function SkillsForm() {
  const { resumeData, updateResumeData } = useResume();
  const { skills } = resumeData;
  const [newSkillInputs, setNewSkillInputs] = useState<{ [key: string]: string }>({});

  const addCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      category: 'New Category',
      items: []
    };
    updateResumeData({ skills: [...skills, newCategory] });
  };

  const removeCategory = (id: string) => {
    updateResumeData({
      skills: skills.filter(group => group.id !== id)
    });
  };

  const updateCategoryName = (id: string, name: string) => {
    updateResumeData({
      skills: skills.map(group => group.id === id ? { ...group, category: name } : group)
    });
  };

  const handleAddSkill = (groupId: string) => {
    const value = newSkillInputs[groupId]?.trim();
    if (!value) return;

    const group = skills.find(g => g.id === groupId);
    if (group && !group.items.includes(value)) {
      updateResumeData({
        skills: skills.map(g => g.id === groupId ? { ...g, items: [...g.items, value] } : g)
      });
    }
    
    setNewSkillInputs(prev => ({ ...prev, [groupId]: '' }));
  };

  const removeSkill = (groupId: string, skillToRemove: string) => {
    updateResumeData({
      skills: skills.map(g => g.id === groupId ? { ...g, items: g.items.filter(i => i !== skillToRemove) } : g)
    });
  };

  return (
    <div className="space-y-6 font-calibri">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
          Core Technical Skills
        </label>
        <button
          onClick={addCategory}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="space-y-6">
        {skills.map((group) => (
          <div key={group.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-3 relative group/card">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={group.category}
                onChange={(e) => updateCategoryName(group.id, e.target.value)}
                placeholder="Category Name (e.g. Languages)"
                className="flex-1 bg-transparent font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none transition px-1"
              />
              <button
                onClick={() => removeCategory(group.id)}
                className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover/card:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-white text-gray-700 text-xs font-medium border border-gray-200 group/tag transition hover:border-blue-300"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(group.id, skill)}
                      className="ml-1.5 text-gray-400 hover:text-red-500 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInputs[group.id] || ''}
                  onChange={(e) => setNewSkillInputs(prev => ({ ...prev, [group.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(group.id))}
                  placeholder="Add skill..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                />
                <button
                  onClick={() => handleAddSkill(group.id)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {skills.length === 0 && (
          <p className="text-sm text-gray-400 italic text-center py-8">No skill categories added yet.</p>
        )}
      </div>
    </div>
  );
}
