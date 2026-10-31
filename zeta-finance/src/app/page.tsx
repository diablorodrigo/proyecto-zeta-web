import type { Metadata } from "next";
import { CnvNotice } from "@/components/cnv-notice";
import { HomeHero } from "@/components/home/hero";
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
});
import { HomeProyeccionTeaser } from "@/components/home/proyeccion-teaser";
import { HomeServices } from "@/components/home/services-teaser";
import { HomeSimulatorTeaser } from "@/components/home/simulator-teaser";
import { HomePlanillasTeaser } from "@/components/home/planillas-teaser";
import { HomeGuiasTeaser } from "@/components/home/guias-teaser";
import { HomeHowWeWork } from "@/components/home/how-we-work";
import { HomeFaq } from "@/components/home/faq";
import { HomeCta } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <section className="border-b border-border/70 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <CnvNotice />
        </div>
      </section>
      <HomeProyeccionTeaser />
      <HomeServices />
      <HomeSimulatorTeaser />
      <div className="reveal border-b border-border/70 bg-white">
        <div className="mx-auto grid max-w-6xl items-stretch gap-5 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <HomePlanillasTeaser />
          <HomeGuiasTeaser />
        </div>
      </div>
      <HomeHowWeWork />
      <HomeFaq />
      <HomeCta />
    </>
  );
}
