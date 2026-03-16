"use client";

import { ProjectProvider } from "@/lib/project/projectStore";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProjectProvider>{children}</ProjectProvider>;
}

