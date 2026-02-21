"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiUserCircle,
  HiUserGroup,
  HiAcademicCap,
  HiCurrencyDollar,
  HiChatBubbleLeftRight,
  HiFolder,
  HiArrowRightOnRectangle,
  HiBookOpen,
  HiShoppingBag,
} from "react-icons/hi2";

const navItems = [
  { href: "/dashboard/courses", label: "مدیریت دوره‌ها", icon: HiBookOpen },
  {
    href: "/dashboard/course-categories",
    label: "دسته‌بندی دوره‌ها",
    icon: HiFolder,
  },
  { href: "/dashboard/teachers", label: "مدیریت اساتید", icon: HiUserGroup },
  {
    href: "/dashboard/students",
    label: "مدیریت دانش‌آموزان",
    icon: HiAcademicCap,
  },
  { href: "/dashboard/finance", label: "مالی", icon: HiCurrencyDollar },
  {
    href: "/dashboard/products-orders",
    label: "مدیریت محصولات و سفارشات",
    icon: HiShoppingBag,
  },
  { href: "/dashboard/tickets", label: "تیکت", icon: HiChatBubbleLeftRight },
] as const;

type SidebarProps = {
  collapsed?: boolean;
};

const Sidebar = ({ collapsed = false }: SidebarProps): React.ReactElement => {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full flex-col border-e border-border bg-muted/40 shadow-[2px_0_12px_-4px_var(--color-border)] transition-[width] duration-200 ease-in-out dark:bg-background dark:shadow-[2px_0_12px_-4px_var(--color-border)] ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
      role="navigation"
    >
      <div
        className={`flex shrink-0 items-center border-b border-border bg-muted/60 dark:bg-muted/50 ${
          collapsed ? "justify-center px-0 py-5" : "gap-3 px-5 py-5"
        }`}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HiUserCircle className="size-6" aria-hidden />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-foreground">پنل مدیریت</span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`group flex items-center rounded-xl text-sm font-medium transition-colors ${
                collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3"
              } ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-foreground/20"
                    : "bg-muted/80 group-hover:bg-primary/20 dark:bg-muted dark:group-hover:bg-primary/20"
                }`}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              {!collapsed && <span className="flex-1">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border bg-muted/40 p-3 dark:bg-muted/30">
        <button
          type="button"
          title="خروج"
          className={`cursor-pointer flex w-full items-center rounded-xl border border-border bg-background py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
            collapsed ? "justify-center px-0" : "gap-3 px-4"
          }`}
          aria-label="خروج"
        >
          <HiArrowRightOnRectangle className="size-5 shrink-0" aria-hidden />
          {!collapsed && <span>خروج</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
