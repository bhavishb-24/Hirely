import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { ExperienceStep } from "./ExperienceStep";
import { EducationStep } from "./EducationStep";
import { SkillsStep } from "./SkillsStep";
import { ProjectsStep } from "./ProjectsStep";
import { ResumeData, sampleResumeData } from "@/types/resume";
import { ChevronLeft, ChevronRight, Sparkles, RotateCcw } from "lucide-react";

const STEPS = [
  { title: "Personal Info", component: PersonalInfoStep },
  { title: "Experience", component: ExperienceStep },
  { title: "Education", component: EducationStep },
  { title: "Skills", component: SkillsStep },
  { title: "Projects", component: ProjectsStep }
];

const emptyResumeData: ResumeData = {
  fullName: "",
  jobTitle: "",
  summary: "",
  experiences: [],
  education: [],
  skills: "",
  projects: [],
  certifications: ""
};

interface ResumeFormProps {
  onGenerate: (data: ResumeData) => void;
  isGenerating: boolean;
}

export function ResumeForm({ onGenerate, isGenerating }: ResumeFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ResumeData>(sampleResumeData);

  const handleChange = (updates: Partial<ResumeData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setData(emptyResumeData);
    setCurrentStep(0);
  };

  const handleLoadSample = () => {
    setData(sampleResumeData);
  };

  const StepComponent = STEPS[currentStep].component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            Step {currentStep + 1}: {STEPS[currentStep].title}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleLoadSample}>
              Load Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        <Progress value={progress} className="mt-2" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          {STEPS.map((step, index) => (
            <button
              key={step.title}
              onClick={() => setCurrentStep(index)}
              className={`${
                index === currentStep
                  ? "text-primary font-medium"
                  : index < currentStep
                  ? "text-primary/70"
                  : ""
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <StepComponent data={data} onChange={handleChange} />

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={() => onGenerate(data)}
              disabled={isGenerating || !data.fullName || !data.jobTitle}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Resume"}
            </Button>
          ) : (
            <Button onClick={() => setCurrentStep((prev) => prev + 1)}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
