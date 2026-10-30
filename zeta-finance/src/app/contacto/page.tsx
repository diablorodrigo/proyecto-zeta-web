import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/contacto";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description:
    "Primera consulta gratuita en Salta. Contame tu situación y agendamos una conversación con Zeta Finance.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <section className="border-b border-border/70">
      <ContactForm />
    </section>
  );
}
