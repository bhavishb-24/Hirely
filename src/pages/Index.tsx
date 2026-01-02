import { useState } from "react";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

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

export default function Index() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancedResume, setEnhancedResume] = useState<EnhancedResumeData | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (data: ResumeData) => {
    setIsGenerating(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke("enhance-resume", {
        body: { resumeData: data }
      });

      if (error) throw error;

      if (result.error) {
        throw new Error(result.error);
      }

      setEnhancedResume(result.enhancedResume);
      toast({
        title: "Resume Generated!",
        description: "Your AI-enhanced resume is ready. You can edit it before downloading."
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate resume",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateResume = (data: EnhancedResumeData) => {
    setEnhancedResume(data);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Resume Builder</h1>
              <p className="text-muted-foreground text-sm">
                Create professional, ATS-friendly resumes with AI
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!enhancedResume ? (
          <div className="max-w-2xl mx-auto">
            <ResumeForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Your Resume</h2>
              <button
                onClick={() => setEnhancedResume(null)}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                ← Back to form
              </button>
            </div>
            <ResumePreview data={enhancedResume} onUpdate={handleUpdateResume} />
          </div>
        )}
      </div>
    </main>
  );
}
