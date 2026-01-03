// Resume Customization Types
// This defines the global customization system that applies uniformly across all resume workflows

export type SectionId = 
  | "summary"
  | "experience"
  | "skills"
  | "education"
  | "projects"
  | "certifications"
  | "achievements"
  | "publications";

export interface SectionConfig {
  id: SectionId;
  visible: boolean;
  order: number;
  customTitle?: string;
  useBullets: boolean; // vs paragraph style
  bulletLimit?: number; // max bullets per entry
}

export type FontFamily = 
  | "inter"
  | "georgia"
  | "times"
  | "arial"
  | "palatino"
  | "lato"
  | "roboto"
  | "merriweather";

export const fontFamilyMap: Record<FontFamily, string> = {
  inter: "'Inter', 'Segoe UI', sans-serif",
  georgia: "'Georgia', 'Times New Roman', serif",
  times: "'Times New Roman', 'Times', serif",
  arial: "'Arial', 'Helvetica', sans-serif",
  palatino: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
  lato: "'Lato', 'Helvetica Neue', sans-serif",
  roboto: "'Roboto', 'Helvetica Neue', sans-serif",
  merriweather: "'Merriweather', Georgia, serif",
};

export const fontFamilyLabels: Record<FontFamily, string> = {
  inter: "Inter",
  georgia: "Georgia",
  times: "Times New Roman",
  arial: "Arial",
  palatino: "Palatino",
  lato: "Lato",
  roboto: "Roboto",
  merriweather: "Merriweather",
};

export interface TypographySettings {
  fontFamily: FontFamily;
  nameFontSize: number; // in px
  sectionHeaderFontSize: number; // in px
  bodyFontSize: number; // in px
  lineHeight: number; // ratio like 1.5, 1.6
  letterSpacing: number; // in em like 0, 0.01, 0.02
}

export type DensityPreset = "compact" | "balanced" | "spacious";

export interface LayoutSettings {
  pageMargin: number; // in mm (for PDF)
  sectionSpacing: number; // in rem
  bulletSpacing: number; // in rem
  densityPreset: DensityPreset;
}

export const densityPresetValues: Record<DensityPreset, Partial<LayoutSettings>> = {
  compact: {
    pageMargin: 12,
    sectionSpacing: 1,
    bulletSpacing: 0.25,
  },
  balanced: {
    pageMargin: 20,
    sectionSpacing: 1.5,
    bulletSpacing: 0.375,
  },
  spacious: {
    pageMargin: 25,
    sectionSpacing: 2,
    bulletSpacing: 0.5,
  },
};

export interface ColorSettings {
  accentColor: string; // HSL string for section headers only
  // Body text always dark, background always white for ATS
}

// Predefined accent colors that are ATS-safe
export const accentColorPresets: { label: string; value: string }[] = [
  { label: "Black", value: "hsl(0, 0%, 0%)" },
  { label: "Navy", value: "hsl(220, 50%, 25%)" },
  { label: "Blue", value: "hsl(221, 83%, 40%)" },
  { label: "Teal", value: "hsl(180, 60%, 30%)" },
  { label: "Forest", value: "hsl(150, 50%, 25%)" },
  { label: "Burgundy", value: "hsl(350, 60%, 30%)" },
  { label: "Slate", value: "hsl(215, 20%, 35%)" },
  { label: "Charcoal", value: "hsl(0, 0%, 25%)" },
];

export type HeaderAlignment = "left" | "center";
export type SeparatorStyle = "dot" | "line" | "space";

export interface HeaderSettings {
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showLinkedIn: boolean;
  showPortfolio: boolean;
  alignment: HeaderAlignment;
  separatorStyle: SeparatorStyle;
}

export type SkillsDisplayStyle = "comma" | "grouped" | "bullets";

export interface SkillsSettings {
  displayStyle: SkillsDisplayStyle;
  // When grouped, skills can be organized by category
}

export interface ResumeCustomization {
  sections: SectionConfig[];
  typography: TypographySettings;
  layout: LayoutSettings;
  colors: ColorSettings;
  header: HeaderSettings;
  skills: SkillsSettings;
}

// Default customization settings
export const defaultSections: SectionConfig[] = [
  { id: "summary", visible: true, order: 0, useBullets: false },
  { id: "experience", visible: true, order: 1, useBullets: true, bulletLimit: 5 },
  { id: "skills", visible: true, order: 2, useBullets: false },
  { id: "education", visible: true, order: 3, useBullets: false },
  { id: "projects", visible: true, order: 4, useBullets: false },
  { id: "certifications", visible: true, order: 5, useBullets: false },
  { id: "achievements", visible: false, order: 6, useBullets: true },
  { id: "publications", visible: false, order: 7, useBullets: false },
];

export const defaultTypography: TypographySettings = {
  fontFamily: "inter",
  nameFontSize: 28,
  sectionHeaderFontSize: 14,
  bodyFontSize: 11,
  lineHeight: 1.5,
  letterSpacing: 0,
};

export const defaultLayout: LayoutSettings = {
  pageMargin: 20,
  sectionSpacing: 1.5,
  bulletSpacing: 0.375,
  densityPreset: "balanced",
};

export const defaultColors: ColorSettings = {
  accentColor: "hsl(221, 83%, 40%)",
};

export const defaultHeader: HeaderSettings = {
  showEmail: true,
  showPhone: true,
  showLocation: true,
  showLinkedIn: false,
  showPortfolio: false,
  alignment: "center",
  separatorStyle: "dot",
};

export const defaultSkills: SkillsSettings = {
  displayStyle: "comma",
};

export const defaultCustomization: ResumeCustomization = {
  sections: defaultSections,
  typography: defaultTypography,
  layout: defaultLayout,
  colors: defaultColors,
  header: defaultHeader,
  skills: defaultSkills,
};

// Section title labels
export const sectionTitleLabels: Record<SectionId, string> = {
  summary: "Professional Summary",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
  projects: "Projects",
  certifications: "Certifications",
  achievements: "Achievements",
  publications: "Publications",
};
