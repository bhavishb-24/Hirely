import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Education, ResumeData } from "@/types/resume";

interface EducationStepProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
}

export function EducationStep({ data, onChange }: EducationStepProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      degree: "",
      institution: "",
      year: ""
    };
    onChange({ education: [...data.education, newEducation] });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange({
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      education: data.education.filter((edu) => edu.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      {data.education.map((edu, index) => (
        <Card key={edu.id}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Education {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Degree *</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  placeholder="State University"
                />
              </div>

              <div className="space-y-2">
                <Label>Year *</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                  placeholder="2019"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addEducation} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}
