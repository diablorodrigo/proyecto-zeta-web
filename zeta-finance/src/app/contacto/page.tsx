import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/contacto";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Primera consulta gratuita. Contame tu situación y agendamos una conversación.",
};

export default function ContactoPage() {
  return (
    <section className="border-b border-border/70">
      <ContactForm />
    </section>
  );
}
