import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Edit2, Check } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ThemeSelector } from "./ThemeSelector";
import { ResumeTheme } from "@/types/resumeThemes";
import { useResumeTheme } from "@/contexts/ResumeThemeContext";

interface EnhancedResumeData {
  fullName: string;
  jobTitle: string;
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

  // Generate inline styles based on theme
  const getResumeStyles = (theme: ResumeTheme): React.CSSProperties => ({
    fontFamily: theme.fontFamily,
    fontSize: theme.bodyStyle.fontSize,
    lineHeight: theme.bodyStyle.lineHeight,
    color: theme.colors.bodyText,
  });

  const getHeaderStyles = (theme: ResumeTheme): React.CSSProperties => ({
    fontSize: theme.headerStyle.fontSize,
    fontWeight: theme.headerStyle.fontWeight,
    textAlign: theme.headerStyle.textAlign,
    borderBottom: theme.headerStyle.borderBottom ? `2px solid ${theme.colors.accent}` : "none",
    marginBottom: theme.headerStyle.marginBottom,
    paddingBottom: theme.headerStyle.borderBottom ? "1rem" : "0",
    color: theme.colors.headerText,
  });

  const getSectionTitleStyles = (theme: ResumeTheme): React.CSSProperties => ({
    fontSize: theme.sectionStyle.titleFontSize,
    fontWeight: theme.sectionStyle.titleFontWeight,
    textTransform: theme.sectionStyle.titleTextTransform,
    letterSpacing: theme.sectionStyle.titleLetterSpacing,
    borderBottom: theme.sectionStyle.titleBorderBottom ? `1px solid ${theme.colors.mutedText}` : "none",
    paddingBottom: theme.sectionStyle.titleBorderBottom ? "0.25rem" : "0",
    marginBottom: "0.75rem",
    color: theme.sectionStyle.titleAccentColor ? theme.colors.accent : theme.colors.headerText,
  });

  const getSectionStyles = (theme: ResumeTheme): React.CSSProperties => ({
    marginBottom: theme.sectionStyle.spacing,
  });

  return (
    <div className="space-y-6">
      {/* Theme Selector */}
      <ThemeSelector />

      {/* Download Button */}
      <div className="flex justify-end">
        <Button onClick={downloadPDF} disabled={isDownloading}>
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Generating PDF..." : "Download as PDF"}
        </Button>
      </div>

      {/* Resume Preview */}
      <Card className="p-0 overflow-hidden transition-all duration-300">
        <div
          ref={resumeRef}
          className="bg-white p-8 md:p-12 max-w-[800px] mx-auto"
          style={getResumeStyles(theme)}
        >
          {/* Header */}
          <header style={getHeaderStyles(theme)}>
            <h1 style={{ margin: 0, marginBottom: "0.25rem" }}>
              {data.fullName}
            </h1>
            <p style={{ 
              fontSize: "1.1rem", 
              color: theme.colors.mutedText,
              margin: 0,
              fontWeight: 400 
            }}>
              {data.jobTitle}
            </p>
          </header>

          {/* Summary */}
          {data.summary && (
            <section style={getSectionStyles(theme)}>
              <h2 style={getSectionTitleStyles(theme)}>
                Professional Summary
              </h2>
              <p style={{ margin: 0 }}>
                <EditableText field="summary" value={data.summary} />
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experiences.length > 0 && (
            <section style={getSectionStyles(theme)}>
              <h2 style={getSectionTitleStyles(theme)}>
                Experience
              </h2>
              {data.experiences.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                    <div>
                      <h3 style={{ fontWeight: 600, margin: 0, color: theme.colors.bodyText }}>{exp.role}</h3>
                      <p style={{ fontStyle: "italic", color: theme.colors.mutedText, margin: 0 }}>{exp.company}</p>
                    </div>
                    <span style={{ color: theme.colors.mutedText, fontSize: "0.875rem" }}>
                      {exp.duration}
                    </span>
                  </div>
                  <ul style={{ listStyleType: "disc", paddingLeft: "1.25rem", margin: "0.5rem 0 0 0" }}>
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} style={{ marginBottom: "0.25rem" }}>
                        <EditableText
                          field={`experience.${idx}.bullets.${bulletIdx}`}
                          value={bullet}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section style={getSectionStyles(theme)}>
              <h2 style={getSectionTitleStyles(theme)}>
                Skills
              </h2>
              <p style={{ margin: 0 }}>{data.skills.join(theme.bodyStyle.skillsSeparator)}</p>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section style={getSectionStyles(theme)}>
              <h2 style={getSectionTitleStyles(theme)}>
                Education
              </h2>
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
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section style={getSectionStyles(theme)}>
              <h2 style={getSectionTitleStyles(theme)}>
                Projects
              </h2>
              {data.projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: "0.75rem" }}>
                  <h3 style={{ fontWeight: 600, margin: 0, color: theme.colors.bodyText }}>{proj.name}</h3>
                  <p style={{ margin: "0.25rem 0 0 0" }}>
                    <EditableText
                      field={`project.${idx}.description`}
                      value={proj.description}
                    />
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {data.certifications && (
            <section style={getSectionStyles(theme)}>
              <h2 style={getSectionTitleStyles(theme)}>
                Certifications & Achievements
              </h2>
              <p style={{ margin: 0 }}>
                <EditableText field="certifications" value={data.certifications} />
              </p>
            </section>
          )}
        </div>
      </Card>
    </div>
  );
}
