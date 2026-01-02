import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Target, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobDescriptionInputProps {
  onTailor: (jobDescription: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onTailor,
  onBack,
  isLoading,
}) => {
  const [jobDescription, setJobDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (jobDescription.trim().length < 50) {
      toast({
        title: "Job description too short",
        description: "Please paste a complete job description (at least 50 characters).",
        variant: "destructive",
      });
      return;
    }
    onTailor(jobDescription);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Tailor Resume to Job</CardTitle>
          <CardDescription className="text-base">
            Paste the job description below and we'll optimize your resume to better match the role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Description</label>
            <Textarea
              placeholder="Paste the full job description here...

Example:
We are looking for a Senior Software Engineer to join our team. The ideal candidate will have experience with React, TypeScript, and cloud technologies..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[300px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {jobDescription.length} characters • Minimum 50 required
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">How it works:</p>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  <li>• AI analyzes keywords and requirements from the job description</li>
                  <li>• Your resume is rephrased to highlight relevant experience</li>
                  <li>• Important keywords are naturally incorporated</li>
                  <li>• You get a match score and suggestions for improvement</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || jobDescription.trim().length < 50}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Tailoring Resume...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Tailor My Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDescriptionInput;
