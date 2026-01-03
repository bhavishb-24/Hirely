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
type OverrideFlags<T extends object> = { [K in keyof T]: boolean };

export interface ResumeCustomizationOverrides {
  typography: OverrideFlags<TypographySettings>;
  layout: OverrideFlags<LayoutSettings>;
  colors: OverrideFlags<ColorSettings>;
  header: OverrideFlags<HeaderSettings>;
  skills: OverrideFlags<SkillsSettings>;
}

const toOverridePatch = <T extends object>(updates: Partial<T>) => {
  const patch: Partial<Record<keyof T, boolean>> = {};
  (Object.keys(updates) as Array<keyof T>).forEach((k) => {
    patch[k] = true;
  });
  return patch;
};

interface ResumeCustomizationContextType {
  customization: ResumeCustomization;
  overrides: ResumeCustomizationOverrides;
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
const OVERRIDES_STORAGE_KEY = "resume-customization-overrides";

const defaultOverrides: ResumeCustomizationOverrides = {
  typography: {
    fontFamily: false,
    nameFontSize: false,
    sectionHeaderFontSize: false,
    bodyFontSize: false,
    lineHeight: false,
    letterSpacing: false,
  },
  layout: {
    pageMargin: false,
    sectionSpacing: false,
    bulletSpacing: false,
    densityPreset: false,
  },
  colors: {
    accentColor: false,
  },
  header: {
    showEmail: false,
    showPhone: false,
    showLocation: false,
    showLinkedIn: false,
    showPortfolio: false,
    alignment: false,
    separatorStyle: false,
  },
  skills: {
    displayStyle: false,
  },
};

const ResumeCustomizationContext = createContext<ResumeCustomizationContextType | undefined>(undefined);

export function ResumeCustomizationProvider({ children }: { children: ReactNode }) {
  const [customization, setCustomization] = useState<ResumeCustomization>(defaultCustomization);
  const [overrides, setOverrides] = useState<ResumeCustomizationOverrides>(defaultOverrides);

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

    const storedOverrides = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    if (storedOverrides) {
      try {
        const parsed = JSON.parse(storedOverrides);
        setOverrides({
          ...defaultOverrides,
          ...parsed,
          typography: { ...defaultOverrides.typography, ...parsed.typography },
          layout: { ...defaultOverrides.layout, ...parsed.layout },
          colors: { ...defaultOverrides.colors, ...parsed.colors },
          header: { ...defaultOverrides.header, ...parsed.header },
          skills: { ...defaultOverrides.skills, ...parsed.skills },
        });
      } catch (e) {
        console.error("Failed to parse stored overrides:", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
  }, [customization]);

  useEffect(() => {
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  }, [overrides]);

  const updateSections = useCallback((sections: SectionConfig[]) => {
    setCustomization((prev) => ({ ...prev, sections }));
  }, []);

  const updateTypography = useCallback((typography: Partial<TypographySettings>) => {
    setCustomization((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...typography },
    }));

    setOverrides((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        ...toOverridePatch<TypographySettings>(typography),
      },
    }));
  }, []);

  const updateLayout = useCallback((layout: Partial<LayoutSettings>) => {
    setCustomization((prev) => ({
      ...prev,
      layout: { ...prev.layout, ...layout },
    }));

    setOverrides((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        ...toOverridePatch<LayoutSettings>(layout),
      },
    }));
  }, []);

  const updateColors = useCallback((colors: Partial<ColorSettings>) => {
    setCustomization((prev) => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));

    setOverrides((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...toOverridePatch<ColorSettings>(colors),
      },
    }));
  }, []);

  const updateHeader = useCallback((header: Partial<HeaderSettings>) => {
    setCustomization((prev) => ({
      ...prev,
      header: { ...prev.header, ...header },
    }));

    setOverrides((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        ...toOverridePatch<HeaderSettings>(header),
      },
    }));
  }, []);

  const updateSkills = useCallback((skills: Partial<SkillsSettings>) => {
    setCustomization((prev) => ({
      ...prev,
      skills: { ...prev.skills, ...skills },
    }));

    setOverrides((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        ...toOverridePatch<SkillsSettings>(skills),
      },
    }));
  }, []);

  const setDensityPreset = useCallback((preset: DensityPreset) => {
    const presetValues = densityPresetValues[preset];
    setCustomization((prev) => ({
      ...prev,
      layout: { ...prev.layout, ...presetValues, densityPreset: preset },
    }));

    setOverrides((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        densityPreset: true,
        pageMargin: true,
        sectionSpacing: true,
        bulletSpacing: true,
      },
    }));
  }, []);

  const toggleSectionVisibility = useCallback((sectionId: SectionId) => {
    setCustomization((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, visible: !s.visible } : s)),
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
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, customTitle: title || undefined } : s)),
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setCustomization(defaultCustomization);
    setOverrides(defaultOverrides);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OVERRIDES_STORAGE_KEY);
  }, []);

  return (
    <ResumeCustomizationContext.Provider
      value={{
        customization,
        overrides,
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
