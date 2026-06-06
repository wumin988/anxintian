export function ReportCard({ report }) {
  return (
    <article className="panel p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="eyebrow">report</span>
          <span className="text-sm text-ink/50">{report.date}</span>
        </div>
        <div>
          <h3 className="text-xl font-medium text-ink">{report.title}</h3>
          <p className="mt-2 text-sm text-ink/50">编号：{report.id}</p>
        </div>
        <p className="text-sm leading-7 text-ink/70">{report.summary}</p>
        <a href={report.attachmentUrl} target="_blank" rel="noreferrer" className="cta-secondary">
          查看附件：{report.attachmentName}
        </a>
      </div>
    </article>
  );
}
