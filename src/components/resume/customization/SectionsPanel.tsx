import { useResumeCustomization } from "@/contexts/ResumeCustomizationContext";
import { sectionTitleLabels, SectionId } from "@/types/resumeCustomization";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function SectionsPanel() {
  const { customization, toggleSectionVisibility, reorderSections, updateSectionTitle } = useResumeCustomization();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const sortedSections = [...customization.sections].sort((a, b) => a.order - b.order);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderSections(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Drag to reorder. Toggle visibility for each section.
      </div>
      
      <div className="space-y-2">
        {sortedSections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 p-3 rounded-lg border bg-card transition-all ${
              draggedIndex === index ? "opacity-50 border-primary" : "border-border"
            } ${!section.visible ? "opacity-60" : ""}`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {section.customTitle || sectionTitleLabels[section.id]}
                </span>
              </div>
              <Input
                placeholder={sectionTitleLabels[section.id]}
                value={section.customTitle || ""}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                className="mt-2 h-8 text-xs"
              />
            </div>
            
            <button
              onClick={() => toggleSectionVisibility(section.id)}
              className={`p-2 rounded-md transition-colors ${
                section.visible 
                  ? "text-foreground hover:bg-muted" 
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {section.visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
