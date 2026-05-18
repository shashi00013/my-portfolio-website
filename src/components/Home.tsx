import Hero from "./Hero";
import Marquee from "./Marquee";
import Services from "./Services";
import { Career } from "./Career";
import { Projects } from "./Projects";
import { Education, Contact, Footer } from "./ContactSection";
import { useEffect } from "react";
import Lenis from "lenis";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <Career />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </>
  );
}
