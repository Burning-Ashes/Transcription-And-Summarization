
"use client";
import React, { useState, useCallback, useMemo } from "react";
import type { Subject, Chapter } from "@/lib/types";
import { ChapterTree } from "./chapter-tree";
import { ContentTabs } from "./content-tabs";
import Image from "next/image";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export function SubjectDetails({ subject }: { subject: Subject }) {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    subject.chapters?.[0]?.id || null
  );

  const findChapter = useCallback((chapters: Chapter[], id: string): Chapter | null => {
    for (const chapter of chapters) {
      if (chapter.id === id) return chapter;
      if (chapter.children) {
        const found = findChapter(chapter.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const selectedChapter = useMemo(() => {
    if (!selectedChapterId) return null;
    return findChapter(subject.chapters, selectedChapterId);
  }, [selectedChapterId, subject.chapters, findChapter]);

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-48 w-full md:h-64">
        <Image
          src={subject.imageUrl}
          alt={subject.title}
          fill
          className="object-cover"
          data-ai-hint={subject.imageHint}
          priority
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {subject.title}
            </h1>
            <p className="mt-1 max-w-2xl text-lg text-white/90">
              {subject.description}
            </p>
          </div>
        </div>
      </div>
      <div className="grid flex-1 gap-8 p-4 md:grid-cols-[280px_1fr] md:p-8">
        <aside className="hidden md:block">
          <Card>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="p-4">
                <h2 className="mb-4 text-lg font-semibold tracking-tight">
                  Chapters
                </h2>
                <ChapterTree
                  chapters={subject.chapters}
                  selectedChapterId={selectedChapterId}
                  onSelectChapter={handleSelectChapter}
                />
              </div>
            </ScrollArea>
          </Card>
        </aside>
        <main className="flex-1">
          {selectedChapter ? (
            <ContentTabs
              chapter={selectedChapter}
              subjectId={subject.id}
              key={selectedChapter.id}
            />
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-medium text-muted-foreground">
                  No Chapter Selected
                </p>
                <p className="text-sm text-muted-foreground">
                  {subject.chapters.length > 0 ? "Select a chapter from the list to view its content." : "This subject has no chapters yet."}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
