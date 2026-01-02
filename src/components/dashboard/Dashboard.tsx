import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, LogOut, Trash2, Edit, Loader2, Wand2, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface SavedResume {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  enhanced_data: any;
}

export function Dashboard() {
  const { profile, signOut } = useAuth();
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth?mode=login");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Welcome, {profile?.full_name || "User"}!
          </h2>
          <p className="text-muted-foreground">
            Manage your resumes and create new ones
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Action Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
          onClick={() => navigate("/?new=true")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              Build New Resume
            </CardTitle>
            <CardDescription>
              Start from scratch with our guided form. Fill in your details and let AI enhance your content.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
          onClick={() => navigate("/?improve=true")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wand2 className="h-5 w-5 text-primary" />
              </div>
              Improve Existing Resume
            </CardTitle>
            <CardDescription>
              Paste or upload your existing resume. AI will rewrite it to be ATS-friendly and impact-driven.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Resumes List */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Resumes</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : resumes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No resumes yet</h4>
              <p className="text-muted-foreground text-center mb-4">
                Create your first AI-enhanced resume
              </p>
              <Button onClick={() => navigate("/?new=true")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {resume.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Last updated {format(new Date(resume.updated_at), "MMM d, yyyy")}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/?resume=${resume.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resume.id)}
                      disabled={deletingId === resume.id}
                      className="text-destructive hover:text-destructive"
                    >
                      {deletingId === resume.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
