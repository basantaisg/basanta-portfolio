import { business } from '../content.mjs';
export default function Portfolio() {
  return <div className="projects">{business.samples.map(sample => <article className="project" id={`sample-${sample.id}`} key={sample.id}>
    <div className="project-context" data-reveal>
      <p className="eyebrow"><span className="section-index">{sample.number} /</span> {sample.kind}</p>
      <h3>{sample.title}</h3><p>{sample.context}</p><p className="sample-label">{business.sampleLabel}</p>
    </div>
    <div className={`project-document ${sample.id}`} data-reveal>
      <div className="document-top"><span>SAMPLE {sample.number}</span><span>{sample.kind}</span></div>
      <p className="document-excerpt">{sample.excerpt}</p>
      <details><summary><span className="summary-closed">Read the full {sample.readLabel}</span><span className="summary-open">Close sample</span><span className="disclosure-icon" aria-hidden="true">+</span></summary>
        <div className="sample-full">
          <p className="sample-label">{business.sampleLabel}</p>
          <dl className="project-meta">{[['Audience', sample.audience], ['Asset', sample.asset], ['My role', sample.role]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          {sample.parts.map(part => <section className="copy-block" key={part.label}><p className="eyebrow">{part.label}</p><h4>{part.heading}</h4>{part.paragraphs.map(text => <p key={text}>{text}</p>)}{part.cta && <p className="sample-cta">CTA COPY: {part.cta}</p>}</section>)}
          <aside className="rationale"><h4>Copy choices</h4><p>{sample.rationale}</p><p className="rationale-note">The calls to action above are sample wording, not live links.</p></aside>
        </div>
      </details>
    </div>
  </article>)}</div>;
}
