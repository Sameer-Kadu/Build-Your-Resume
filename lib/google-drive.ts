/**
 * Google Drive REST API Utility (Client-side)
 * Handles file searching, reading, and writing for 'resume-data.json'.
 */

const RESUME_FILENAME = 'resume-data.json';

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
  skills: string[];
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
  skills: [],
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
 * Search for the resume data file in Google Drive
 */
export const findResumeFile = async (accessToken: string): Promise<string | null> => {
  const query = `name = '${RESUME_FILENAME}' and trashed = false`;
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id, name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
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
export const createResumeFile = async (accessToken: string, data: ResumeData): Promise<string> => {
  const metadata = {
    name: RESUME_FILENAME,
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
