export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-4">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title">{title}</h2>
      {description ? <p className="body-muted">{description}</p> : null}
    </div>
  );
}
