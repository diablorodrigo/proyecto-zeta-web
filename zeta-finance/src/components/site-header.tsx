"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href === "/shop" && pathname.startsWith("/planillas")) return true;
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = openPath === pathname;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    let frame = 0;
    let lastScrolled = false;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const nextScrolled = y > 10;
        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled;
          setScrolled(nextScrolled);
        }
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
        headerRef.current?.style.setProperty("--scroll-progress", String(progress));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const close = () => setOpenPath(null);

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      <div
        className={cn(
          "relative border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-border/80 bg-white/92 shadow-[0_14px_40px_-28px_rgba(30,58,52,0.65)] backdrop-blur-xl"
            : "border-transparent bg-background/85 backdrop-blur-md",
        )}
      >
      <div
        aria-hidden
        className="scroll-progress pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-primary"
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          onClick={close}
        >
          <Image
            src="/logo-zeta-finance.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-foreground/10"
            priority
          />
          <span className="truncate font-display text-lg font-bold tracking-tight">
            Zeta Finance
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-2.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary xl:px-3 xl:text-sm",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-white/80 hover:text-foreground",
                )}
              >
                {link.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contacto"
            className={cn(
              buttonVariants({ size: "default" }),
              "h-10 rounded-full bg-primary px-4 text-primary-foreground",
            )}
          >
            Agendar consulta
            <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-white/70 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      </div>

      {open ? (
        <div
          id="menu-movil"
          className="fixed inset-x-0 top-[69px] bottom-0 z-50 overflow-y-auto border-t border-border/70 bg-background lg:hidden motion-safe:animate-fade-in"
        >
          <nav
            className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5"
            aria-label="Móvil"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={close}
                  className={cn(
                    "rounded-2xl px-4 py-3.5 font-display text-2xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    active
                      ? "bg-accent text-primary"
                      : "text-foreground hover:bg-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contacto"
              onClick={close}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-3 bg-primary text-primary-foreground",
              )}
            >
              Agendar consulta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
