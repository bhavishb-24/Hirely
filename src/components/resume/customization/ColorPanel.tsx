import { useResumeCustomization } from "@/contexts/ResumeCustomizationContext";
import { accentColorPresets } from "@/types/resumeCustomization";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export function ColorPanel() {
  const { customization, updateColors } = useResumeCustomization();
  const { colors } = customization;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Accent Color</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Applied to section headers only. Body text remains dark for ATS compatibility.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {accentColorPresets.map((preset) => {
          const isSelected = colors.accentColor === preset.value;
          return (
            <button
              key={preset.value}
              onClick={() => updateColors({ accentColor: preset.value })}
              className={`relative aspect-square rounded-lg border-2 transition-all ${
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground"
              }`}
              style={{ backgroundColor: preset.value }}
              title={preset.label}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white drop-shadow-md" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Body text: Dark gray (#1a1a1a)</p>
          <p>• Background: White only</p>
          <p>• All colors are ATS-safe</p>
        </div>
      </div>
    </div>
  );
}
