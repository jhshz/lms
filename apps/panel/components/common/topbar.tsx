"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiBars3, HiBell, HiMoon, HiSun, HiUserCircle } from "react-icons/hi2";

type TopBarProps = {
  onSidebarToggle: () => void;
};

export default function TopBar({
  onSidebarToggle,
}: TopBarProps): React.ReactElement {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 shadow-sm">
      <button
        type="button"
        onClick={onSidebarToggle}
        className="flex size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted"
        aria-label="بستن یا باز کردن منوی کناری"
      >
        <HiBars3 className="size-6" aria-hidden />
      </button>

      <div className="flex flex-1" />

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted"
          aria-label={isDark ? "حالت روشن" : "حالت تاریک"}
        >
          {isDark ? (
            <HiSun className="size-5" aria-hidden />
          ) : (
            <HiMoon className="size-5" aria-hidden />
          )}
        </button>

        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted"
          aria-label="اعلان‌ها"
        >
          <HiBell className="size-5" aria-hidden />
          <span className="absolute top-1.5 inset-e-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            ۱
          </span>
        </button>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:opacity-90"
          aria-label="پروفایل کاربر"
        >
          <HiUserCircle className="size-9" aria-hidden />
        </button>
      </div>
    </header>
  );
}
