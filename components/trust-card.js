export function TrustCard({ item }) {
  return (
    <article className="panel p-6">
      <h3 className="text-xl font-medium text-ink">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink/70">{item.text}</p>
    </article>
  );
}
