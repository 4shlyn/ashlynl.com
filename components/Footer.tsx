export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-credit">© 2025 Ashlyn Lee</p>

        <div className="footer-socials">
          <a
            href="https://github.com/4shlyn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <img src="/assets/socials/github.png" alt="GitHub" />
          </a>

          <a
            href="https://www.linkedin.com/in/ashlyn-lee25/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img src="/assets/socials/linkedin.png" alt="LinkedIn" />
          </a>

          <a
            href="https://open.spotify.com/user/0vq09g5i78chr580erge5d1k3"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Spotify"
          >
            <img src="/assets/socials/spotify.png" alt="Spotify" />
          </a>
        </div>
      </div>
    </footer>
  );
}
