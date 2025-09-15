
import { PlaceHolderImages } from "./placeholder-images";
import type { Subject } from "./types";

let subjects: Subject[] = [
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

// Functions to interact with the mock data
export const getSubjects = (): Subject[] => {
  return subjects;
};

export const getSubjectById = (id: string): Subject | undefined => {
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
  subjects.push(newSubject);
  return newSubject;
};

// This is a client-side only function to simulate DB updates.
// In a real app, this would be an API call and server-side logic.
export const updateSubjectData = (newSubjects: Subject[]) => {
  subjects = newSubjects;
}
