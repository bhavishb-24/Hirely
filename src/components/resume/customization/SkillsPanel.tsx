import { useResumeCustomization } from "@/contexts/ResumeCustomizationContext";
import { SkillsDisplayStyle } from "@/types/resumeCustomization";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const displayStyleOptions: { value: SkillsDisplayStyle; label: string; description: string }[] = [
  { 
    value: "comma", 
    label: "Comma Separated", 
    description: "JavaScript, React, Node.js, Python" 
  },
  { 
    value: "bullets", 
    label: "Inline Bullets", 
    description: "JavaScript • React • Node.js • Python" 
  },
  { 
    value: "grouped", 
    label: "Grouped by Category", 
    description: "Languages: JavaScript, Python | Frameworks: React, Node.js" 
  },
];

export function SkillsPanel() {
  const { customization, updateSkills } = useResumeCustomization();
  const { skills } = customization;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Skills Display Style</Label>
      
      <RadioGroup
        value={skills.displayStyle}
        onValueChange={(value: SkillsDisplayStyle) => updateSkills({ displayStyle: value })}
        className="space-y-3"
      >
        {displayStyleOptions.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
            <label htmlFor={option.value} className="flex-1 cursor-pointer">
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{option.description}</div>
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
