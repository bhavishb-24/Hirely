import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  ResumeCustomization,
  defaultCustomization,
  SectionConfig,
  TypographySettings,
  LayoutSettings,
  ColorSettings,
  HeaderSettings,
  SkillsSettings,
  DensityPreset,
  densityPresetValues,
  SectionId,
} from "@/types/resumeCustomization";

interface ResumeCustomizationContextType {
  customization: ResumeCustomization;
  updateSections: (sections: SectionConfig[]) => void;
  updateTypography: (typography: Partial<TypographySettings>) => void;
  updateLayout: (layout: Partial<LayoutSettings>) => void;
  updateColors: (colors: Partial<ColorSettings>) => void;
  updateHeader: (header: Partial<HeaderSettings>) => void;
  updateSkills: (skills: Partial<SkillsSettings>) => void;
  setDensityPreset: (preset: DensityPreset) => void;
  toggleSectionVisibility: (sectionId: SectionId) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  updateSectionTitle: (sectionId: SectionId, title: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "resume-customization";

const ResumeCustomizationContext = createContext<ResumeCustomizationContextType | undefined>(undefined);

export function ResumeCustomizationProvider({ children }: { children: ReactNode }) {
  const [customization, setCustomization] = useState<ResumeCustomization>(defaultCustomization);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all fields exist
        setCustomization({
          ...defaultCustomization,
          ...parsed,
          sections: parsed.sections || defaultCustomization.sections,
          typography: { ...defaultCustomization.typography, ...parsed.typography },
          layout: { ...defaultCustomization.layout, ...parsed.layout },
          colors: { ...defaultCustomization.colors, ...parsed.colors },
          header: { ...defaultCustomization.header, ...parsed.header },
          skills: { ...defaultCustomization.skills, ...parsed.skills },
        });
      } catch (e) {
        console.error("Failed to parse stored customization:", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
  }, [customization]);

  const updateSections = useCallback((sections: SectionConfig[]) => {
    setCustomization((prev) => ({ ...prev, sections }));
  }, []);

  const updateTypography = useCallback((typography: Partial<TypographySettings>) => {
    setCustomization((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...typography },
    }));
  }, []);

  const updateLayout = useCallback((layout: Partial<LayoutSettings>) => {
    setCustomization((prev) => ({
      ...prev,
      layout: { ...prev.layout, ...layout },
    }));
  }, []);

  const updateColors = useCallback((colors: Partial<ColorSettings>) => {
    setCustomization((prev) => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));
  }, []);

  const updateHeader = useCallback((header: Partial<HeaderSettings>) => {
    setCustomization((prev) => ({
      ...prev,
      header: { ...prev.header, ...header },
    }));
  }, []);

  const updateSkills = useCallback((skills: Partial<SkillsSettings>) => {
    setCustomization((prev) => ({
      ...prev,
      skills: { ...prev.skills, ...skills },
    }));
  }, []);

  const setDensityPreset = useCallback((preset: DensityPreset) => {
    const presetValues = densityPresetValues[preset];
    setCustomization((prev) => ({
      ...prev,
      layout: { ...prev.layout, ...presetValues, densityPreset: preset },
    }));
  }, []);

  const toggleSectionVisibility = useCallback((sectionId: SectionId) => {
    setCustomization((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      ),
    }));
  }, []);

  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    setCustomization((prev) => {
      const sorted = [...prev.sections].sort((a, b) => a.order - b.order);
      const [moved] = sorted.splice(fromIndex, 1);
      sorted.splice(toIndex, 0, moved);
      const reordered = sorted.map((s, idx) => ({ ...s, order: idx }));
      return { ...prev, sections: reordered };
    });
  }, []);

  const updateSectionTitle = useCallback((sectionId: SectionId, title: string) => {
    setCustomization((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, customTitle: title || undefined } : s
      ),
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setCustomization(defaultCustomization);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ResumeCustomizationContext.Provider
      value={{
        customization,
        updateSections,
        updateTypography,
        updateLayout,
        updateColors,
        updateHeader,
        updateSkills,
        setDensityPreset,
        toggleSectionVisibility,
        reorderSections,
        updateSectionTitle,
        resetToDefaults,
      }}
    >
      {children}
    </ResumeCustomizationContext.Provider>
  );
}

export function useResumeCustomization() {
  const context = useContext(ResumeCustomizationContext);
  if (!context) {
    throw new Error("useResumeCustomization must be used within a ResumeCustomizationProvider");
  }
  return context;
}
