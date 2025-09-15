
import { AppLayout } from "@/components/layout/app-layout";
import { SubjectList } from "@/components/dashboard/subject-list";
import { getSubjects } from "@/lib/data";

export default async function Home() {
  const subjects = await getSubjects();
  return (
    <AppLayout>
      <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-8">
        <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Subjects Dashboard
            </h1>
            <p className="text-muted-foreground">
            Browse subjects, manage content, and track your learning progress.
            </p>
        </div>
        <SubjectList subjects={subjects} />
      </div>
    </AppLayout>
  );
}
