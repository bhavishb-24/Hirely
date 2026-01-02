import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData } from "@/types/resume";

interface PersonalInfoStepProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
}

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="John Smith"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Desired Job Title *</Label>
        <Input
          id="jobTitle"
          value={data.jobTitle}
          onChange={(e) => onChange({ jobTitle: e.target.value })}
          placeholder="Senior Software Engineer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary (optional)</Label>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
          placeholder="A brief overview of your professional background and goals..."
          rows={4}
        />
      </div>
    </div>
  );
}
