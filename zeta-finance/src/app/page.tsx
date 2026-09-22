import { HomeHero } from "@/components/home/hero";
import { HomeServices } from "@/components/home/services-teaser";
import { HomeSimulatorTeaser } from "@/components/home/simulator-teaser";
import { HomeHowWeWork } from "@/components/home/how-we-work";
import { HomeFaq } from "@/components/home/faq";
import { HomeCta } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeSimulatorTeaser />
      <HomeHowWeWork />
      <HomeFaq />
      <HomeCta />
    </>
  );
}
