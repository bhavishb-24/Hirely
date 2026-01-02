import { resumeThemes, ResumeThemeId } from "@/types/resumeThemes";
import { Card } from "@/components/ui/card";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  selectedTheme: ResumeThemeId;
  onThemeChange: (theme: ResumeThemeId) => void;
}

const themePreviewColors: Record<ResumeThemeId, { primary: string; secondary: string }> = {
  "modern-professional": { primary: "bg-blue-600", secondary: "bg-slate-200" },
  "minimal-classic": { primary: "bg-gray-900", secondary: "bg-gray-100" },
  "creative-accent": { primary: "bg-violet-600", secondary: "bg-violet-100" },
};

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const themes = Object.values(resumeThemes);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Palette className="h-4 w-4" />
        <span>Resume Theme</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const colors = themePreviewColors[theme.id];
          
          return (
            <Card
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={cn(
                "relative p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected 
                  ? "ring-2 ring-primary shadow-md" 
                  : "hover:ring-1 hover:ring-border"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
              
              {/* Theme Preview Mini */}
              <div className="mb-3 rounded border border-border bg-background p-2">
                <div className="space-y-1.5">
                  <div className={cn("h-2.5 w-3/4 rounded-sm", colors.primary)} />
                  <div className={cn("h-1.5 w-1/2 rounded-sm", colors.secondary)} />
                  <div className="pt-1 space-y-1">
                    <div className={cn("h-1 w-full rounded-sm", colors.secondary)} />
                    <div className={cn("h-1 w-5/6 rounded-sm", colors.secondary)} />
                    <div className={cn("h-1 w-4/5 rounded-sm", colors.secondary)} />
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium text-sm text-foreground">{theme.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {theme.description}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
