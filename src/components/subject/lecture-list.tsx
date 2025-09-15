
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
  Mic,
  PlusCircle,
  Sparkles,
  Video,
  Download,
} from "lucide-react";
import { summarizeLecture } from "@/ai/flows/summarize-uploaded-lectures";
import { transcribeLecture } from "@/ai/flows/transcribe-uploaded-lectures";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { getSubjects, updateSubjectData } from "@/lib/data";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface LectureListProps {
  initialLectures: Content[];
  subjectId: string;
  chapterId: string;
}

export function LectureList({ initialLectures, subjectId, chapterId }: LectureListProps) {
  const [lectures, setLectures] = useState<Content[]>(initialLectures);
  const [loadingStates, setLoadingStates] = useState<Record<string, 'summarize' | 'transcribe' | null>>({});
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

  const updateLectureInState = (lectureId: string, updatedProps: Partial<Content>) => {
    const allSubjects = getSubjects();
    const subjectIndex = allSubjects.findIndex(s => s.id === subjectId);
    if (subjectIndex === -1) return;

    const findAndupdate = (chapters: any[]) => {
        for(const chapter of chapters) {
            if (chapter.id === chapterId) {
                const lectureIndex = chapter.lectures.findIndex((l: any) => l.id === lectureId);
                if(lectureIndex !== -1) {
                    const currentLecture = chapter.lectures[lectureIndex];
                    chapter.lectures[lectureIndex] = { ...currentLecture, ...updatedProps };
                    // If we update dataUri, we might not need the URL object anymore
                    if (updatedProps.dataUri && currentLecture.url.startsWith('blob:')) {
                        URL.revokeObjectURL(currentLecture.url);
                        chapter.lectures[lectureIndex].url = '#'; // Or some placeholder
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
    setLectures(prev => prev.map(l => l.id === lectureId ? { ...l, ...updatedProps } : l));
    router.refresh();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      const fileType = file.type.startsWith("video") ? "video" : "audio";
      const newLecture: Content = {
        id: `lec-${Date.now()}`,
        title: file.name,
        type: fileType,
        url: '#', // Not using blob url anymore for persistence
        dataUri: dataUri,
      };
      
      const allSubjects = getSubjects();
      const subjectIndex = allSubjects.findIndex(s => s.id === subjectId);
      if (subjectIndex === -1) return;

      const findAndAdd = (chapters: any[]) => {
          for(const chapter of chapters) {
              if (chapter.id === chapterId) {
                  chapter.lectures.push(newLecture);
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
      setLectures((prev) => [...prev, newLecture]);
      router.refresh();

      toast({
        title: "Lecture Uploaded",
        description: `"${file.name}" has been added and saved for offline access.`,
      });
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSummarize = async (lectureId: string, dataUri: string) => {
    setLoadingStates(prev => ({ ...prev, [lectureId]: 'summarize' }));
    try {
      const result = await summarizeLecture({ videoDataUri: dataUri });
      updateLectureInState(lectureId, { summary: result.summary });
      toast({
        title: "Summary Generated",
        description: "AI-powered summary has been created for the lecture.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary.",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [lectureId]: null }));
    }
  };

  const handleTranscribe = async (lectureId: string, dataUri: string) => {
    setLoadingStates(prev => ({ ...prev, [lectureId]: 'transcribe' }));
    try {
      const result = await transcribeLecture({ audioDataUri: dataUri });
      updateLectureInState(lectureId, { transcription: result.transcription });
      toast({
        title: "Transcription Complete",
        description: "The lecture has been transcribed to text.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to transcribe audio.",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [lectureId]: null }));
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
            accept="video/*,audio/*"
            onChange={handleFileChange}
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Upload Lecture
          </Button>
        </>
      )}
      {lectures.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
          <Mic className="mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-medium">No lectures yet</h3>
          <p className="mt-1 text-sm">{isTeacher ? "Upload the first lecture for this chapter." : "The teacher hasn't uploaded any lectures yet."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lectures.map((lecture) => (
            <Card key={lecture.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {lecture.type === "video" ? <Video className="h-6 w-6 text-primary"/> : <Mic className="h-6 w-6 text-primary"/>}
                    <CardTitle>{lecture.title}</CardTitle>
                  </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {isTeacher && lecture.dataUri && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSummarize(lecture.id, lecture.dataUri!)}
                            disabled={!!loadingStates[lecture.id]}
                          >
                            {loadingStates[lecture.id] === 'summarize' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Summarize
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTranscribe(lecture.id, lecture.dataUri!)}
                            disabled={!!loadingStates[lecture.id]}
                          >
                          {loadingStates[lecture.id] === 'transcribe' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                            Transcribe
                          </Button>
                        </>
                      )}
                      {lecture.dataUri && (
                         <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(lecture.dataUri!, lecture.title, true)}
                         >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                         </Button>
                      )}
                    </div>
                </div>
              </CardHeader>
              {(lecture.summary || lecture.transcription) && (
                 <CardContent className="space-y-4">
                  {lecture.summary && (
                     <Alert>
                        <Sparkles className="h-4 w-4" />
                       <AlertTitle className="flex items-center justify-between">
                         AI Summary
                         <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDownload(lecture.summary!, `${lecture.title}-summary.txt`)}
                         >
                            <Download className="h-4 w-4" />
                         </Button>
                       </AlertTitle>
                       <AlertDescription>
                         {lecture.summary}
                       </AlertDescription>
                     </Alert>
                  )}
                  {lecture.transcription && (
                    <Alert>
                        <FileText className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        Transcription
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDownload(lecture.transcription!, `${lecture.title}-transcription.txt`)}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                      </AlertTitle>
                      <AlertDescription className="max-h-48 overflow-y-auto">
                        {lecture.transcription}
                      </AlertDescription>
                    </Alert>
                  )}
                 </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
