'use client';

import React, { useState } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import SkillsForm from './SkillsForm';
import EducationForm from './EducationForm';
import ProjectsForm from './ProjectsForm';
import SummaryForm from './SummaryForm';
import AdditionalInfoForm from './AdditionalInfoForm';
import { useResume } from '@/context/resume-context';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'summary', label: 'Summary' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'additional', label: 'Additional' },
];

export default function ResumeForm() {
  const [activeSection, setActiveSection] = useState('personal');
  const { isSyncing } = useResume();

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <nav className="flex flex-wrap gap-2 pb-4 border-b">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeSection === section.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {/* Form Content */}
      <div className="py-2">
        {activeSection === 'personal' && <PersonalInfoForm />}
        {activeSection === 'summary' && <SummaryForm />}
        {activeSection === 'skills' && <SkillsForm />}
        {activeSection === 'experience' && <ExperienceForm />}
        {activeSection === 'projects' && <ProjectsForm />}
        {activeSection === 'education' && <EducationForm />}
        {activeSection === 'additional' && <AdditionalInfoForm />}
      </div>

      {/* Footer / Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <p className="text-xs text-gray-400">
          {isSyncing ? 'Saving changes...' : 'All changes saved to Drive'}
        </p>
        
        <div className="flex gap-2">
            {SECTIONS.findIndex(s => s.id === activeSection) > 0 && (
                <button 
                    onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) - 1].id)}
                    className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-700"
                >
                    Previous
                </button>
            )}
            {SECTIONS.findIndex(s => s.id === activeSection) < SECTIONS.length - 1 && (
                <button 
                    onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) + 1].id)}
                    className="px-3 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                    Next
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
