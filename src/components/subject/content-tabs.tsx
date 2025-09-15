
"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LectureList } from "./lecture-list";
import { MaterialList } from "./material-list";
import type { Chapter, Subject } from "@/lib/types";
import { Mic, BookOpen } from "lucide-react";

export function ContentTabs({
  chapter,
  subjectId,
}: {
  chapter: Chapter;
  subjectId: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">{chapter.title}</h2>
      <Tabs defaultValue="lectures" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lectures">
            <Mic className="mr-2 h-4 w-4" />
            Lectures
          </TabsTrigger>
          <TabsTrigger value="materials">
            <BookOpen className="mr-2 h-4 w-4" />
            Study Materials
          </TabsTrigger>
        </TabsList>
        <TabsContent value="lectures" className="mt-6">
          <LectureList
            chapterId={chapter.id}
            subjectId={subjectId}
            initialLectures={chapter.lectures}
          />
        </TabsContent>
        <TabsContent value="materials" className="mt-6">
          <MaterialList
            chapterId={chapter.id}
            subjectId={subjectId}
            initialMaterials={chapter.materials}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
