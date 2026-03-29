'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './auth-context';
import {
  ResumeData,
  initialResumeData,
  ResumeMetadata,
  findResumeFiles,
  fetchResumeFileContent,
  createResumeFile,
  updateResumeFile,
  deleteResumeFile,
  renameResumeFile,
} from '@/lib/google-drive';

interface ResumeContextType {
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;
  isSyncing: boolean;
  lastSynced: string | null;
  resumes: ResumeMetadata[];
  activeResumeId: string | null;
  switchResume: (id: string) => Promise<void>;
  createNewResume: (role: string, copyFromId?: string) => Promise<void>;
  updateResumeRole: (id: string, newRole: string) => Promise<void>;
  deleteExistingResume: (id: string) => Promise<void>;
  refreshResumes: () => Promise<ResumeMetadata[]>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refreshResumes = async () => {
    if (isAuthenticated && user?.access_token) {
      try {
        const list = await findResumeFiles(user.access_token);
        setResumes(list);
        return list;
      } catch (err) {
        console.error('Error refreshing resumes:', err);
      }
    }
    return [];
  };

  // Load list of resumes and initial active resume on login
  useEffect(() => {
    const loadInitialData = async () => {
      if (isAuthenticated && user?.access_token) {
        setIsSyncing(true);
        setIsFirstLoad(true);
        try {
          const list = await refreshResumes();
          if (list.length > 0) {
            // Load the first resume or a previously saved active ID (if we had persistence for that)
            const firstResume = list[0];
            setActiveResumeId(firstResume.id);
            const content = await fetchResumeFileContent(user.access_token, firstResume.id);
            setResumeData(sanitizeResumeData(content));
            setLastSynced(content.updatedAt || new Date().toISOString());
          } else {
            // No resumes found, keep initial empty data
            setActiveResumeId(null);
            setResumeData(initialResumeData);
          }
        } catch (err) {
          console.error('Error loading initial resume data:', err);
        } finally {
          setIsSyncing(false);
          // Small delay to ensure state is updated before enabling auto-save
          setTimeout(() => setIsFirstLoad(false), 500);
        }
      } else {
        setResumeData(initialResumeData);
        setResumes([]);
        setActiveResumeId(null);
        setLastSynced(null);
        setIsFirstLoad(true);
      }
    };

    loadInitialData();
  }, [isAuthenticated, user?.access_token]);

  // Debounced auto-save to Google Drive
  useEffect(() => {
    if (isAuthenticated && user?.access_token && !isFirstLoad) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
        setIsSyncing(true);
        try {
          if (activeResumeId) {
            await updateResumeFile(user.access_token, activeResumeId, resumeData);
            setLastSynced(new Date().toISOString());
          } else {
            // This case happens if the user starts typing before a file is created
            // We'll create a "Default" resume
            const newId = await createResumeFile(user.access_token, resumeData, 'Default');
            setActiveResumeId(newId);
            await refreshResumes();
            setLastSynced(new Date().toISOString());
          }
        } catch (err) {
          console.error('Error saving resume data:', err);
        } finally {
          setIsSyncing(false);
        }
      }, 3000);
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [resumeData, activeResumeId, isAuthenticated, user?.access_token, isFirstLoad]);

  const sanitizeResumeData = (content: any): ResumeData => {
    return {
      ...initialResumeData,
      ...content,
      personalInfo: { ...initialResumeData.personalInfo, ...(content.personalInfo || {}) },
      additionalInfo: { ...initialResumeData.additionalInfo, ...(content.additionalInfo || {}) },
      experience: content.experience || [],
      education: content.education || [],
      projects: content.projects || [],
      skills: Array.isArray(content.skills) 
        ? content.skills.map((s: any) => typeof s === 'string' ? { id: Math.random().toString(), category: 'General', items: [s] } : s)
        : initialResumeData.skills,
      certifications: content.certifications || [],
    };
  };

  const switchResume = async (id: string) => {
    if (!isAuthenticated || !user?.access_token) return;
    
    setIsSyncing(true);
    setIsFirstLoad(true); // Disable auto-save during switch
    try {
      const content = await fetchResumeFileContent(user.access_token, id);
      setResumeData(sanitizeResumeData(content));
      setActiveResumeId(id);
      setLastSynced(content.updatedAt || new Date().toISOString());
    } catch (err) {
      console.error('Error switching resume:', err);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setIsFirstLoad(false), 500);
    }
  };

  const createNewResume = async (role: string, copyFromId?: string) => {
    if (!isAuthenticated || !user?.access_token) return;

    setIsSyncing(true);
    setIsFirstLoad(true);
    try {
      let newData = initialResumeData;
      if (copyFromId) {
        const sourceContent = await fetchResumeFileContent(user.access_token, copyFromId);
        newData = { ...sanitizeResumeData(sourceContent), updatedAt: new Date().toISOString() };
      }
      
      const newId = await createResumeFile(user.access_token, newData, role);
      await refreshResumes();
      setActiveResumeId(newId);
      setResumeData(newData);
      setLastSynced(newData.updatedAt);
    } catch (err) {
      console.error('Error creating new resume:', err);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setIsFirstLoad(false), 500);
    }
  };

  const updateResumeRole = async (id: string, newRole: string) => {
    if (!isAuthenticated || !user?.access_token) return;

    try {
      await renameResumeFile(user.access_token, id, newRole);
      await refreshResumes();
    } catch (err) {
      console.error('Error updating resume role:', err);
    }
  };

  const deleteExistingResume = async (id: string) => {
    if (!isAuthenticated || !user?.access_token) return;

    try {
      await deleteResumeFile(user.access_token, id);
      const newList = await refreshResumes();
      
      if (activeResumeId === id) {
        if (newList.length > 0) {
          await switchResume(newList[0].id);
        } else {
          setActiveResumeId(null);
          setResumeData(initialResumeData);
        }
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  const updateResumeData = (data: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...data }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateResumeData,
        isSyncing,
        lastSynced,
        resumes,
        activeResumeId,
        switchResume,
        createNewResume,
        updateResumeRole,
        deleteExistingResume,
        refreshResumes,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
