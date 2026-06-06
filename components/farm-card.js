import Link from "next/link";

export function FarmCard({ farm, report }) {
  return (
    <article className="panel p-6 transition hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(34,49,39,0.12)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="eyebrow">farm profile</span>
          <span className="text-sm text-ink/50">建场于 {farm.established}</span>
        </div>
        <div>
          <h3 className="text-2xl font-medium text-ink">{farm.name}</h3>
          <p className="mt-2 text-sm text-ink/60">{farm.location} · {farm.specialty}</p>
        </div>
        <p className="text-sm leading-7 text-ink/70">{farm.story}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-mist p-4 text-sm text-ink/72">
            <p className="text-xs text-ink/45">种植规模</p>
            <p className="mt-1 text-lg font-medium text-ink">{farm.acreage}</p>
          </div>
          <div className="rounded-3xl bg-mist p-4 text-sm text-ink/72">
            <p className="text-xs text-ink/45">最近检测</p>
            <p className="mt-1 text-lg font-medium text-ink">{report?.id}</p>
          </div>
        </div>
        <Link href={`/traceability#${farm.id}`} className="cta-secondary">
          查看溯源档案
        </Link>
      </div>
    </article>
  );
}
