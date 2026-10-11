import Image from "next/image";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LOCATION_LABEL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-zeta-finance.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="font-display text-lg font-bold">Zeta Finance</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Asesoría financiera y de inversiones para personas que quieren
            decidir con criterio.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Navegación</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/servicios" className="hover:text-foreground">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/planillas" className="hover:text-foreground">
                Planillas
              </Link>
            </li>
            <li>
              <Link href="/sobre-mi" className="hover:text-foreground">
                Sobre mí
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-foreground">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Contacto</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                WhatsApp {WHATSAPP_DISPLAY}
              </Link>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Instagram {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-foreground"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>{LOCATION_LABEL}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Zeta Finance. La información de esta web
          es orientativa y no constituye una recomendación de inversión
          personalizada.
        </p>
      </div>
    </footer>
  );
}
