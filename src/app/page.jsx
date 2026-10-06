import Image from 'next/image';
import { business as b } from '../content.mjs';
import Navigation from '../components/navigation';
import Portfolio from '../components/portfolio';
import MotionEffects from '../components/motion-effects';

const Arrow = () => <span aria-hidden="true">↗</span>;
function Booking() {
  return <a className="button" href={b.booking}>Book a 30-minute call<Arrow /></a>;
}
function SectionHeading({ number, label, id, children, description }) {
  return <div className="section-heading" data-reveal><div><p className="eyebrow"><span className="section-index">{number} /</span> {label}</p><h2 id={id}>{children}</h2></div><p>{description}</p></div>;
}
export default function Home() {
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <Navigation />
    <MotionEffects />
    <main id="main">
      <section className="hero wrap" id="home" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow">BUSINESS MARKETING PARTNER</p>
          <h1 id="hero-title">{b.hero.headline} <span>{b.hero.emphasis}</span></h1>
          <p className="hero-description">{b.hero.body}</p>
          <div className="hero-actions"><Booking /><a className="text-link" href="#work">Read the samples</a></div>
          <p className="cta-note">We’ll discuss your offer, audience, and next campaign.</p>
        </div>
        <div className="hero-visual">
          <figure className="portrait-card">
            <Image src="/assets/basanta-portrait.webp" width={840} height={840} sizes="(max-width: 650px) calc(100vw - 44px), (max-width: 900px) 42vw, 460px" preload alt="Basanta Parajuli against an orange background" />
            <figcaption className="portrait-name"><span>Basanta Parajuli</span><span>Marketing partner</span></figcaption>
          </figure>
          <div className="hero-sample-note"><p className="eyebrow">LANDING-PAGE SAMPLE</p><p>{b.samples[0].parts[1].heading}</p><a href="#sample-landing" className="paper-link">Read the sample <Arrow /></a></div>
          <p className="visual-caption">{b.sampleLabel}</p>
        </div>
      </section>
      <div className="audience-strip"><div className="wrap"><p>For finance businesses</p><span>Finance coaches</span><span>Financial consultants</span><span>Fractional CMOs</span></div></div>
      <section className="work-section wrap section" id="work" aria-labelledby="work-title">
        <SectionHeading number="01" label="WORK SAMPLES" id="work-title" description="Read a finance-coaching landing page, a consulting email sequence, and a page built around an existing VSL. Each is an illustrative sample with the full copy and an explanation of the choices.">Copy samples</SectionHeading>
        <Portfolio />
      </section>
      <section className="services-section section" id="services" aria-labelledby="services-title"><div className="wrap">
        <SectionHeading number="02" label="SERVICES" id="services-title" description="We start with your offer, audience, and the role each asset needs to play. Then we agree the pages or emails needed for the campaign.">Where I can help</SectionHeading>
        <div className="services-list">{b.services.map(service => <article className="service" data-reveal key={service.title}><h3>{service.title}</h3><div><p>{service.body}</p><p className="scope">{service.scope}</p></div></article>)}</div>
        <p className="service-note">I can also review these pages and sequences against feedback and campaign data when it is available.</p>
      </div></section>
      <section className="approach-section section wrap" id="approach" aria-labelledby="approach-title">
        <SectionHeading number="03" label="APPROACH" id="approach-title" description="Research, writing, and review are part of the work. Campaign data helps guide later revisions when it is available.">How we work together</SectionHeading>
        <div className="process">{b.approach.map((step, i) => <article className="process-step" data-reveal key={step.title}><span className="step-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.body}</p><p className="output"><span>OUTPUT</span>{step.output}</p></article>)}</div>
      </section>
      <section className="about-section section" id="about" aria-labelledby="about-title"><div className="wrap about-grid">
        <div data-reveal><p className="eyebrow"><span className="section-index">04 /</span> ABOUT</p><h2 id="about-title">About Basanta</h2></div>
        <div className="about-copy" data-reveal><p className="lead">I’m Basanta Parajuli. I work as a marketing partner to finance coaches and financial consultants, with a focus on email sequences and landing pages.</p><p>I research the offer and audience, develop the sales argument, and write the pages and emails. I also work with fractional CMOs who need these assets for a campaign.</p><p>I check that claims are supported, the offer is understandable, and the next step is clear.</p><p>My interest in Humanity and Stoicism informs how I work: respect for the reader and accountability for what I write.</p></div>
      </div></section>
      <section className="contact-section section wrap" id="contact" aria-labelledby="contact-title">
        <div className="fit" data-reveal><p className="eyebrow">WHO THIS IS FOR</p><p>A project usually starts with:</p><ul><li>An existing paid offer</li><li>A defined audience</li><li>A way to put the copy into use</li></ul><p className="fit-note">Fractional CMOs can bring a campaign brief and the copy they need.</p></div>
        <div className="contact-copy" data-reveal><h2 id="contact-title">Discuss your offer</h2><p>Tell me about your offer, your audience, and where prospects need more information. We’ll use the 30-minute call to discuss the pages or emails you need and whether I can help.</p><Booking /><p className="email-alternative">Prefer email? <a href={`mailto:${b.email}`}>{b.email}</a></p></div>
      </section>
    </main>
    <footer className="site-footer wrap"><a href="#home" className="footer-name">Basanta Parajuli</a><p>© {new Date().getFullYear()} Basanta Parajuli</p><div>{b.socials.map(([label, url]) => <a key={label} href={url}>{label}</a>)}<a href="#home">Back to top</a></div></footer>
  </>;
}
