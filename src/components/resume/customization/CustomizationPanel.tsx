import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResumeCustomization } from "@/contexts/ResumeCustomizationContext";
import { SectionsPanel } from "./SectionsPanel";
import { TypographyPanel } from "./TypographyPanel";
import { LayoutPanel } from "./LayoutPanel";
import { ColorPanel } from "./ColorPanel";
import { HeaderPanel } from "./HeaderPanel";
import { SkillsPanel } from "./SkillsPanel";
import { Settings2, RotateCcw, Layers, Type, Layout, Palette, User, Wrench } from "lucide-react";

interface CustomizationPanelProps {
  trigger?: React.ReactNode;
}

export function CustomizationPanel({ trigger }: CustomizationPanelProps) {
  const [open, setOpen] = useState(false);
  const { resetToDefaults } = useResumeCustomization();

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Settings2 className="w-4 h-4" />
      Customize
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Customize Resume
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="sections" className="flex-1">
          <div className="px-6 pt-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="sections" className="text-xs">
                <Layers className="w-3 h-3 mr-1" />
                Sections
              </TabsTrigger>
              <TabsTrigger value="typography" className="text-xs">
                <Type className="w-3 h-3 mr-1" />
                Type
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">
                <Layout className="w-3 h-3 mr-1" />
                Layout
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="colors" className="text-xs">
                <Palette className="w-3 h-3 mr-1" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="header" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                Header
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">
                <Wrench className="w-3 h-3 mr-1" />
                Skills
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-220px)] mt-4">
            <div className="px-6 pb-6">
              <TabsContent value="sections" className="mt-0">
                <SectionsPanel />
              </TabsContent>
              <TabsContent value="typography" className="mt-0">
                <TypographyPanel />
              </TabsContent>
              <TabsContent value="layout" className="mt-0">
                <LayoutPanel />
              </TabsContent>
              <TabsContent value="colors" className="mt-0">
                <ColorPanel />
              </TabsContent>
              <TabsContent value="header" className="mt-0">
                <HeaderPanel />
              </TabsContent>
              <TabsContent value="skills" className="mt-0">
                <SkillsPanel />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
