
"use client";

import type { Subject } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlusCircle } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { CreateSubjectDialog } from "./create-subject-dialog";
import { useState } from "react";

export function SubjectList({ subjects }: { subjects: Subject[] }) {
  const { isTeacher } = useUser();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {subjects.map((subject) => (
        <Card
          key={subject.id}
          className="flex flex-col overflow-hidden transition-transform duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
        >
          <CardHeader className="p-0">
            <Link href={`/subjects/${subject.id}`} className="block">
              <div className="relative h-40 w-full">
                <Image
                  src={subject.imageUrl}
                  alt={subject.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  data-ai-hint={subject.imageHint}
                />
              </div>
            </Link>
          </CardHeader>
          <CardContent className="flex-grow p-6">
            <CardTitle className="mb-2 text-xl">
              <Link href={`/subjects/${subject.id}`} className="hover:underline">
                {subject.title}
              </Link>
            </CardTitle>
            <CardDescription>{subject.description}</CardDescription>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button asChild variant="secondary" className="w-full">
              <Link href={`/subjects/${subject.id}`}>
                View Subject <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      {isTeacher && (
        <CreateSubjectDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
            <Card className="flex items-center justify-center border-2 border-dashed bg-muted/50 hover:border-primary/50 hover:bg-muted transition-colors">
                <Button variant="ghost" className="h-full w-full flex-col gap-2 text-muted-foreground hover:text-primary">
                    <PlusCircle className="h-10 w-10"/>
                    <span className="font-semibold">Add New Subject</span>
                </Button>
            </Card>
        </CreateSubjectDialog>
      )}
    </div>
  );
}
