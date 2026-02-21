"use client";

import { useState } from "react";
import Sidebar from "../common/sidebar";
import TopBar from "../common/topbar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onSidebarToggle={() => setSidebarCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
