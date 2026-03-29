/**
 * Google Drive REST API Utility (Client-side)
 * Handles file searching, reading, and writing for 'resume-data.json'.
 */

const RESUME_FILE_PREFIX = 'resume-data';
const RESUME_FILENAME_DEFAULT = 'resume-data.json';

export interface ResumeMetadata {
  id: string;
  name: string; // The filename
  role: string; // Extracted role from filename or 'Default'
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
    location: string;
  };
  summary: string;
  skills: SkillGroup[];
  experience: {
    id: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
  }[];
  projects: {
    id: string;
    name: string;
    role?: string;
    description: string[]; // Changed to array for bullets
    technologies: string[];
    github?: string;
    liveDemo?: string;
  }[];
  certifications: string[];
  additionalInfo: {
    languages: string[];
    workAuthorization: string;
    noticePeriod: string;
  };
  updatedAt: string;
}

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    website: '',
    location: '',
  },
  summary: '',
  skills: [
    { id: '1', category: 'Languages', items: ['Java', 'C', 'C++', 'Python', 'C#'] },
    { id: '2', category: 'Frameworks', items: ['Spring Boot', 'React'] },
    { id: '3', category: 'Testing', items: ['Selenium', 'Playwright', 'JUnit'] },
    { id: '4', category: 'Tools & Platforms', items: ['Git', 'Docker', 'CI/CD', 'Postman'] },
    { id: '5', category: 'Databases', items: ['MySQL', 'Oracle', 'PostgreSQL'] }
  ],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  additionalInfo: {
    languages: [],
    workAuthorization: '',
    noticePeriod: '',
  },
  updatedAt: new Date().toISOString(),
};

/**
 * Search for all resume data files in Google Drive
 */
export const findResumeFiles = async (accessToken: string): Promise<ResumeMetadata[]> => {
  const query = `name contains '${RESUME_FILE_PREFIX}' and trashed = false and mimeType = 'application/json'`;
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id, name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const data = await response.json();
  if (data.files) {
    return data.files.map((file: any) => {
      let role = 'Default';
      if (file.name.includes('-')) {
        // e.g., resume-data-SDE.json -> SDE
        role = file.name.replace(`${RESUME_FILE_PREFIX}-`, '').replace('.json', '');
        // Replace underscores back to spaces for UI display
        role = role.replace(/_/g, ' ');
      }
      return {
        id: file.id,
        name: file.name,
        role: role,
      };
    });
  }
  return [];
};

/**
 * Fetch the content of the resume data file
 */
export const fetchResumeFileContent = async (accessToken: string, fileId: string): Promise<ResumeData> => {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch resume data content');
  }

  return await response.json();
};

/**
 * Create a new resume data file in Google Drive
 */
export const createResumeFile = async (accessToken: string, data: ResumeData, role: string = ''): Promise<string> => {
  const filename = role ? `${RESUME_FILE_PREFIX}-${role.replace(/\s+/g, '_')}.json` : RESUME_FILENAME_DEFAULT;
  const metadata = {
    name: filename,
    mimeType: 'application/json',
  };

  const formData = new FormData();
  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  formData.append(
    'file',
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    }
  );

  const result = await response.json();
  return result.id;
};

/**
 * Update the existing resume data file in Google Drive
 */
export const updateResumeFile = async (
  accessToken: string,
  fileId: string,
  data: ResumeData
): Promise<void> => {
  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, updatedAt: new Date().toISOString() }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update resume data on Google Drive');
  }
};

/**
 * Delete a resume file (move to trash)
 */
export const deleteResumeFile = async (accessToken: string, fileId: string): Promise<void> => {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ trashed: true }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete resume file');
  }
};
