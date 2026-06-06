export function MembershipCard({ plan, featured = false }) {
  return (
    <article className={`panel p-6 ${featured ? "border-moss/30 bg-mist" : ""}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-medium text-ink">{plan.name}</h3>
          {featured ? <span className="rounded-full bg-moss px-3 py-1 text-xs font-medium text-white">推荐</span> : null}
        </div>
        <p className="text-3xl font-semibold text-ink">{plan.price}</p>
        <p className="text-sm leading-7 text-ink/70">{plan.summary}</p>
        <ul className="space-y-3 text-sm text-ink/72">
          {plan.perks.map((perk) => (
            <li key={perk} className="rounded-2xl bg-white/80 px-4 py-3">
              {perk}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
