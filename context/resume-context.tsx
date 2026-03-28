'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './auth-context';
import {
  ResumeData,
  initialResumeData,
  findResumeFile,
  fetchResumeFileContent,
  createResumeFile,
  updateResumeFile,
} from '@/lib/google-drive';

interface ResumeContextType {
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;
  isSyncing: boolean;
  lastSynced: string | null;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load data from Google Drive on login
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && user?.access_token) {
        setIsSyncing(true);
        setIsFirstLoad(true);
        try {
          const id = await findResumeFile(user.access_token);
          if (id) {
            setFileId(id);
            const content = await fetchResumeFileContent(user.access_token, id);
            // Merge with initialResumeData to ensure all fields exist (for backward compatibility or partial data)
            const mergedData = {
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
            setResumeData(mergedData);
            setLastSynced(mergedData.updatedAt);
          } else {
            // If file not found, we don't create it yet to avoid empty file creation
            // We'll let the auto-save handle the first creation or create it manually if needed
            setFileId(null); 
          }
        } catch (err) {
          console.error('Error loading resume data:', err);
        } finally {
          setIsSyncing(false);
          // Small delay to ensure state is updated before enabling auto-save
          setTimeout(() => setIsFirstLoad(false), 500);
        }
      } else {
        setResumeData(initialResumeData);
        setFileId(null);
        setLastSynced(null);
        setIsFirstLoad(true);
      }
    };

    loadData();
  }, [isAuthenticated, user?.access_token]);

  // Debounced auto-save to Google Drive
  useEffect(() => {
    if (isAuthenticated && user?.access_token && !isFirstLoad) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
        setIsSyncing(true);
        try {
          if (fileId) {
            await updateResumeFile(user.access_token, fileId, resumeData);
          } else {
            const newId = await createResumeFile(user.access_token, resumeData);
            setFileId(newId);
          }
          setLastSynced(new Date().toISOString());
        } catch (err) {
          console.error('Error saving resume data:', err);
        } finally {
          setIsSyncing(false);
        }
      }, 3000); // 3 second debounce to reduce API calls
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [resumeData, fileId, isAuthenticated, user?.access_token, isFirstLoad]);

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
