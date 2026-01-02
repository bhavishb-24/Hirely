import { resumeThemes, ResumeThemeId } from "@/types/resumeThemes";
import { Card } from "@/components/ui/card";
import { Check, Palette, Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResumeTheme } from "@/contexts/ResumeThemeContext";
import { useToast } from "@/hooks/use-toast";

const themePreviewColors: Record<ResumeThemeId, { primary: string; secondary: string }> = {
  "modern-professional": { primary: "bg-blue-600", secondary: "bg-slate-200" },
  "minimal-classic": { primary: "bg-gray-900", secondary: "bg-gray-100" },
  "creative-accent": { primary: "bg-violet-600", secondary: "bg-violet-100" },
  "executive-elite": { primary: "bg-slate-700", secondary: "bg-slate-200" },
  "tech-focused": { primary: "bg-emerald-500", secondary: "bg-emerald-100" },
  "creative-professional": { primary: "bg-rose-500", secondary: "bg-rose-100" },
  "academic-research": { primary: "bg-sky-700", secondary: "bg-sky-100" },
  "minimal-ats": { primary: "bg-black", secondary: "bg-gray-200" },
};

export function ThemeSelector() {
  const { selectedTheme, setSelectedTheme, isPremiumUser } = useResumeTheme();
  const { toast } = useToast();
  const themes = Object.values(resumeThemes);

  const handleThemeSelect = (themeId: ResumeThemeId) => {
    const theme = resumeThemes[themeId];
    
    if (theme.isPremium && !isPremiumUser) {
      toast({
        title: "Premium Theme",
        description: "Upgrade to premium to unlock this theme.",
        variant: "default",
      });
      return;
    }
    
    setSelectedTheme(themeId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Palette className="h-4 w-4" />
          <span>Resume Theme</span>
        </div>
        {!isPremiumUser && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <Crown className="h-3.5 w-3.5" />
            <span>Upgrade for more themes</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const colors = themePreviewColors[theme.id];
          const isLocked = theme.isPremium && !isPremiumUser;
          
          return (
            <Card
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              className={cn(
                "relative p-3 cursor-pointer transition-all duration-200",
                isSelected 
                  ? "ring-2 ring-primary shadow-md" 
                  : "hover:ring-1 hover:ring-border hover:shadow-sm",
                isLocked && "opacity-75"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 z-10">
                  <Check className="h-3 w-3" />
                </div>
              )}
              
              {isLocked && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1 z-10">
                  <Lock className="h-3 w-3" />
                </div>
              )}
              
              {/* Theme Preview Mini */}
              <div className={cn(
                "mb-2.5 rounded border border-border bg-white p-2",
                isLocked && "grayscale"
              )}>
                <div className="space-y-1.5">
                  <div className={cn("h-2 w-3/4 rounded-sm", colors.primary)} />
                  <div className={cn("h-1.5 w-1/2 rounded-sm", colors.secondary)} />
                  <div className="pt-1 space-y-1">
                    <div className={cn("h-1 w-full rounded-sm", colors.secondary)} />
                    <div className={cn("h-1 w-5/6 rounded-sm", colors.secondary)} />
                    <div className={cn("h-1 w-4/5 rounded-sm", colors.secondary)} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <h3 className="font-medium text-xs text-foreground truncate">{theme.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
                    {theme.description}
                  </p>
                </div>
              </div>
              
              {theme.isPremium && (
                <div className="mt-1.5 flex items-center gap-1">
                  <Crown className="h-3 w-3 text-amber-500" />
                  <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">Premium</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
