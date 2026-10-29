"use client";

import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { usePathname } from "next/navigation";
import { WHATSAPP_URL } from "@/lib/constants";
import { PROYECCION_PATH } from "@/lib/proyeccion/path";

export function WhatsAppFab() {
  const pathname = usePathname();
  if (pathname === PROYECCION_PATH) return null;

  return (
    <Link
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-8px_rgba(18,90,45,0.65)] transition-[transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:hover:scale-105 sm:right-5 sm:bottom-5"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </Link>
  );
}
