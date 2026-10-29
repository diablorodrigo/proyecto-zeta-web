import { HomeHero } from "@/components/home/hero";
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
      <HomeProyeccionTeaser />
      <HomeServices />
      <HomeSimulatorTeaser />
      <HomePlanillasTeaser />
      <HomeGuiasTeaser />
      <HomeHowWeWork />
      <HomeFaq />
      <HomeCta />
    </>
  );
}
