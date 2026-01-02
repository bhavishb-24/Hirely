import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Project, ResumeData } from "@/types/resume";

interface ProjectsStepProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
}

export function ProjectsStep({ data, onChange }: ProjectsStepProps) {
  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: "",
      description: ""
    };
    onChange({ projects: [...data.projects, newProject] });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange({
      projects: data.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      )
    });
  };

  const removeProject = (id: string) => {
    onChange({
      projects: data.projects.filter((proj) => proj.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Add any notable projects you've worked on (optional)
      </p>

      {data.projects.map((proj, index) => (
        <Card key={proj.id}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Project {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(proj.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={proj.name}
                onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                placeholder="E-commerce Platform"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={proj.description}
                onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                placeholder="Brief description of the project and your contributions..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addProject} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}
