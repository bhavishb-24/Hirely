import { useResumeCustomization } from "@/contexts/ResumeCustomizationContext";
import { FontFamily, fontFamilyLabels } from "@/types/resumeCustomization";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TypographyPanel() {
  const { customization, updateTypography } = useResumeCustomization();
  const { typography } = customization;

  return (
    <div className="space-y-6">
      {/* Font Family */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Font Family</Label>
        <Select
          value={typography.fontFamily}
          onValueChange={(value: FontFamily) => updateTypography({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(fontFamilyLabels) as FontFamily[]).map((font) => (
              <SelectItem key={font} value={font}>
                {fontFamilyLabels[font]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Name Font Size */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Name Size</Label>
          <span className="text-sm text-muted-foreground">{typography.nameFontSize}px</span>
        </div>
        <Slider
          value={[typography.nameFontSize]}
          onValueChange={([value]) => updateTypography({ nameFontSize: value })}
          min={20}
          max={40}
          step={1}
        />
      </div>

      {/* Section Header Font Size */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Section Header Size</Label>
          <span className="text-sm text-muted-foreground">{typography.sectionHeaderFontSize}px</span>
        </div>
        <Slider
          value={[typography.sectionHeaderFontSize]}
          onValueChange={([value]) => updateTypography({ sectionHeaderFontSize: value })}
          min={10}
          max={20}
          step={1}
        />
      </div>

      {/* Body Font Size */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Body Text Size</Label>
          <span className="text-sm text-muted-foreground">{typography.bodyFontSize}px</span>
        </div>
        <Slider
          value={[typography.bodyFontSize]}
          onValueChange={([value]) => updateTypography({ bodyFontSize: value })}
          min={9}
          max={14}
          step={0.5}
        />
      </div>

      {/* Line Height */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Line Height</Label>
          <span className="text-sm text-muted-foreground">{typography.lineHeight}</span>
        </div>
        <Slider
          value={[typography.lineHeight]}
          onValueChange={([value]) => updateTypography({ lineHeight: value })}
          min={1.2}
          max={2}
          step={0.1}
        />
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Letter Spacing</Label>
          <span className="text-sm text-muted-foreground">{typography.letterSpacing}em</span>
        </div>
        <Slider
          value={[typography.letterSpacing]}
          onValueChange={([value]) => updateTypography({ letterSpacing: value })}
          min={-0.02}
          max={0.1}
          step={0.01}
        />
      </div>
    </div>
  );
}
