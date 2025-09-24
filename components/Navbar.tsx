'use client';
import SmartLink from '@/components/SmartLink';

export default function Navbar(){
  return (
    <div className="navbar">
      <div className="bar container">
        <div className="mast">
          <SmartLink href="/" className="flag">AEL</SmartLink>
          <div className="edition">EDITION I</div>
        </div>
        <nav className="navlinks">
          <a href="/#about">About</a>
          <a href="/#projects">Projects</a>
          <SmartLink href="/blog">Blog</SmartLink>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-resume">Resume</a>
   
          
        </nav>
      </div>
    </div>
  );
}
