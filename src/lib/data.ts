
import { PlaceHolderImages } from "./placeholder-images";
import type { Subject, Chapter, Content } from "./types";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  writeBatch,
  documentId,
} from "firebase/firestore";

// Functions to interact with the data
export const getSubjects = async (): Promise<Subject[]> => {
  const subjectsCol = collection(db, "subjects");
  const subjectSnapshot = await getDocs(subjectsCol);
  const subjects = await Promise.all(
    subjectSnapshot.docs.map(async (d) => {
      const subjectData = d.data() as Omit<Subject, "id" | "chapters">;
      const subject: Subject = {
        ...subjectData,
        id: d.id,
        chapters: await getChapters(d.id),
      };
      return subject;
    })
  );
  return subjects;
};

export const getSubjectById = async (id: string): Promise<Subject | undefined> => {
  const subjectDocRef = doc(db, "subjects", id);
  const subjectDoc = await getDoc(subjectDocRef);

  if (!subjectDoc.exists()) {
    return undefined;
  }

  const subjectData = subjectDoc.data() as Omit<Subject, "id" | "chapters">;
  const subject: Subject = {
    ...subjectData,
    id: subjectDoc.id,
    chapters: await getChapters(subjectDoc.id),
  };
  return subject;
};

const getChapters = async (subjectId: string): Promise<Chapter[]> => {
  const chaptersCol = collection(db, "subjects", subjectId, "chapters");
  const chapterSnapshot = await getDocs(chaptersCol);
  
  const chapters = await Promise.all(
    chapterSnapshot.docs.map(async (d) => {
      const chapterData = d.data() as Omit<Chapter, "id" | "lectures" | "materials" | "children">;
      const chapter: Chapter = {
        ...chapterData,
        id: d.id,
        lectures: await getContent(subjectId, d.id, "lectures"),
        materials: await getContent(subjectId, d.id, "materials"),
        children: await getChapters(`${subjectId}/chapters/${d.id}`), // Recursive call for sub-chapters
      };
      return chapter;
    })
  );

  return chapters;
};

const getContent = async (subjectId: string, chapterId: string, contentType: "lectures" | "materials"): Promise<Content[]> => {
    const contentCol = collection(db, "subjects", subjectId, "chapters", chapterId, contentType);
    const contentSnapshot = await getDocs(contentCol);
    return contentSnapshot.docs.map(d => ({...d.data(), id: d.id} as Content));
}

export const addSubject = async (subject: Omit<Subject, 'id' | 'chapters' | 'imageUrl' | 'imageHint'>) => {
  const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
  const newSubjectData = {
    ...subject,
    imageUrl: randomImage.imageUrl,
    imageHint: randomImage.imageHint,
  };
  
  const subjectsCol = collection(db, 'subjects');
  const docRef = await addDoc(subjectsCol, newSubjectData);
  
  const newSubject: Subject = {
      ...newSubjectData,
      id: docRef.id,
      chapters: []
  }

  return newSubject;
};

export const addContent = async (subjectId: string, chapterId: string, contentType: "lectures" | "materials", content: Omit<Content, 'id'>) => {
    const contentCol = collection(db, "subjects", subjectId, "chapters", chapterId, contentType);
    const docRef = await addDoc(contentCol, content);
    return { ...content, id: docRef.id };
};

export const updateContent = async (subjectId: string, chapterId: string, contentType: "lectures" | "materials", contentId: string, updatedProps: Partial<Content>) => {
    const contentDocRef = doc(db, "subjects", subjectId, "chapters", chapterId, contentType, contentId);
    await updateDoc(contentDocRef, updatedProps);
};
