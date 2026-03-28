'use client';

import React from 'react';
import { useResume } from '@/context/resume-context';
import { Plus, Trash2, Briefcase, Link as LinkIcon, Github } from 'lucide-react';

export default function ProjectsForm() {
  const { resumeData, updateResumeData } = useResume();

  const addProject = () => {
    const newProject = {
      id: crypto.randomUUID(),
      name: '',
      role: '',
      description: [''],
      technologies: [],
      github: '',
      liveDemo: '',
    };
    updateResumeData({ projects: [...resumeData.projects, newProject] });
  };

  const removeProject = (id: string) => {
    updateResumeData({
      projects: resumeData.projects.filter((p) => p.id !== id),
    });
  };

  const updateProject = (id: string, field: string, value: any) => {
    updateResumeData({
      projects: resumeData.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const addBullet = (projectId: string) => {
    const project = resumeData.projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, 'description', [...project.description, '']);
    }
  };

  const updateBullet = (projectId: string, index: number, value: string) => {
    const project = resumeData.projects.find((p) => p.id === projectId);
    if (project) {
      const newBullets = [...project.description];
      newBullets[index] = value;
      updateProject(projectId, 'description', newBullets);
    }
  };

  const removeBullet = (projectId: string, index: number) => {
    const project = resumeData.projects.find((p) => p.id === projectId);
    if (project && project.description.length > 1) {
      const newBullets = project.description.filter((_, i) => i !== index);
      updateProject(projectId, 'description', newBullets);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Briefcase size={18} className="text-blue-600" />
          Projects
        </h3>
        <button
          onClick={addProject}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>

      <div className="space-y-6">
        {resumeData.projects.map((project) => (
          <div key={project.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
            <button
              onClick={() => removeProject(project.id)}
              className="absolute -top-2 -right-2 p-1 bg-white text-red-500 rounded-full shadow-sm border border-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Project Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. E-commerce Platform"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Your Role</label>
                  <input
                    type="text"
                    value={project.role || ''}
                    onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Lead Developer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description Bullets</label>
                <div className="space-y-2">
                  {project.description.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => updateBullet(project.id, idx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Describe a key feature or achievement..."
                      />
                      <button
                        onClick={() => removeBullet(project.id, idx)}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addBullet(project.id)}
                    className="text-[10px] text-blue-600 font-bold uppercase hover:underline"
                  >
                    + Add Bullet
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="React, Node.js, AWS"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                    <Github size={10} /> GitHub Link
                  </label>
                  <input
                    type="text"
                    value={project.github || ''}
                    onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                    <LinkIcon size={10} /> Live Demo Link
                  </label>
                  <input
                    type="text"
                    value={project.liveDemo || ''}
                    onChange={(e) => updateProject(project.id, 'liveDemo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://..."
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
