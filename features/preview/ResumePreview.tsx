'use client';

import { useResume } from '@/context/resume-context';

export default function ResumePreview() {
  const { resumeData } = useResume();
  const { personalInfo, summary, skills, experience, education, projects, certifications, additionalInfo } = resumeData;

  const hasContent = 
    personalInfo.fullName || 
    summary || 
    skills.length > 0 || 
    experience.length > 0 || 
    education.length > 0 || 
    projects.length > 0;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 border-2 border-dashed border-gray-100 rounded-xl">
        <p className="text-center italic text-sm">Start filling out the form to see your resume preview in the style of Sameer Kadu</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg border border-gray-200 p-[0.5in] md:p-[0.75in] font-serif text-[#000000] min-h-[11in] w-full max-w-[8.5in] mx-auto overflow-hidden text-[11pt] leading-snug">
      {/* Header - Left Aligned like the PDF */}
      <header className="mb-6">
        <h1 className="text-[24pt] font-bold text-gray-900 mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="text-[10pt] text-gray-800 space-y-0.5">
          {personalInfo.location && <div>{personalInfo.location}</div>}
          <div className="flex gap-2">
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:underline">{personalInfo.email}</a>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          </div>
          <div className="flex gap-2 text-blue-600">
            {personalInfo.website && <a href={personalInfo.website} className="hover:underline">Portfolio</a>}
            {personalInfo.linkedin && (
              <>
                {personalInfo.website && <span className="text-gray-400">|</span>}
                <a href={personalInfo.linkedin} className="hover:underline">LinkedIn</a>
              </>
            )}
            {personalInfo.github && (
              <>
                {(personalInfo.website || personalInfo.linkedin) && <span className="text-gray-400">|</span>}
                <a href={personalInfo.github} className="hover:underline">GitHub</a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-[14pt] font-bold border-b border-gray-300 pb-0.5 mb-2">Professional Summary</h2>
          <p className="text-justify leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Core Technical Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[14pt] font-bold border-b border-gray-300 pb-0.5 mb-2">Core Technical Skills</h2>
          <div className="space-y-1">
             <p><span className="font-bold">Skills:</span> {skills.join(', ')}</p>
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[14pt] font-bold border-b border-gray-300 pb-0.5 mb-2">Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="font-bold text-[12pt]">{exp.role}</div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold">{exp.company}</span>
                  <span className="text-[10pt] italic">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1">
                  {exp.description.map((bullet, idx) => (
                    <li key={idx} className="pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[14pt] font-bold border-b border-gray-300 pb-0.5 mb-2">Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="font-bold text-[12pt]">{project.name}</div>
                {project.role && <div className="italic text-[10pt] mb-1">Role: {project.role}</div>}
                <ul className="list-disc list-outside ml-5 space-y-1">
                  {project.description.map((bullet, idx) => (
                    <li key={idx} className="pl-1">{bullet}</li>
                  ))}
                </ul>
                <div className="text-[10pt] mt-1">
                  <span className="font-bold">Tech Stack:</span> {project.technologies.join(', ')}
                </div>
                <div className="flex gap-3 text-[10pt] text-blue-600 mt-0.5">
                  {project.github && <a href={project.github} className="hover:underline">GitHub</a>}
                  {project.liveDemo && <a href={project.liveDemo} className="hover:underline">Live Demo</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[14pt] font-bold border-b border-gray-300 pb-0.5 mb-2">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</span>
                  <span className="text-[10pt] italic">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-[10pt] italic">{edu.school}, {edu.location}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[14pt] font-bold border-b border-gray-300 pb-0.5 mb-2">Certifications</h2>
          <ul className="list-disc list-outside ml-5 space-y-0.5">
            {certifications.map((cert, idx) => (
              <li key={idx} className="pl-1">{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional Information */}
      {additionalInfo && (
        <section>
          <h2 className="text-[14pt] font-bold border-b border-gray-300 pb-0.5 mb-2">Additional Information</h2>
          <div className="space-y-0.5 text-[10.5pt]">
            {additionalInfo.languages && additionalInfo.languages.length > 0 && (
              <p><span className="font-bold">Languages:</span> {additionalInfo.languages.join(', ')}</p>
            )}
            {additionalInfo.workAuthorization && (
              <p><span className="font-bold">Work Authorization:</span> {additionalInfo.workAuthorization}</p>
            )}
            {additionalInfo.noticePeriod && (
              <p><span className="font-bold">Notice Period:</span> {additionalInfo.noticePeriod}</p>
            )}
          </div>
        </section>
      )}

      <style jsx>{`
        @media print {
          .bg-white { box-shadow: none !important; border: none !important; p: 0 !important; }
        }
      `}</style>
    </div>
  );
}
