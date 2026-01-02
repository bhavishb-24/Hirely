import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowRight, FileText, Sparkles, Eye, EyeOff } from "lucide-react";

interface ImprovedResumeData {
  fullName: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location?: string;
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
  improvements?: string[];
}

interface ResumeComparisonProps {
  originalText: string;
  improvedResume: ImprovedResumeData;
  onContinue: () => void;
  onBack: () => void;
}

export function ResumeComparison({ 
  originalText, 
  improvedResume, 
  onContinue,
  onBack 
}: ResumeComparisonProps) {
  const [showComparison, setShowComparison] = useState(true);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Improvements Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Key Improvements Made
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid sm:grid-cols-2 gap-2">
            {improvedResume.improvements?.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Toggle Comparison View */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Original
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Comparison
            </>
          )}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            ← Edit Input
          </Button>
          <Button onClick={onContinue}>
            Continue to Preview
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {showComparison ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Original Resume */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Original Resume
                <Badge variant="secondary" className="ml-auto">Before</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                  {originalText}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Improved Resume */}
          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Improved Resume
                <Badge className="ml-auto bg-primary">After</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 text-sm">
                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{improvedResume.fullName}</h3>
                    <p className="text-primary font-medium">{improvedResume.jobTitle}</p>
                    {(improvedResume.email || improvedResume.phone || improvedResume.location) && (
                      <p className="text-muted-foreground text-xs mt-1">
                        {[improvedResume.email, improvedResume.phone, improvedResume.location]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                  </div>

                  {/* Summary */}
                  {improvedResume.summary && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Summary</h4>
                      <p className="text-muted-foreground">{improvedResume.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {improvedResume.experiences?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Experience</h4>
                      {improvedResume.experiences.map((exp, i) => (
                        <div key={i} className="mb-3">
                          <p className="font-medium text-foreground">{exp.role}</p>
                          <p className="text-muted-foreground text-xs">
                            {exp.company} • {exp.duration}
                          </p>
                          <ul className="mt-1 space-y-1">
                            {exp.bullets?.map((bullet, j) => (
                              <li key={j} className="text-muted-foreground pl-3 relative before:content-['•'] before:absolute before:left-0">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {improvedResume.education?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Education</h4>
                      {improvedResume.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                          <p className="font-medium text-foreground">{edu.degree}</p>
                          <p className="text-muted-foreground text-xs">
                            {edu.institution} • {edu.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {improvedResume.skills?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {improvedResume.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {improvedResume.projects?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Projects</h4>
                      {improvedResume.projects.map((project, i) => (
                        <div key={i} className="mb-2">
                          <p className="font-medium text-foreground">{project.name}</p>
                          <p className="text-muted-foreground text-xs">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certifications */}
                  {improvedResume.certifications && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Certifications</h4>
                      <p className="text-muted-foreground">{improvedResume.certifications}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Single View - Improved Resume Only */
        <Card className="border-primary/30 max-w-3xl mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Improved Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 text-sm">
                {/* Same content as above */}
                <div>
                  <h3 className="text-lg font-bold text-foreground">{improvedResume.fullName}</h3>
                  <p className="text-primary font-medium">{improvedResume.jobTitle}</p>
                </div>
                {improvedResume.summary && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Summary</h4>
                    <p className="text-muted-foreground">{improvedResume.summary}</p>
                  </div>
                )}
                {improvedResume.experiences?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Experience</h4>
                    {improvedResume.experiences.map((exp, i) => (
                      <div key={i} className="mb-3">
                        <p className="font-medium text-foreground">{exp.role}</p>
                        <p className="text-muted-foreground text-xs">{exp.company} • {exp.duration}</p>
                        <ul className="mt-1 space-y-1">
                          {exp.bullets?.map((bullet, j) => (
                            <li key={j} className="text-muted-foreground pl-3 relative before:content-['•'] before:absolute before:left-0">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
