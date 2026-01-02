import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData } from "@/types/resume";

interface SkillsStepProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
}

export function SkillsStep({ data, onChange }: SkillsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma separated) *</Label>
        <Textarea
          id="skills"
          value={data.skills}
          onChange={(e) => onChange({ skills: e.target.value })}
          placeholder="JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS..."
          rows={4}
        />
        <p className="text-sm text-muted-foreground">
          Enter your skills separated by commas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications & Achievements (optional)</Label>
        <Textarea
          id="certifications"
          value={data.certifications}
          onChange={(e) => onChange({ certifications: e.target.value })}
          placeholder="AWS Certified Developer, Google Cloud Professional, etc."
          rows={3}
        />
      </div>
    </div>
  );
}
