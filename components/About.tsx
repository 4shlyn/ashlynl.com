export default function About() {
  return (
    <section id="about" className="section about snap-start about-formal">
      {/* section eyebrow + horizontal rule */}
      <div className="about-eyebrow-wrap">
        <span className="about-eyebrow">ABOUT</span>
        <span className="about-hr" aria-hidden="true"></span>
      </div>

      <div className="container about-grid">
        {/*left*/}
        <figure className="about-media">
          <img
            src="/assets/about.jpg"
            loading="lazy"
          />
        </figure>

        {/* right*/}
        <div className="about-text">
          <h2 className="about-title">
            Interested in systems that fly & think. 
          </h2>
          <p className="about-lede"> Curiosity carries me into many spaces—building rocketry avionics, exploring drone stability controls with machine learning, 3D objection detection for formula cars. It also takes me offline: making music on the oboe, hand-making double reeds, or chasing fresh air on mountains and trails.
          </p>

          <p className="about-lede">
            I am currently interested in the intersection of <em>control</em>,{" "} <em>machine learning</em>, and <em>robotics</em>—particularly
            <strong className="accent"> robust, intuitive tools</strong> that
            actually ship (or fly!) 
          </p>

          {/* <p className="about-p">Feel free to contact me @ {<a className="text-black" href="mailto:4shlynl@gmail.com">4shlynl@gmail.com</a>}</p>  */}

          <p className="about-meta">Studying Engineering Science @ UofT.</p>
        </div>
      </div>
    </section>
  );
}
