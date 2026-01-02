import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Experience, ResumeData } from "@/types/resume";

interface ExperienceStepProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
}

export function ExperienceStep({ data, onChange }: ExperienceStepProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      role: "",
      company: "",
      duration: "",
      responsibilities: ""
    };
    onChange({ experiences: [...data.experiences, newExperience] });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange({
      experiences: data.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      experiences: data.experiences.filter((exp) => exp.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      {data.experiences.map((exp, index) => (
        <Card key={exp.id}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Experience {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role/Title *</Label>
                <Input
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duration *</Label>
              <Input
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, { duration: e.target.value })}
                placeholder="Jan 2021 - Present"
              />
            </div>

            <div className="space-y-2">
              <Label>Responsibilities & Achievements</Label>
              <Textarea
                value={exp.responsibilities}
                onChange={(e) => updateExperience(exp.id, { responsibilities: e.target.value })}
                placeholder="Describe your key responsibilities and achievements..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addExperience} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
}
