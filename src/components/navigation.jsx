'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { business } from '../content.mjs';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const header = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    setReady(true);
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && toggle.current?.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        if (header.current?.contains(document.activeElement)) toggle.current?.focus();
      }
    };
    const closeOutside = (event) => {
      if (!header.current?.contains(event.target)) setOpen(false);
    };
    const media = window.matchMedia('(min-width: 901px)');
    const close = () => setOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('click', closeOutside);
    media.addEventListener('change', close);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('click', closeOutside);
      media.removeEventListener('change', close);
    };
  }, []);
  return <header ref={header} className={`site-header wrap${ready ? ' enhanced' : ''}`}>
    <a className="wordmark" href="#home" aria-label="Basanta Parajuli, home"><Image className="brand-avatar" src="/assets/basanta-portrait.webp" width={46} height={46} alt="" sizes="46px" /><span>Basanta<br />Parajuli</span></a>
    <button ref={toggle} className="menu-toggle" hidden={!ready} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>Menu <span aria-hidden="true">{open ? '−' : '+'}</span></button>
    <nav id="navigation" className={open ? 'is-open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)}>
      <a href="#work">Work samples</a><a href="#services">Services</a><a href="#approach">Approach</a><a href="#about">About</a>
      <a className="button" href={business.booking}>Book a call <span aria-hidden="true">↗</span></a>
    </nav>
  </header>;
}
