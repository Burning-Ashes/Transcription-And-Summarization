
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/header";
import { getSubjects } from "@/lib/data";
import { Book, Home, PlusCircle } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Button } from "../ui/button";
import { CreateSubjectDialog } from "../dashboard/create-subject-dialog";
import { StudyHubLogo } from "../study-hub-logo";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const subjects = getSubjects();
  const pathname = usePathname();
  const { isTeacher } = useUser();
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <StudyHubLogo className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              Study Hub
            </h2>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip={{ children: "Dashboard", side: "right" }}
              >
                <Link href="/">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarMenu className="mt-4">
             <div className="px-2 mb-2 text-xs font-medium text-muted-foreground uppercase group-data-[collapsible=icon]:hidden">Subjects</div>
            {subjects.map((subject) => (
              <SidebarMenuItem key={subject.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(`/subjects/${subject.id}`)}
                  tooltip={{ children: subject.title, side: "right" }}
                >
                  <Link href={`/subjects/${subject.id}`}>
                    <Book />
                    <span>{subject.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          {isTeacher && (
            <CreateSubjectDialog
              open={isCreateDialogOpen}
              onOpenChange={setCreateDialogOpen}
            >
                <Button variant="outline" className="w-full justify-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0">
                    <PlusCircle className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden ml-2">New Subject</span>
                </Button>
            </CreateSubjectDialog>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
