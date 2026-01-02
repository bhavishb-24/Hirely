import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";

interface MatchAnalysis {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
}

interface JobMatchFeedbackProps {
  analysis: MatchAnalysis;
}

const JobMatchFeedback: React.FC<JobMatchFeedbackProps> = ({ analysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-4">
      {/* Match Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Job Match Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor(analysis.matchScore)}`}>
              {analysis.matchScore}%
            </div>
            <div className="flex-1">
              <Progress value={analysis.matchScore} className="h-3" />
              <p className={`text-sm mt-1 ${getScoreColor(analysis.matchScore)}`}>
                {getScoreLabel(analysis.matchScore)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matched Keywords */}
      {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              Matched Keywords ({analysis.matchedKeywords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missing Keywords */}
      {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              Missing Keywords ({analysis.missingKeywords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="border-amber-300 text-amber-700">
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Consider adding these if you have relevant experience
            </p>
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobMatchFeedback;
