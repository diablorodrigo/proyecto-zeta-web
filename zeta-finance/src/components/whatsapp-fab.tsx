"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { WHATSAPP_URL } from "@/lib/constants";
import { PROYECCION_PATH } from "@/lib/proyeccion/path";
import { getScrollRoot } from "@/lib/scroll-root";
import { cn } from "@/lib/utils";

/**
 * En mobile el botón vive en una franja debajo del scroll, así no tapa texto.
 * Mientras la portada llega hasta esa franja, el fondo sigue el piso oscuro
 * del hero. Desde sm el botón vuelve a flotar, como antes.
 */
function heroReachesStrip() {
  if (window.matchMedia("(min-width: 640px)").matches) return false;
  const hero = document.querySelector(".hero-cine-stage");
  const root = getScrollRoot();
  if (!hero || !root) return false;
  return hero.getBoundingClientRect().bottom >= root.getBoundingClientRect().bottom - 1;
}

export function WhatsAppFab() {
  const pathname = usePathname();
  const [overHero, setOverHero] = useState(pathname === "/");

  useEffect(() => {
    const root = getScrollRoot();
    const update = () => setOverHero(heroReachesStrip());
    update();
    if (!root) return;
    root.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      root.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  if (pathname === PROYECCION_PATH) return null;

  return (
    <div
      className={cn(
        "flex shrink-0 justify-end px-4 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:contents",
        overHero ? "bg-[#0d1512]" : "bg-background",
      )}
    >
      <Link
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-8px_rgba(18,90,45,0.65)] transition-[transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:hover:scale-105 sm:fixed sm:right-5 sm:bottom-5 sm:z-40"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </Link>
    </div>
  );
}
