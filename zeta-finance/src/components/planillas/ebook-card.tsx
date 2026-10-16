import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EBOOK_INVERTIR_SIN_MIEDO } from "@/lib/ebooks";
import { cn } from "@/lib/utils";

export function EbookCard() {
  const ebook = EBOOK_INVERTIR_SIN_MIEDO;

  return (
    <section
      id={ebook.id}
      className="scroll-mt-24 border-b border-border/70"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-x-12">
          <figure className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_40px_rgba(30,58,52,0.08)]">
              <Image
                src={ebook.image}
                alt={ebook.imageAlt}
                width={ebook.imageWidth}
                height={ebook.imageHeight}
                className="h-auto w-full"
                sizes="(min-width: 1024px) 420px, (min-width: 768px) 448px, 100vw"
                priority
              />
            </div>
          </figure>

          <div>
            <p className="text-sm font-semibold text-primary">
              Ebook · pago único · {ebook.priceLabel}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {ebook.name}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {ebook.description}
            </p>
            <div className="mt-6">
              <Link
                href={ebook.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto",
                )}
              >
                {ebook.buyLabel}
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {ebook.delivery}
            </p>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground">
              {ebook.legal}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
