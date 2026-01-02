import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Edit2, Check } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={downloadPDF} disabled={isDownloading}>
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Generating PDF..." : "Download as PDF"}
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div
          ref={resumeRef}
          className="bg-background p-8 md:p-12 max-w-[800px] mx-auto"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {/* Header */}
          <header className="text-center mb-8 border-b border-border pb-6">
            <h1 className="text-3xl font-bold text-foreground mb-1">
              {data.fullName}
            </h1>
            <p className="text-lg text-muted-foreground">{data.jobTitle}</p>
          </header>

          {/* Summary */}
          {data.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
                Professional Summary
              </h2>
              <p className="text-foreground leading-relaxed">
                <EditableText field="summary" value={data.summary} />
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experiences.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
                Experience
              </h2>
              {data.experiences.map((exp, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-foreground">{exp.role}</h3>
                      <p className="text-muted-foreground italic">{exp.company}</p>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {exp.duration}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx}>
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
            <section className="mb-6">
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
                Skills
              </h2>
              <p className="text-foreground">{data.skills.join(" • ")}</p>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
                Education
              </h2>
              {data.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-foreground">{edu.degree}</h3>
                    <p className="text-muted-foreground italic">{edu.institution}</p>
                  </div>
                  <span className="text-muted-foreground text-sm">{edu.year}</span>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
                Projects
              </h2>
              {data.projects.map((proj, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-bold text-foreground">{proj.name}</h3>
                  <p className="text-foreground">
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
            <section className="mb-6">
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
                Certifications & Achievements
              </h2>
              <p className="text-foreground">
                <EditableText field="certifications" value={data.certifications} />
              </p>
            </section>
          )}
        </div>
      </Card>
    </div>
  );
}
