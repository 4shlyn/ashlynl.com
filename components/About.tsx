export default function About() {
  return (
    <section id="about" className="section about snap-start">
      <div className="container about-wrap">
        {/* Left: photo */}
        <figure className="about-photo">
          <img
            src="/assets/about.png" 
            loading="lazy"
          />
        </figure>

        {/* Right: content */}
        <div className="about-copy">
          <div className="kicker">About</div>
          <h2 className="about-head">
        <span> Building reliable systems that fly & think </span> 
          </h2>

          <p className="about-p">
            I’m interested in the intersection of <em>control</em>,{" "}
            <em>avionics</em>, and <em>machine learning</em>—specifically
            <strong className="accent"> robust, intuitive tools</strong> that actually ship (and fly!)
          </p>

          <p className="about-p">
            My work touches student rocketry, embedded systems, and state
            estimation. Lately: Teensy-based dual-deploy flight computer (IMU + baro),
            EKF fusion, and reliable recovery deployment logic. 
          </p>

          <p className="about-p subtle">
            Studying Engineering Science @ UofT • Rocketry.
          </p>
        </div>
      </div>
    </section>
  );
}
