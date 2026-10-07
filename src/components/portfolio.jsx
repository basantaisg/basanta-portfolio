'use client';
import { useRef, useCallback } from 'react';
import { business } from '../content.mjs';

/**
 * SampleCard renders one work-sample article with:
 *  - A `.details-body` / `.details-body-inner` wrapper so CSS can animate
 *    grid-template-rows from 0fr→1fr on open (smooth expand/collapse).
 *  - `aria-expanded` on the <summary> so screen readers announce the state.
 *  - Keyboard: Enter/Space on <summary> toggles the native <details>, which
 *    CSS reflects immediately via `details[open]`.
 */
function SampleCard({ sample }) {
  const detailsRef = useRef(null);

  // Keep aria-expanded in sync with the native open state after each toggle.
  const handleToggle = useCallback(() => {
    const details = detailsRef.current;
    if (!details) return;
    const summary = details.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
  }, []);

  return (
    <article className="project" id={`sample-${sample.id}`}>
      <div className="project-context" data-reveal>
        <p className="eyebrow"><span className="section-index">{sample.number} /</span> {sample.kind}</p>
        <h3>{sample.title}</h3>
        <p>{sample.context}</p>
        <p className="sample-label">{business.sampleLabel}</p>
      </div>
      <div className={`project-document ${sample.id}`} data-reveal>
        <div className="document-top"><span>SAMPLE {sample.number}</span><span>{sample.kind}</span></div>
        <p className="document-excerpt">{sample.excerpt}</p>
        <details ref={detailsRef} onToggle={handleToggle}>
          <summary aria-expanded="false" aria-controls={`sample-body-${sample.id}`}>
            <span className="summary-closed">Read the full {sample.readLabel}</span>
            <span className="summary-open">Close sample</span>
            <span className="disclosure-icon" aria-hidden="true">+</span>
          </summary>
          {/*
            .details-body uses CSS grid-template-rows: 0fr→1fr to animate height
            without JavaScript or fixed max-height hacks. Content height is natural.
            The inner div needs min-height:0 so it can collapse to zero.
          */}
          <div className="details-body" id={`sample-body-${sample.id}`}>
            <div className="details-body-inner">
              <div className="sample-full">
                <p className="sample-label">{business.sampleLabel}</p>
                <dl className="project-meta">
                  {[['Audience', sample.audience], ['Asset', sample.asset], ['My role', sample.role]].map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
                {sample.parts.map(part => (
                  <section className="copy-block" key={part.label}>
                    <p className="eyebrow">{part.label}</p>
                    <h4>{part.heading}</h4>
                    {part.paragraphs.map(text => <p key={text}>{text}</p>)}
                    {part.cta && <p className="sample-cta">CTA COPY: {part.cta}</p>}
                  </section>
                ))}
                <aside className="rationale">
                  <h4>Copy choices</h4>
                  <p>{sample.rationale}</p>
                  <p className="rationale-note">The calls to action above are sample wording, not live links.</p>
                </aside>
              </div>
            </div>
          </div>
        </details>
      </div>
    </article>
  );
}

export default function Portfolio() {
  return (
    <div className="projects">
      {business.samples.map(sample => <SampleCard key={sample.id} sample={sample} />)}
    </div>
  );
}
