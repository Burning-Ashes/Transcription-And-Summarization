
import { AppLayout } from "@/components/layout/app-layout";
import { SubjectDetails } from "@/components/subject/subject-details";
import { getSubjectById } from "@/lib/data";
import { notFound } from "next/navigation";

export default function SubjectPage({
  params,
}: {
  params: { subjectId: string };
}) {
  const subject = getSubjectById(params.subjectId);

  if (!subject) {
    notFound();
  }

  return (
    <AppLayout>
      <SubjectDetails subject={subject} />
    </AppLayout>
  );
}

// Optional: Add metadata generation
export async function generateMetadata({ params }: { params: { subjectId: string } }) {
    const subject = getSubjectById(params.subjectId);
    if (!subject) {
      return {
        title: "Subject Not Found",
      };
    }
    return {
      title: `${subject.title} | Study Hub`,
      description: subject.description,
    };
  }
