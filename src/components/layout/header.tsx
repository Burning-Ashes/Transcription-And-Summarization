
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";

export function AppHeader() {
  const { role, setRole } = useUser();
  const isTeacher = role === "teacher";

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6 sticky top-0 z-30">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <Label
          htmlFor="role-switch"
          className="text-sm font-medium text-muted-foreground"
        >
          Student
        </Label>
        <Switch
          id="role-switch"
          checked={isTeacher}
          onCheckedChange={(checked) => setRole(checked ? "teacher" : "student")}
          aria-label="Toggle user role"
        />
        <Label htmlFor="role-switch" className="text-sm font-medium">
          Teacher
        </Label>
      </div>
    </header>
  );
}
