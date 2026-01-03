import { useResumeCustomization } from "@/contexts/ResumeCustomizationContext";
import { HeaderAlignment, SeparatorStyle } from "@/types/resumeCustomization";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, Minus, Circle, Space } from "lucide-react";

export function HeaderPanel() {
  const { customization, updateHeader } = useResumeCustomization();
  const { header } = customization;

  const contactFields = [
    { key: "showEmail" as const, label: "Email" },
    { key: "showPhone" as const, label: "Phone" },
    { key: "showLocation" as const, label: "Location" },
    { key: "showLinkedIn" as const, label: "LinkedIn" },
    { key: "showPortfolio" as const, label: "Portfolio" },
  ];

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Contact Information</Label>
        {contactFields.map((field) => (
          <div key={field.key} className="flex items-center justify-between">
            <span className="text-sm">{field.label}</span>
            <Switch
              checked={header[field.key]}
              onCheckedChange={(checked) => updateHeader({ [field.key]: checked })}
            />
          </div>
        ))}
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Header Alignment</Label>
        <ToggleGroup
          type="single"
          value={header.alignment}
          onValueChange={(value) => value && updateHeader({ alignment: value as HeaderAlignment })}
          className="justify-start"
        >
          <ToggleGroupItem value="left" className="flex items-center gap-2">
            <AlignLeft className="w-4 h-4" />
            <span className="text-xs">Left</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="center" className="flex items-center gap-2">
            <AlignCenter className="w-4 h-4" />
            <span className="text-xs">Center</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Separator Style */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Contact Separator</Label>
        <ToggleGroup
          type="single"
          value={header.separatorStyle}
          onValueChange={(value) => value && updateHeader({ separatorStyle: value as SeparatorStyle })}
          className="justify-start"
        >
          <ToggleGroupItem value="dot" className="flex items-center gap-2 px-4">
            <Circle className="w-2 h-2 fill-current" />
            <span className="text-xs">Dot</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="line" className="flex items-center gap-2 px-4">
            <Minus className="w-4 h-4" />
            <span className="text-xs">Line</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="space" className="flex items-center gap-2 px-4">
            <span className="text-xs">Space</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
