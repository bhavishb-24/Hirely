import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Wand2, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";

// Set the worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ImproveResumeInputProps {
  onImprove: (text: string) => void;
  isImproving: boolean;
}

export function ImproveResumeInput({ onImprove, isImproving }: ImproveResumeInputProps) {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith(".txt")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    setFileName(file.name);

    try {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text();
        setResumeText(text);
      } else {
        const text = await extractTextFromFile(file);
        setResumeText(text);
      }
      
      toast({
        title: "File uploaded",
        description: "Resume content extracted. Review and click Improve."
      });
    } catch (error) {
      console.error("Error extracting text:", error);
      toast({
        title: "Extraction failed",
        description: "Could not extract text. Please paste your resume content manually.",
        variant: "destructive"
      });
      setFileName(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const text = await extractTextFromPDF(arrayBuffer);
      return text;
    }
    
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const text = await extractTextFromDOCX(file);
      return text;
    }
    
    return await file.text();
  };

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const textParts: string[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        textParts.push(pageText);
      }
      
      const fullText = textParts.join("\n\n").trim();
      
      if (fullText.length < 50) {
        throw new Error("Could not extract enough text from PDF.");
      }
      
      return fullText;
    } catch (error) {
      console.error("PDF extraction error:", error);
      throw new Error("Could not extract text from PDF. Please paste your resume content manually.");
    }
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    // DOCX is a ZIP file containing XML
    // We'll use JSZip-like approach but simpler
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Look for the document.xml content
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const content = decoder.decode(uint8Array);
    
    // Extract text between XML tags
    const textContent = content.replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
    
    if (textContent.length > 100) {
      return textContent;
    }
    
    throw new Error("Could not extract text from DOCX. Please paste your resume content.");
  };

  const handleSubmit = () => {
    if (resumeText.trim().length < 50) {
      toast({
        title: "More content needed",
        description: "Please provide more resume content to improve",
        variant: "destructive"
      });
      return;
    }
    onImprove(resumeText);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Improve Your Resume
        </CardTitle>
        <CardDescription>
          Paste your existing resume or upload a file. Our AI will rewrite it to be 
          clear, concise, impact-driven, and ATS-friendly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">
              <FileText className="h-4 w-4 mr-2" />
              Paste Text
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste" className="space-y-4">
            <Textarea
              placeholder="Paste your resume content here...

Example:
John Smith
Software Engineer

Experience:
Senior Developer at Tech Corp (2020-Present)
- Worked on various projects
- Did programming stuff

Education:
BS Computer Science, State University, 2019"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {isExtracting ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-muted-foreground">Extracting text...</p>
                </div>
              ) : fileName ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-10 w-10 text-primary" />
                  <p className="font-medium text-foreground">{fileName}</p>
                  <p className="text-sm text-muted-foreground">Click to upload a different file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="font-medium text-foreground">Click to upload your resume</p>
                  <p className="text-sm text-muted-foreground">Supports PDF, DOCX, and TXT files</p>
                </div>
              )}
            </div>
            
            {fileName && resumeText && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Extracted content:</p>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Review the extracted text above. If anything is missing or incorrect, 
                    you can edit it directly or paste your resume content manually.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button 
            onClick={handleSubmit} 
            disabled={isImproving || resumeText.trim().length < 50}
            className="w-full"
            size="lg"
          >
            {isImproving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Improving Resume...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Improve My Resume
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Your resume content is private and secure
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
