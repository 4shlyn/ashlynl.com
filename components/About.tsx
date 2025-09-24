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
            Building reliable systems that fly &amp; think
          </h2>

          <p className="about-lede">
            I’m interested in the intersection of <em>control</em>,{" "} <em>machine learning</em>, and <em>robotics</em>—particularly
            <strong className="accent"> robust, intuitive tools</strong> that
            actually ship (or fly!) 
          </p>
          <p className="about-lede"> On the side, I play the oboe and english horn, and enjoy hiking and snowboarding. 
          </p>

          {/* <p className="about-p">Feel free to contact me @ {<a className="text-black" href="mailto:4shlynl@gmail.com">4shlynl@gmail.com</a>}</p>  */}

          <p className="about-meta">Currently studying Engineering Science @ UofT</p>
        </div>
      </div>
    </section>
  );
}
