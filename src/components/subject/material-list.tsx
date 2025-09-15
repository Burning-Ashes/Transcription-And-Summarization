
"use client";
import React, { useState } from "react";
import type { Content } from "@/lib/types";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Loader2,
  PlusCircle,
  Sparkles,
  BookOpen,
  Download,
} from "lucide-react";
import { generateStudyMaterialSummary } from "@/ai/flows/generate-study-material-summaries";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { getSubjects, updateSubjectData } from "@/lib/data";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface MaterialListProps {
  initialMaterials: Content[];
  subjectId: string;
  chapterId: string;
}

export function MaterialList({ initialMaterials, subjectId, chapterId }: MaterialListProps) {
  const [materials, setMaterials] = useState<Content[]>(initialMaterials);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { isTeacher } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDownload = (content: string, fileName: string, isDataUri = false) => {
    const a = document.createElement("a");
    if (isDataUri) {
        a.href = content;
    } else {
        const blob = new Blob([content], { type: "text/plain" });
        a.href = URL.createObjectURL(blob);
    }
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (!isDataUri) {
        URL.revokeObjectURL(a.href);
    }
  };

  const updateMaterialInState = (materialId: string, updatedProps: Partial<Content>) => {
    const allSubjects = getSubjects();
    const subjectIndex = allSubjects.findIndex(s => s.id === subjectId);
    if (subjectIndex === -1) return;

    const findAndupdate = (chapters: any[]) => {
        for(const chapter of chapters) {
            if (chapter.id === chapterId) {
                const materialIndex = chapter.materials.findIndex((m: any) => m.id === materialId);
                if(materialIndex !== -1) {
                    const currentMaterial = chapter.materials[materialIndex];
                    chapter.materials[materialIndex] = { ...currentMaterial, ...updatedProps };
                    // If we update dataUri, we might not need the URL object anymore
                    if (updatedProps.dataUri && currentMaterial.url.startsWith('blob:')) {
                        URL.revokeObjectURL(currentMaterial.url);
                        chapter.materials[materialIndex].url = '#';
                    }
                    return true;
                }
            }
            if(chapter.children) {
                if(findAndupdate(chapter.children)) return true;
            }
        }
        return false;
    }
    
    findAndupdate(allSubjects[subjectIndex].chapters);
    updateSubjectData(allSubjects);
    setMaterials(prev => prev.map(m => m.id === materialId ? { ...m, ...updatedProps } : m));
    router.refresh();
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      const newMaterial: Content = {
        id: `mat-${Date.now()}`,
        title: file.name,
        type: file.type === "application/pdf" ? "pdf" : "text",
        url: '#',
        dataUri: dataUri,
      };

      const allSubjects = getSubjects();
      const subjectIndex = allSubjects.findIndex(s => s.id === subjectId);
      if (subjectIndex === -1) return;

      const findAndAdd = (chapters: any[]) => {
        for(const chapter of chapters) {
            if (chapter.id === chapterId) {
                chapter.materials.push(newMaterial);
                return true;
            }
            if(chapter.children) {
                if(findAndAdd(chapter.children)) return true;
            }
        }
        return false;
      }
      findAndAdd(allSubjects[subjectIndex].chapters)
      updateSubjectData(allSubjects)

      setMaterials((prev) => [...prev, newMaterial]);
      router.refresh();

      toast({
        title: "Material Uploaded",
        description: `"${file.name}" has been added and saved for offline access.`,
      });
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSummarize = async (materialId: string, dataUri: string) => {
    setLoadingStates(prev => ({ ...prev, [materialId]: true }));
    try {
      const result = await generateStudyMaterialSummary({ materialDataUri: dataUri });
      updateMaterialInState(materialId, { summary: result.summary });
      toast({
        title: "Summary Generated",
        description: "AI-powered summary has been created for the material.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary.",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [materialId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {isTeacher && (
        <>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.txt,.md"
            onChange={handleFileChange}
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Upload Material
          </Button>
        </>
      )}
      {materials.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-medium">No study materials yet</h3>
          <p className="mt-1 text-sm">{isTeacher ? "Upload the first study material for this chapter." : "The teacher hasn't uploaded any materials yet."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {materials.map((material) => (
            <Card key={material.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <CardTitle>{material.title}</CardTitle>
                  </div>
                    <div className="flex gap-2 flex-shrink-0">
                        {isTeacher && material.dataUri && (
                            <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSummarize(material.id, material.dataUri!)}
                            disabled={loadingStates[material.id]}
                            >
                            {loadingStates[material.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Summarize
                            </Button>
                        )}
                        {material.dataUri && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(material.dataUri!, material.title, true)}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        )}
                    </div>
                </div>
              </CardHeader>
              {material.summary && (
                <CardContent>
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      AI Summary
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDownload(material.summary!, `${material.title}-summary.txt`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </AlertTitle>
                    <AlertDescription>{material.summary}</AlertDescription>
                  </Alert>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
