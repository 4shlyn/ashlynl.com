import NowPlayingBadge from '@/components/NowPlayingBadge';
import FancyTitle from '../components/FancyTitle';
import SmartLink from '../components/SmartLink';

// will switch to postgres later
const projects = [
  {
    slug: "srad-flight-computer",
    title: "SRAD Flight Computer, Dual‑Deploy",
    desc: "Custom Teensy flight computer with IMU + baro sensors and EKF altitude/velocity for state estimation and reliable apogee and main deployment.",
    image: "/assets/watercolor1.png",
    tag: "Avionics"
  },
  {
    slug: "contraction-metrics",
    title: "Neural Stochastic Contraction Metrics",
    desc: "Conducted unguided learning on a stochastic pendulum system, coded a CCM for exponential stabilization opimtization using derived contraction metric.",
    image: "/assets/watercolor2.png",
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

export default function Page(){
  return (
    <>
   <section className="hero">
  <div className="hero-inner">
    <div className="hero-title">
      <p className="intro-eyebrow">HEY! I’M</p>

      <FancyTitle text="Ashlyn Lee" />
    </div>
    <p className="tagline">Rocketry • Avionics • Control •• Engineering Science @ UofT</p>
    <p className="tagline"></p>
    <NowPlayingBadge/>
  </div>
</section>
    <br></br><br></br><br></br>
      <p>site is still in progress.. feel free to contact me if you experience any bugs or have feedback!</p>

      <section className="projects-mb">
        <div className="kicker">Projects</div>
        <div className="proj-list">
          {projects.map((p) => (
            <article className="proj" key={p.slug}>
              <div className="media">
                <img src={p.image} alt="" className="wash-img" />
              </div>
              <div className="copy">
                <span className="eyebrow">{p.tag}</span>
                <h3><SmartLink href={`/projects/${p.slug}`}>{p.title}</SmartLink></h3>
                <p>{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
