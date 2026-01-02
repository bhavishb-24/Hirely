import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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

type ViewMode = "dashboard" | "form" | "preview";

export default function Index() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile, signOut, user } = useAuth();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [enhancedResume, setEnhancedResume] = useState<EnhancedResumeData | null>(null);
  const [originalData, setOriginalData] = useState<ResumeData | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // Handle URL params for navigation
  useEffect(() => {
    const resumeId = searchParams.get("resume");
    const isNew = searchParams.get("new");

    if (isNew === "true") {
      setViewMode("form");
      setEnhancedResume(null);
      setOriginalData(null);
      setCurrentResumeId(null);
    } else if (resumeId) {
      loadResume(resumeId);
    } else {
      setViewMode("dashboard");
    }
  }, [searchParams]);

  const loadResume = async (id: string) => {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Resume not found",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    setOriginalData(data.original_data as unknown as ResumeData);
    setEnhancedResume(data.enhanced_data as unknown as EnhancedResumeData);
    setCurrentResumeId(id);
    setViewMode("preview");
  };

  const handleGenerate = async (data: ResumeData) => {
    setIsGenerating(true);
    setOriginalData(data);
    
    try {
      const { data: result, error } = await supabase.functions.invoke("enhance-resume", {
        body: { resumeData: data }
      });

      if (error) throw error;

      if (result.error) {
        throw new Error(result.error);
      }

      const enhanced = result.enhancedResume as EnhancedResumeData;
      setEnhancedResume(enhanced);
      
      // Save to database
      await saveResume(data, enhanced);
      
      setViewMode("preview");
      toast({
        title: "Resume Generated!",
        description: "Your AI-enhanced resume is ready."
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

  const saveResume = async (original: ResumeData, enhanced: EnhancedResumeData) => {
    if (!user) return;
    
    setIsSaving(true);
    
    const resumeData = {
      user_id: user.id,
      title: `${enhanced.fullName} - ${enhanced.jobTitle}`,
      original_data: JSON.parse(JSON.stringify(original)),
      enhanced_data: JSON.parse(JSON.stringify(enhanced))
    };

    if (currentResumeId) {
      // Update existing
      const { error } = await supabase
        .from("resumes")
        .update(resumeData)
        .eq("id", currentResumeId);

      if (error) {
        console.error("Error updating resume:", error);
      }
    } else {
      // Insert new
      const { data, error } = await supabase
        .from("resumes")
        .insert(resumeData)
        .select()
        .single();

      if (error) {
        console.error("Error saving resume:", error);
      } else if (data) {
        setCurrentResumeId(data.id);
      }
    }
    
    setIsSaving(false);
  };

  const handleUpdateResume = async (data: EnhancedResumeData) => {
    setEnhancedResume(data);
    
    // Auto-save changes
    if (currentResumeId && originalData) {
      await saveResume(originalData, data);
    }
  };

  const handleBackToForm = () => {
    setViewMode("form");
  };

  const handleBackToDashboard = () => {
    setViewMode("dashboard");
    setEnhancedResume(null);
    setOriginalData(null);
    setCurrentResumeId(null);
    navigate("/");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth?mode=login");
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-foreground">AI Resume Builder</h1>
                <p className="text-muted-foreground text-xs hidden sm:block">
                  Create professional, ATS-friendly resumes
                </p>
              </div>
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {profile?.full_name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {viewMode === "dashboard" && <Dashboard />}

        {viewMode === "form" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToDashboard}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to dashboard
              </button>
            </div>
            <ResumeForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>
        )}

        {viewMode === "preview" && enhancedResume && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToDashboard}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Dashboard
                </button>
                <button
                  onClick={handleBackToForm}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Edit form
                </button>
              </div>
              {isSaving && (
                <span className="text-sm text-muted-foreground">Saving...</span>
              )}
            </div>
            <ResumePreview data={enhancedResume} onUpdate={handleUpdateResume} />
          </div>
        )}
      </div>
    </main>
  );
}
