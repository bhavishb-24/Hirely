import { useResumeCustomization } from "@/contexts/ResumeCustomizationContext";
import { DensityPreset } from "@/types/resumeCustomization";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignJustify, AlignCenter, Maximize } from "lucide-react";

const densityOptions: { value: DensityPreset; label: string; icon: React.ReactNode }[] = [
  { value: "compact", label: "Compact", icon: <AlignJustify className="w-4 h-4" /> },
  { value: "balanced", label: "Balanced", icon: <AlignCenter className="w-4 h-4" /> },
  { value: "spacious", label: "Spacious", icon: <Maximize className="w-4 h-4" /> },
];

export function LayoutPanel() {
  const { customization, updateLayout, setDensityPreset } = useResumeCustomization();
  const { layout } = customization;

  return (
    <div className="space-y-6">
      {/* Density Preset */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Page Density</Label>
        <ToggleGroup
          type="single"
          value={layout.densityPreset}
          onValueChange={(value) => value && setDensityPreset(value as DensityPreset)}
          className="justify-start"
        >
          {densityOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="flex items-center gap-2 px-4"
            >
              {option.icon}
              <span className="text-xs">{option.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Page Margins */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Page Margins</Label>
          <span className="text-sm text-muted-foreground">{layout.pageMargin}mm</span>
        </div>
        <Slider
          value={[layout.pageMargin]}
          onValueChange={([value]) => updateLayout({ pageMargin: value })}
          min={10}
          max={30}
          step={1}
        />
      </div>

      {/* Section Spacing */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Section Spacing</Label>
          <span className="text-sm text-muted-foreground">{layout.sectionSpacing}rem</span>
        </div>
        <Slider
          value={[layout.sectionSpacing]}
          onValueChange={([value]) => updateLayout({ sectionSpacing: value })}
          min={0.5}
          max={3}
          step={0.25}
        />
      </div>

      {/* Bullet Spacing */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Bullet Spacing</Label>
          <span className="text-sm text-muted-foreground">{layout.bulletSpacing}rem</span>
        </div>
        <Slider
          value={[layout.bulletSpacing]}
          onValueChange={([value]) => updateLayout({ bulletSpacing: value })}
          min={0.125}
          max={0.75}
          step={0.125}
        />
      </div>
    </div>
  );
}
