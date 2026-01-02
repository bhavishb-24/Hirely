import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ResumeThemeId, resumeThemes, ResumeTheme } from "@/types/resumeThemes";

interface ResumeThemeContextType {
  selectedTheme: ResumeThemeId;
  theme: ResumeTheme;
  setSelectedTheme: (theme: ResumeThemeId) => void;
  isPremiumUser: boolean;
  setIsPremiumUser: (isPremium: boolean) => void;
}

const STORAGE_KEY = "resume-theme-preference";

const ResumeThemeContext = createContext<ResumeThemeContextType | undefined>(undefined);

export function ResumeThemeProvider({ children }: { children: ReactNode }) {
  const [selectedTheme, setSelectedThemeState] = useState<ResumeThemeId>("modern-professional");
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in resumeThemes) {
      setSelectedThemeState(stored as ResumeThemeId);
    }
  }, []);

  const setSelectedTheme = (theme: ResumeThemeId) => {
    setSelectedThemeState(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  const theme = resumeThemes[selectedTheme];

  return (
    <ResumeThemeContext.Provider
      value={{
        selectedTheme,
        theme,
        setSelectedTheme,
        isPremiumUser,
        setIsPremiumUser,
      }}
    >
      {children}
    </ResumeThemeContext.Provider>
  );
}

export function useResumeTheme() {
  const context = useContext(ResumeThemeContext);
  if (!context) {
    throw new Error("useResumeTheme must be used within a ResumeThemeProvider");
  }
  return context;
}
