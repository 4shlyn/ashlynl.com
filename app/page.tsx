"use client";

import { useEffect } from 'react';
import DiskNowPlaying from '@/components/DiskNowPlaying';
import TitleBump from '@/components/TitleBump';
import SmartLink from '@/components/SmartLink';
import ScrollHint from "@/components/ScrollHint";
import About from '@/components/About';

// will switch to postgres later
const projects = [
  {
    slug: "srad-flight-computer",
    title: "SRAD Flight Computer, Dual-Deploy",
    desc: "Custom Teensy flight computer with IMU + baro sensors and EKF altitude/velocity for state estimation and reliable apogee and main deployment.",
    image: "/assets/schematic.png",
    tag: "Avionics"
  },
  {
    slug: "contraction-metrics",
    title: "Neural Stochastic Contraction Metrics",
    desc: "Conducted unguided learning on a stochastic pendulum system, coded a CCM for exponential stabilization opimtization using derived contraction metric.",
    image: "/assets/UTIAS.png",
    tag: "Control, Machine Learning"
  },
  {
    slug: "blank1",
    title: "i love maki",
    desc: "🥑🥒🍚🍙",
    image: "/assets/watercolor3.png",
    tag: "Food"
  },
  {
    slug: "blank2",
    title: "Hand action image processing",
    desc: "Coming soon",
    image: "/assets/watercolor1.png",
    tag: "Machine Learning"
  }
];

export default function Page() {
  // Reveal animations for kicker + cards
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { root: null, threshold: 0.1 }
    );

    document.querySelectorAll<HTMLElement>('.kicker').forEach(el => io.observe(el));
    document.querySelectorAll<HTMLElement>('.proj-card').forEach(el => io.observe(el));

    return () => io.disconnect();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-title relative" data-title-bump>
            <p className="intro-eyebrow">HEY! I’M</p>
            <TitleBump text="Ashlyn Lee" />
          </div>

          <p className="tagline">
            Rocketry • Avionics • Control •• Engineering Science @ UofT
          </p>
                    <p className="tagline-bold">
              Site is still in development!          </p>
          <div className="mt-4">
            <DiskNowPlaying />
          </div>
        </div>
        <ScrollHint targetId="about" />
      </section>


      <About />

{/* Projects */}
<section id="projects" className="projects-mb">
     <div className="about-eyebrow-wrap">
        <span className="about-eyebrow">Projects</span>
        <span className="about-hr" aria-hidden="true"></span>
      </div>
  <div className="wrap">
    <div className="proj-grid">
      {projects.map((p) => (
        <article key={p.slug} className="proj-card">
          <SmartLink href={`/projects/${p.slug}`} className="card-media">
            <img src={p.image} alt="" />
          </SmartLink>
          <div className="card-body">
            <span className="eyebrow">{p.tag}</span>
            <h3 className="card-title">
              <SmartLink href={`/projects/${p.slug}`}>{p.title}</SmartLink>
            </h3>
            <p className="card-sub">{p.desc}</p>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

    </>
  );
}
