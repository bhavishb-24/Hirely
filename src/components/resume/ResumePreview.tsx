import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Edit2, Check } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ThemeSelector } from "./ThemeSelector";
import { CustomizationPanel } from "./customization/CustomizationPanel";
import { useResumeTheme } from "@/contexts/ResumeThemeContext";
import { useResumeCustomization } from "@/contexts/ResumeCustomizationContext";
import {
  defaultCustomization,
  fontFamilyMap,
  sectionTitleLabels,
  SectionId,
} from "@/types/resumeCustomization";

export interface EnhancedResumeData {
  fullName: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  summary: string;
  experiences: {
    role: string;
    company: string;
    duration: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  skills: string[];
  projects: {
    name: string;
    description: string;
  }[];
  certifications: string;
  achievements?: string[];
  publications?: string[];
}

interface ResumePreviewProps {
  data: EnhancedResumeData;
  onUpdate: (data: EnhancedResumeData) => void;
}

export function ResumePreview({ data, onUpdate }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  
  const { theme } = useResumeTheme();
  const { customization, overrides } = useResumeCustomization();

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (!editingField) return;

    const [section, index, subfield] = editingField.split(".");

    if (section === "summary") {
      onUpdate({ ...data, summary: editValue });
    } else if (section === "certifications") {
      onUpdate({ ...data, certifications: editValue });
    } else if (section === "experience" && index && subfield) {
      const idx = parseInt(index);
      if (subfield === "bullets") {
        const bulletIdx = parseInt(editingField.split(".")[3]);
        const newExperiences = [...data.experiences];
        newExperiences[idx].bullets[bulletIdx] = editValue;
        onUpdate({ ...data, experiences: newExperiences });
      }
    } else if (section === "project" && index) {
      const idx = parseInt(index);
      const newProjects = [...data.projects];
      newProjects[idx].description = editValue;
      onUpdate({ ...data, projects: newProjects });
    }

    setEditingField(null);
    setEditValue("");
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save(`${data.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const EditableText = ({
    field,
    value,
    className = ""
  }: {
    field: string;
    value: string;
    className?: string;
  }) => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 border-b border-primary bg-transparent outline-none"
            autoFocus
          />
          <button onClick={saveEdit} className="text-primary">
            <Check className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <span
        className={`group cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 ${className}`}
        onClick={() => startEdit(field, value)}
      >
        {value}
        <Edit2 className="h-3 w-3 ml-1 inline opacity-0 group-hover:opacity-50" />
      </span>
    );
  };

  // Get sorted visible sections
  const visibleSections = customization.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const getSectionConfig = (sectionId: SectionId) =>
    customization.sections.find((s) => s.id === sectionId) ??
    defaultCustomization.sections.find((s) => s.id === sectionId)!;

  // Get section title (custom or default)
  const getSectionTitle = (sectionId: SectionId) => {
    const section = customization.sections.find((s) => s.id === sectionId);
    return section?.customTitle || sectionTitleLabels[sectionId];
  };

  // Get separator character based on settings
  const getSeparator = () => {
    switch (customization.header.separatorStyle) {
      case "dot":
        return " • ";
      case "line":
        return " | ";
      case "space":
        return "   ";
      default:
        return " • ";
    }
  };

  // Build contact info array
  const contactInfo: string[] = [];
  if (customization.header.showEmail && data.email) contactInfo.push(data.email);
  if (customization.header.showPhone && data.phone) contactInfo.push(data.phone);
  if (customization.header.showLocation && data.location) contactInfo.push(data.location);
  if (customization.header.showLinkedIn && data.linkedin) contactInfo.push(data.linkedin);
  if (customization.header.showPortfolio && data.portfolio) contactInfo.push(data.portfolio);

  // Theme provides the base; customization values override when the user changes them
  const accentColor = overrides.colors.accentColor ? customization.colors.accentColor : theme.colors.accent;

  const themeHeaderAlign: "left" | "center" =
    theme.headerStyle.textAlign === "right" ? "left" : theme.headerStyle.textAlign;

  const headerAlignment: "left" | "center" = overrides.header.alignment
    ? customization.header.alignment
    : themeHeaderAlign;

  const effectiveFontFamily = overrides.typography.fontFamily
    ? fontFamilyMap[customization.typography.fontFamily]
    : theme.fontFamily;

  const effectiveNameFontSize = overrides.typography.nameFontSize
    ? `${customization.typography.nameFontSize}px`
    : theme.headerStyle.fontSize;

  const effectiveSectionHeaderFontSize = overrides.typography.sectionHeaderFontSize
    ? `${customization.typography.sectionHeaderFontSize}px`
    : theme.sectionStyle.titleFontSize;

  const effectiveBodyFontSize = overrides.typography.bodyFontSize
    ? `${customization.typography.bodyFontSize}px`
    : theme.bodyStyle.fontSize;

  const effectiveLineHeight = overrides.typography.lineHeight
    ? String(customization.typography.lineHeight)
    : theme.bodyStyle.lineHeight;

  const effectiveSectionSpacing = overrides.layout.sectionSpacing
    ? `${customization.layout.sectionSpacing}rem`
    : theme.sectionStyle.spacing;

  const groupSkills = (skillsList: string[]) => {
    const buckets: Array<{ label: string; items: string[] }> = [
      { label: "Languages", items: [] },
      { label: "Frameworks", items: [] },
      { label: "Databases", items: [] },
      { label: "Cloud", items: [] },
      { label: "Tools", items: [] },
      { label: "Other", items: [] },
    ];

    const normalize = (s: string) => s.trim().toLowerCase();

    const matchers: Array<{ idx: number; test: (s: string) => boolean }> = [
      {
        idx: 0,
        test: (s) =>
          /(python|javascript|typescript|java\b|c\+\+|c#|golang|\bgo\b|rust|sql)/.test(s),
      },
      {
        idx: 1,
        test: (s) =>
          /(react|vue|angular|node\.js|node|express|next\.js|django|flask|spring)/.test(s),
      },
      { idx: 2, test: (s) => /(postgres|mysql|mongodb|redis|sqlite)/.test(s) },
      { idx: 3, test: (s) => /(aws|azure|gcp|google cloud|firebase)/.test(s) },
      {
        idx: 4,
        test: (s) => /(git|docker|kubernetes|jira|figma|linux|webpack|vite)/.test(s),
      },
    ];

    skillsList.forEach((raw) => {
      const s = normalize(raw);
      const matcher = matchers.find((m) => m.test(s));
      const bucket = matcher ? buckets[matcher.idx] : buckets[buckets.length - 1];
      bucket.items.push(raw);
    });

    return buckets.filter((b) => b.items.length > 0);
  };

  const renderSkillsContent = () => {
    if (!data.skills || data.skills.length === 0) return null;

    // If the user hasn't touched skills formatting, defer to the theme
    if (!overrides.skills.displayStyle) {
      return <p style={{ margin: 0 }}>{data.skills.join(theme.bodyStyle.skillsSeparator)}</p>;
    }

    const style = customization.skills.displayStyle;

    if (style === "grouped") {
      const grouped = groupSkills(data.skills);
      return (
        <div className="space-y-1">
          {grouped.map((g) => (
            <p key={g.label} style={{ margin: 0 }}>
              <span style={{ fontWeight: 600 }}>{g.label}:</span> {g.items.join(", ")}
            </p>
          ))}
        </div>
      );
    }

    const separator = style === "bullets" ? " • " : ", ";
    return <p style={{ margin: 0 }}>{data.skills.join(separator)}</p>;
  };

  const resumeStyles: React.CSSProperties = {
    fontFamily: effectiveFontFamily,
    fontSize: effectiveBodyFontSize,
    lineHeight: effectiveLineHeight,
    letterSpacing: `${customization.typography.letterSpacing}em`,
    color: theme.colors.bodyText,
    padding: `${customization.layout.pageMargin}mm`,
  };

  const headerStyles: React.CSSProperties = {
    textAlign: headerAlignment,
    marginBottom: theme.headerStyle.marginBottom,
    borderBottom: theme.headerStyle.borderBottom ? `2px solid ${accentColor}` : "none",
    paddingBottom: theme.headerStyle.borderBottom ? "1rem" : "0",
  };

  const nameStyles: React.CSSProperties = {
    fontSize: effectiveNameFontSize,
    fontWeight: theme.headerStyle.fontWeight as React.CSSProperties["fontWeight"],
    margin: 0,
    marginBottom: "0.25rem",
    color: theme.colors.headerText,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: effectiveSectionHeaderFontSize,
    fontWeight: theme.sectionStyle.titleFontWeight as React.CSSProperties["fontWeight"],
    textTransform: theme.sectionStyle.titleTextTransform,
    letterSpacing: theme.sectionStyle.titleLetterSpacing,
    marginBottom: "0.75rem",
    paddingBottom: theme.sectionStyle.titleBorderBottom ? "0.25rem" : "0",
    borderBottom: theme.sectionStyle.titleBorderBottom
      ? `1px solid ${theme.colors.mutedText}`
      : "none",
    color: accentColor,
  };

  const sectionStyles: React.CSSProperties = {
    marginBottom: effectiveSectionSpacing,
  };

  const bulletStyles: React.CSSProperties = {
    marginBottom: `${customization.layout.bulletSpacing}rem`,
  };

  // Render individual sections
  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case "summary":
        if (!data.summary) return null;
        return (
          <section key={sectionId} style={sectionStyles}>
            <h2 style={sectionTitleStyles}>{getSectionTitle("summary")}</h2>
            <p style={{ margin: 0 }}>
              <EditableText field="summary" value={data.summary} />
            </p>
          </section>
        );

      case "experience":
        if (!data.experiences || data.experiences.length === 0) return null;

        return (
          <section key={sectionId} style={sectionStyles}>
            <h2 style={sectionTitleStyles}>{getSectionTitle("experience")}</h2>
            {data.experiences.map((exp, idx) => {
              const experienceConfig = getSectionConfig("experience");
              const limit = experienceConfig.bulletLimit ?? exp.bullets.length;
              const bullets = exp.bullets.slice(0, limit);

              return (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <div>
                      <h3 style={{ fontWeight: 600, margin: 0, color: theme.colors.bodyText }}>
                        {exp.role}
                      </h3>
                      <p style={{ fontStyle: "italic", color: theme.colors.mutedText, margin: 0 }}>
                        {exp.company}
                      </p>
                    </div>
                    <span style={{ color: theme.colors.mutedText, fontSize: "0.875rem" }}>
                      {exp.duration}
                    </span>
                  </div>

                  {experienceConfig.useBullets ? (
                    <ul style={{ listStyleType: "disc", paddingLeft: "1.25rem", margin: "0.5rem 0 0 0" }}>
                      {bullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} style={bulletStyles}>
                          <EditableText field={`experience.${idx}.bullets.${bulletIdx}`} value={bullet} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: "0.5rem 0 0 0" }}>{bullets.join(" ")}</p>
                  )}
                </div>
              );
            })}
          </section>
        );

      case "skills":
        if (!data.skills || data.skills.length === 0) return null;
        return (
          <section key={sectionId} style={sectionStyles}>
            <h2 style={sectionTitleStyles}>{getSectionTitle("skills")}</h2>
            {renderSkillsContent()}
          </section>
        );

      case "education":
        if (!data.education || data.education.length === 0) return null;
        return (
          <section key={sectionId} style={sectionStyles}>
            <h2 style={sectionTitleStyles}>{getSectionTitle("education")}</h2>
            {data.education.map((edu, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <h3 style={{ fontWeight: 600, margin: 0, color: theme.colors.bodyText }}>{edu.degree}</h3>
                  <p style={{ fontStyle: "italic", color: theme.colors.mutedText, margin: 0 }}>{edu.institution}</p>
                </div>
                <span style={{ color: theme.colors.mutedText, fontSize: "0.875rem" }}>{edu.year}</span>
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!data.projects || data.projects.length === 0) return null;
        return (
          <section key={sectionId} style={sectionStyles}>
            <h2 style={sectionTitleStyles}>{getSectionTitle("projects")}</h2>
            {data.projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: "0.75rem" }}>
                <h3 style={{ fontWeight: 600, margin: 0, color: theme.colors.bodyText }}>{proj.name}</h3>
                <p style={{ margin: "0.25rem 0 0 0" }}>
                  <EditableText field={`project.${idx}.description`} value={proj.description} />
                </p>
              </div>
            ))}
          </section>
        );

      case "certifications":
        if (!data.certifications) return null;
        return (
          <section key={sectionId} style={sectionStyles}>
            <h2 style={sectionTitleStyles}>{getSectionTitle("certifications")}</h2>
            <p style={{ margin: 0 }}>
              <EditableText field="certifications" value={data.certifications} />
            </p>
          </section>
        );

      case "achievements":
        if (!data.achievements || data.achievements.length === 0) return null;
        return (
          <section key={sectionId} style={sectionStyles}>
            <h2 style={sectionTitleStyles}>{getSectionTitle("achievements")}</h2>
            <ul style={{ listStyleType: "disc", paddingLeft: "1.25rem", margin: 0 }}>
              {data.achievements.map((achievement, idx) => (
                <li key={idx} style={bulletStyles}>{achievement}</li>
              ))}
            </ul>
          </section>
        );

      case "publications":
        if (!data.publications || data.publications.length === 0) return null;
        return (
          <section key={sectionId} style={sectionStyles}>
            <h2 style={sectionTitleStyles}>{getSectionTitle("publications")}</h2>
            {data.publications.map((pub, idx) => (
              <p key={idx} style={{ margin: 0, marginBottom: "0.5rem" }}>{pub}</p>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <CustomizationPanel />
        </div>
        <Button onClick={downloadPDF} disabled={isDownloading}>
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </Button>
      </div>

      {/* Resume Preview */}
      <Card className="p-0 overflow-hidden transition-all duration-300">
        <div
          ref={resumeRef}
          className="bg-white max-w-[800px] mx-auto"
          style={resumeStyles}
        >
          {/* Header */}
          <header style={headerStyles}>
            <h1 style={nameStyles}>{data.fullName}</h1>
            <p
              style={{
                fontSize: effectiveBodyFontSize,
                color: theme.colors.mutedText,
                margin: 0,
                fontWeight: 400,
              }}
            >
              {data.jobTitle}
            </p>
            {contactInfo.length > 0 && (
              <p style={{ 
                fontSize: "0.875rem", 
                color: theme.colors.mutedText,
                margin: "0.5rem 0 0 0",
              }}>
                {contactInfo.join(getSeparator())}
              </p>
            )}
          </header>

          {/* Dynamic Sections */}
          {visibleSections.map((section) => renderSection(section.id))}
        </div>
      </Card>
    </div>
  );
}
