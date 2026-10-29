import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LOCATION_LABEL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";
import { PROYECCION_PATH } from "@/lib/proyeccion/path";

const FOOTER_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/simulador", label: "Simulador" },
  { href: PROYECCION_PATH, label: "Tu plata quieta" },
  { href: "/shop", label: "Shop" },
  { href: "/guias", label: "Guías gratis" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
] as const;

const linkClass =
  "rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Image
              src="/logo-zeta-finance.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-foreground/10"
            />
            <span className="font-display text-xl font-bold">Zeta Finance</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Asesoría financiera y de inversiones para personas que quieren
            decidir con criterio.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <WhatsAppIcon className="h-4 w-4 text-primary" />
              WhatsApp
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Instagram
            </a>
          </div>
        </div>

        <nav className="md:col-span-3" aria-label="Pie de página">
          <h2 className="text-sm font-semibold">Navegación</h2>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="text-sm font-semibold">Contacto</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Instagram {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="text-sm text-muted-foreground">{LOCATION_LABEL}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 bg-background/80">
        <div className="mx-auto max-w-6xl px-4 py-5 pb-24 sm:px-6 sm:pb-5">
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            © {new Date().getFullYear()} Zeta Finance. La información de esta web
            es orientativa y no constituye una recomendación de inversión
            personalizada.
          </p>
        </div>
      </div>
    </footer>
  );
}
