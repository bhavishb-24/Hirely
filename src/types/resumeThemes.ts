export type ResumeThemeId = 
  | "modern-professional" 
  | "minimal-classic" 
  | "creative-accent"
  | "executive-elite"
  | "tech-focused"
  | "creative-professional"
  | "academic-research"
  | "minimal-ats";

export interface ResumeTheme {
  id: ResumeThemeId;
  name: string;
  description: string;
  fontFamily: string;
  isPremium: boolean;
  headerStyle: {
    fontSize: string;
    fontWeight: string;
    textAlign: "left" | "center" | "right";
    borderBottom: boolean;
    marginBottom: string;
  };
  sectionStyle: {
    titleFontSize: string;
    titleFontWeight: string;
    titleTextTransform: "uppercase" | "capitalize" | "none";
    titleLetterSpacing: string;
    titleBorderBottom: boolean;
    titleAccentColor: boolean;
    spacing: string;
  };
  bodyStyle: {
    fontSize: string;
    lineHeight: string;
    skillsSeparator: string;
  };
  colors: {
    accent: string;
    headerText: string;
    bodyText: string;
    mutedText: string;
  };
}

export const resumeThemes: Record<ResumeThemeId, ResumeTheme> = {
  "modern-professional": {
    id: "modern-professional",
    name: "Modern Professional",
    description: "Clean layout with bold headers. Ideal for tech and corporate roles.",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    isPremium: false,
    headerStyle: {
      fontSize: "2rem",
      fontWeight: "700",
      textAlign: "center",
      borderBottom: true,
      marginBottom: "2rem",
    },
    sectionStyle: {
      titleFontSize: "1.1rem",
      titleFontWeight: "600",
      titleTextTransform: "uppercase",
      titleLetterSpacing: "0.05em",
      titleBorderBottom: true,
      titleAccentColor: false,
      spacing: "1.5rem",
    },
    bodyStyle: {
      fontSize: "0.95rem",
      lineHeight: "1.6",
      skillsSeparator: " • ",
    },
    colors: {
      accent: "hsl(221, 83%, 53%)",
      headerText: "hsl(222, 47%, 11%)",
      bodyText: "hsl(222, 47%, 11%)",
      mutedText: "hsl(215, 16%, 47%)",
    },
  },
  "minimal-classic": {
    id: "minimal-classic",
    name: "Minimal Classic",
    description: "Simple typography with clean spacing. Great for ATS-heavy applications.",
    fontFamily: "'Times New Roman', Georgia, serif",
    isPremium: false,
    headerStyle: {
      fontSize: "1.75rem",
      fontWeight: "400",
      textAlign: "center",
      borderBottom: false,
      marginBottom: "1.5rem",
    },
    sectionStyle: {
      titleFontSize: "1rem",
      titleFontWeight: "700",
      titleTextTransform: "uppercase",
      titleLetterSpacing: "0.1em",
      titleBorderBottom: false,
      titleAccentColor: false,
      spacing: "1.25rem",
    },
    bodyStyle: {
      fontSize: "1rem",
      lineHeight: "1.5",
      skillsSeparator: ", ",
    },
    colors: {
      accent: "hsl(0, 0%, 0%)",
      headerText: "hsl(0, 0%, 0%)",
      bodyText: "hsl(0, 0%, 15%)",
      mutedText: "hsl(0, 0%, 40%)",
    },
  },
  "creative-accent": {
    id: "creative-accent",
    name: "Creative Accent",
    description: "Accent colors with visual hierarchy. Still ATS-safe.",
    fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
    isPremium: false,
    headerStyle: {
      fontSize: "2.25rem",
      fontWeight: "700",
      textAlign: "left",
      borderBottom: true,
      marginBottom: "1.75rem",
    },
    sectionStyle: {
      titleFontSize: "1.05rem",
      titleFontWeight: "600",
      titleTextTransform: "uppercase",
      titleLetterSpacing: "0.08em",
      titleBorderBottom: false,
      titleAccentColor: true,
      spacing: "1.5rem",
    },
    bodyStyle: {
      fontSize: "0.95rem",
      lineHeight: "1.65",
      skillsSeparator: " | ",
    },
    colors: {
      accent: "hsl(262, 83%, 58%)",
      headerText: "hsl(262, 83%, 58%)",
      bodyText: "hsl(222, 47%, 11%)",
      mutedText: "hsl(215, 16%, 47%)",
    },
  },
  "executive-elite": {
    id: "executive-elite",
    name: "Executive Elite",
    description: "Elegant typography with subtle separators. Ideal for senior and leadership roles.",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    isPremium: false,
    headerStyle: {
      fontSize: "2.25rem",
      fontWeight: "600",
      textAlign: "center",
      borderBottom: true,
      marginBottom: "2.25rem",
    },
    sectionStyle: {
      titleFontSize: "1rem",
      titleFontWeight: "600",
      titleTextTransform: "uppercase",
      titleLetterSpacing: "0.15em",
      titleBorderBottom: true,
      titleAccentColor: false,
      spacing: "1.75rem",
    },
    bodyStyle: {
      fontSize: "0.95rem",
      lineHeight: "1.7",
      skillsSeparator: " • ",
    },
    colors: {
      accent: "hsl(220, 25%, 25%)",
      headerText: "hsl(220, 30%, 15%)",
      bodyText: "hsl(220, 20%, 20%)",
      mutedText: "hsl(220, 10%, 45%)",
    },
  },
  "tech-focused": {
    id: "tech-focused",
    name: "Tech Focused",
    description: "Clean sans-serif with compact spacing. Perfect for software and IT roles.",
    fontFamily: "'SF Mono', 'Consolas', 'Monaco', monospace",
    isPremium: false,
    headerStyle: {
      fontSize: "1.875rem",
      fontWeight: "700",
      textAlign: "left",
      borderBottom: true,
      marginBottom: "1.5rem",
    },
    sectionStyle: {
      titleFontSize: "0.95rem",
      titleFontWeight: "700",
      titleTextTransform: "uppercase",
      titleLetterSpacing: "0.1em",
      titleBorderBottom: false,
      titleAccentColor: true,
      spacing: "1.25rem",
    },
    bodyStyle: {
      fontSize: "0.9rem",
      lineHeight: "1.5",
      skillsSeparator: " | ",
    },
    colors: {
      accent: "hsl(160, 84%, 39%)",
      headerText: "hsl(210, 40%, 15%)",
      bodyText: "hsl(210, 25%, 20%)",
      mutedText: "hsl(210, 15%, 50%)",
    },
  },
  "creative-professional": {
    id: "creative-professional",
    name: "Creative Professional",
    description: "Expressive with strong visual hierarchy. ATS-safe single-column design.",
    fontFamily: "'Poppins', 'Helvetica Neue', sans-serif",
    isPremium: false,
    headerStyle: {
      fontSize: "2.5rem",
      fontWeight: "800",
      textAlign: "left",
      borderBottom: true,
      marginBottom: "2rem",
    },
    sectionStyle: {
      titleFontSize: "1.1rem",
      titleFontWeight: "700",
      titleTextTransform: "capitalize",
      titleLetterSpacing: "0.02em",
      titleBorderBottom: false,
      titleAccentColor: true,
      spacing: "1.5rem",
    },
    bodyStyle: {
      fontSize: "0.95rem",
      lineHeight: "1.65",
      skillsSeparator: " · ",
    },
    colors: {
      accent: "hsl(340, 82%, 52%)",
      headerText: "hsl(340, 82%, 52%)",
      bodyText: "hsl(0, 0%, 15%)",
      mutedText: "hsl(0, 0%, 45%)",
    },
  },
  "academic-research": {
    id: "academic-research",
    name: "Academic / Research",
    description: "Formal typography emphasizing education and publications. Ideal for academia.",
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    isPremium: false,
    headerStyle: {
      fontSize: "1.875rem",
      fontWeight: "400",
      textAlign: "center",
      borderBottom: false,
      marginBottom: "1.75rem",
    },
    sectionStyle: {
      titleFontSize: "1.05rem",
      titleFontWeight: "700",
      titleTextTransform: "uppercase",
      titleLetterSpacing: "0.08em",
      titleBorderBottom: true,
      titleAccentColor: false,
      spacing: "1.5rem",
    },
    bodyStyle: {
      fontSize: "1rem",
      lineHeight: "1.6",
      skillsSeparator: ", ",
    },
    colors: {
      accent: "hsl(210, 50%, 40%)",
      headerText: "hsl(0, 0%, 10%)",
      bodyText: "hsl(0, 0%, 15%)",
      mutedText: "hsl(0, 0%, 40%)",
    },
  },
  "minimal-ats": {
    id: "minimal-ats",
    name: "Minimal ATS",
    description: "Ultra-clean layout optimized for maximum ATS parsing. No icons or dividers.",
    fontFamily: "'Arial', 'Helvetica', sans-serif",
    isPremium: false,
    headerStyle: {
      fontSize: "1.75rem",
      fontWeight: "700",
      textAlign: "left",
      borderBottom: false,
      marginBottom: "1.25rem",
    },
    sectionStyle: {
      titleFontSize: "1rem",
      titleFontWeight: "700",
      titleTextTransform: "uppercase",
      titleLetterSpacing: "0",
      titleBorderBottom: false,
      titleAccentColor: false,
      spacing: "1.25rem",
    },
    bodyStyle: {
      fontSize: "1rem",
      lineHeight: "1.5",
      skillsSeparator: ", ",
    },
    colors: {
      accent: "hsl(0, 0%, 0%)",
      headerText: "hsl(0, 0%, 0%)",
      bodyText: "hsl(0, 0%, 0%)",
      mutedText: "hsl(0, 0%, 30%)",
    },
  },
};
