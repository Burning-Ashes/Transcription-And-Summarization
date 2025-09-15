
import { PlaceHolderImages } from "./placeholder-images";
import type { Subject } from "./types";

const initialSubjects: Subject[] = [
  {
    id: "math-101",
    title: "Mathematics 101",
    description: "An introductory course to fundamental mathematical concepts.",
    imageUrl: PlaceHolderImages.find((p) => p.id === "subject-math")!.imageUrl,
    imageHint: PlaceHolderImages.find((p) => p.id === "subject-math")!.imageHint,
    chapters: [
      {
        id: "alg-basics",
        title: "Algebra Basics",
        lectures: [
          {
            id: 'lec-alg-1',
            title: 'Introduction to Variables',
            type: 'video',
            url: '#',
          }
        ],
        materials: [
          {
            id: 'mat-alg-1',
            title: 'Algebraic Expressions Notes',
            type: 'pdf',
            url: '#',
          }
        ],
        children: [
          {
            id: "lin-eq",
            title: "Linear Equations",
            lectures: [],
            materials: [],
          },
        ],
      },
      {
        id: "geom-basics",
        title: "Geometry Fundamentals",
        lectures: [],
        materials: [],
      },
    ],
  },
  {
    id: "hist-202",
    title: "World History",
    description: "A survey of major historical events and civilizations.",
    imageUrl:
      PlaceHolderImages.find((p) => p.id === "subject-history")!.imageUrl,
    imageHint: PlaceHolderImages.find((p) => p.id === "subject-history")!
      .imageHint,
    chapters: [
      {
        id: "ancient-civ",
        title: "Ancient Civilizations",
        lectures: [],
        materials: [],
      },
    ],
  },
  {
    id: "sci-301",
    title: "Advanced Science",
    description: "Exploring complex topics in biology, chemistry, and physics.",
    imageUrl:
      PlaceHolderImages.find((p) => p.id === "subject-science")!.imageUrl,
    imageHint: PlaceHolderImages.find((p) => p.id === "subject-science")!
      .imageHint,
    chapters: [],
  },
  {
    id: "art-101",
    title: "Art Appreciation",
    description: "An introduction to the visual arts and their history.",
    imageUrl: PlaceHolderImages.find((p) => p.id === "subject-art")!.imageUrl,
    imageHint: PlaceHolderImages.find((p) => p.id === "subject-art")!.imageHint,
    chapters: [],
  },
];

const STORAGE_KEY = 'study-hub-subjects';

const isBrowser = typeof window !== 'undefined';

// Functions to interact with the data
export const getSubjects = (): Subject[] => {
  if (!isBrowser) return initialSubjects;
  try {
    const storedSubjects = localStorage.getItem(STORAGE_KEY);
    if (storedSubjects) {
      return JSON.parse(storedSubjects);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSubjects));
      return initialSubjects;
    }
  } catch (error) {
    console.error("Failed to read from localStorage", error);
    return initialSubjects;
  }
};

export const updateSubjectData = (newSubjects: Subject[]) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubjects));
  } catch (error) {
    console.error("Failed to write to localStorage", error);
  }
};

export const getSubjectById = (id: string): Subject | undefined => {
  const subjects = getSubjects();
  return subjects.find((s) => s.id === id);
};

export const addSubject = (subject: Omit<Subject, 'id' | 'chapters' | 'imageUrl' | 'imageHint'>) => {
  const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
  const newSubject: Subject = {
    id: subject.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
    ...subject,
    imageUrl: randomImage.imageUrl,
    imageHint: randomImage.imageHint,
    chapters: [],
  };
  const subjects = getSubjects();
  subjects.push(newSubject);
  updateSubjectData(subjects);
  return newSubject;
};
