
import { PlaceHolderImages } from "./placeholder-images";
import type { Subject, Chapter, Content } from "./types";

// This is a temporary in-memory store.
// In a real application, this would be a database.
let subjects: Subject[] = PlaceHolderImages.map(img => ({
    id: img.id,
    title: img.description.replace("An image representing ", ""),
    description: `A comprehensive overview of ${img.description.replace("An image representing ", "")}.`,
    imageUrl: img.imageUrl,
    imageHint: img.imageHint,
    chapters: [
        {
            id: 'chapter-1',
            title: 'Introduction',
            children: [],
            lectures: [],
            materials: []
        }
    ]
}));

// Simulate DB latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Functions to interact with the data
export const getSubjects = async (): Promise<Subject[]> => {
  await delay(100);
  return subjects;
};

export const getSubjectById = async (id: string): Promise<Subject | undefined> => {
    await delay(50);
    const subject = subjects.find(s => s.id === id);
    if (!subject) return undefined;

    // Deep copy to avoid mutation issues
    return JSON.parse(JSON.stringify(subject));
};


const findChapterRecursive = (chapters: Chapter[], chapterId: string): Chapter | null => {
    for (const chapter of chapters) {
        if (chapter.id === chapterId) {
            return chapter;
        }
        if (chapter.children) {
            const found = findChapterRecursive(chapter.children, chapterId);
            if (found) return found;
        }
    }
    return null;
}

export const addSubject = async (subject: Omit<Subject, 'id' | 'chapters' | 'imageUrl' | 'imageHint'>) => {
    await delay(200);
    const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
    const newSubject: Subject = {
      ...subject,
      id: `subj-${Date.now()}`,
      imageUrl: randomImage.imageUrl,
      imageHint: randomImage.imageHint,
      chapters: [
        {
          id: `chap-${Date.now()}`,
          title: 'Introduction',
          children: [],
          lectures: [],
          materials: []
        }
      ]
    };
    subjects.push(newSubject);
    return newSubject;
  };
  
export const addContent = async (subjectId: string, chapterId: string, contentType: "lectures" | "materials", content: Omit<Content, 'id'>) => {
    await delay(150);
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) throw new Error("Subject not found");

    const chapter = findChapterRecursive(subject.chapters, chapterId);
    if (!chapter) throw new Error("Chapter not found");
    
    const newContent = { ...content, id: `content-${Date.now()}` };
    chapter[contentType].push(newContent);
    return newContent;
};

export const updateContent = async (subjectId: string, chapterId: string, contentType: "lectures" | "materials", contentId: string, updatedProps: Partial<Content>) => {
    await delay(100);
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) throw new Error("Subject not found");

    const chapter = findChapterRecursive(subject.chapters, chapterId);
    if (!chapter) throw new Error("Chapter not found");

    const contentIndex = chapter[contentType].findIndex(c => c.id === contentId);
    if (contentIndex === -1) throw new Error("Content not found");

    chapter[contentType][contentIndex] = { ...chapter[contentType][contentIndex], ...updatedProps };
};
