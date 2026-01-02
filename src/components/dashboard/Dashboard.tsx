import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Trash2, Edit, Loader2, Wand2, Target, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface SavedResume {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  enhanced_data: any;
}

export function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResumes = async () => {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching resumes:", error);
      toast({
        title: "Error",
        description: "Failed to load resumes",
        variant: "destructive"
      });
    } else {
      setResumes(data as SavedResume[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("resumes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive"
      });
    } else {
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast({
        title: "Resume deleted",
        description: "The resume has been removed."
      });
    }
    setDeletingId(null);
  };

  const actionCards = [
    {
      icon: Plus,
      title: "Build New Resume",
      description: "Start fresh with our guided form and AI enhancement.",
      action: () => navigate("/app?new=true")
    },
    {
      icon: Wand2,
      title: "Improve Existing",
      description: "Paste your resume and let AI transform it.",
      action: () => navigate("/app?improve=true")
    },
    {
      icon: Target,
      title: "Tailor to Job",
      description: "Match your resume to a specific job posting.",
      action: () => navigate("/app?tailor=true")
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h2 className="text-headline text-foreground">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h2>
        <p className="mt-2 text-body-large">
          What would you like to do today?
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {actionCards.map((card, index) => (
          <button
            key={card.title}
            onClick={card.action}
            className={`group p-6 rounded-2xl bg-card border border-border text-left shadow-apple hover-lift transition-all duration-300 hover:border-foreground/20 animate-fade-in-delay-${index + 1}`}
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className="text-title mb-2">{card.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
            <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Get started
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Resumes List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-title text-foreground">Your Resumes</h3>
          {resumes.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/app?new=true")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Resume
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-2xl bg-surface border border-border">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-title mb-2">No resumes yet</h4>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Create your first AI-enhanced resume and start landing interviews.
            </p>
            <Button onClick={() => navigate("/app?new=true")} className="rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" />
              Create Resume
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div 
                key={resume.id} 
                className="group p-5 rounded-xl bg-card border border-border hover:border-foreground/20 shadow-apple hover-lift transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{resume.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Updated {format(new Date(resume.updated_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 rounded-lg"
                    onClick={() => navigate(`/app?resume=${resume.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingId === resume.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
