
"use client";
import type { Chapter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Folder, FolderOpen } from "lucide-react";
import React from 'react'

interface ChapterTreeProps {
  chapters: Chapter[];
  selectedChapterId?: string | null;
  onSelectChapter: (chapterId: string) => void;
  level?: number;
}

export function ChapterTree({
  chapters,
  selectedChapterId,
  onSelectChapter,
  level = 0,
}: ChapterTreeProps) {
  if (!chapters || chapters.length === 0) {
    return (
        <div className="text-sm text-muted-foreground italic px-2">No chapters yet.</div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-1",
        level > 0 && "ml-4 mt-1 border-l pl-4"
      )}
    >
      {chapters.map((chapter) => (
        <div key={chapter.id}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-left h-auto py-2 px-2.5",
              selectedChapterId === chapter.id &&
                "bg-accent text-accent-foreground"
            )}
            onClick={() => onSelectChapter(chapter.id)}
          >
            {selectedChapterId === chapter.id ? <FolderOpen className="mr-2 h-4 w-4 flex-shrink-0" /> : <Folder className="mr-2 h-4 w-4 flex-shrink-0" />}
            <span className="truncate">{chapter.title}</span>
          </Button>
          {chapter.children && chapter.children.length > 0 && (
            <ChapterTree
              chapters={chapter.children}
              selectedChapterId={selectedChapterId}
              onSelectChapter={onSelectChapter}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}
