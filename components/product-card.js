import Link from "next/link";

function getDetectionLine(report) {
  if (!report?.summary) {
    return "检测摘要待更新";
  }

  return report.summary.split("；")[0];
}

export function ProductCard({ product, farm, report }) {
  const locationText = farm?.location?.replace("·", " · ") || "产地待更新";
  const sourceLabel = product.category === "家庭主粮" ? "当季新米" : product.category === "有机乳品" ? "冷链直达" : "产地直发";
  const traceLabel = product.traceability?.[0] || "批次可追溯";
  const certificationText = farm?.certifications?.[0] || "认证资料公开";
  const transportText = product.category === "有机乳品" ? "冷链直发" : product.category === "家庭主粮" ? "产地仓直发" : "24 小时内冷链入户";

  return (
    <article className="overflow-hidden rounded-[30px] border border-[#e9eadf] bg-white shadow-[0_22px_54px_rgba(39,57,36,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(34,49,39,0.12)]">
      <div className="relative h-44 overflow-hidden bg-[linear-gradient(135deg,#dce7d6,#f5dfcf_52%,#fff9f2)] sm:h-52 lg:h-60">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 rounded-full bg-[#f4f8e8]/95 px-2.5 py-1 text-[11px] font-medium text-[#507a35] shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
          {sourceLabel}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-white/94 px-2.5 py-1 text-[11px] font-medium text-ink/72 shadow-sm sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
          {product.badge}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <div className="rounded-[20px] bg-white/92 p-3 shadow-[0_10px_30px_rgba(24,37,28,0.12)] backdrop-blur-sm sm:rounded-[24px] sm:p-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="rounded-full bg-[#eef7dc] px-2.5 py-1 text-[11px] font-medium text-[#5c8a3f] sm:px-3 sm:text-xs">
                {farm?.name || "合作农场"}
              </span>
              <span className="rounded-full bg-[#f4f2ea] px-2.5 py-1 text-[11px] text-ink/65 sm:px-3 sm:text-xs">
                {locationText}
              </span>
            </div>
            <p className="mt-2 line-clamp-1 text-xs font-medium leading-5 text-ink sm:mt-3 sm:text-sm sm:leading-6">{traceLabel}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-[11px] sm:text-xs">
          <span className="rounded-full bg-[#edf4e4] px-2.5 py-1 font-medium text-[#5a843d] sm:px-3">{product.category}</span>
          <span className="text-ink/45">信任信息已公开</span>
        </div>
        <div>
          <h3 className="line-clamp-2 text-lg font-medium leading-7 text-ink sm:text-2xl sm:leading-9">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-ink/68 sm:text-sm sm:leading-7">{product.desc}</p>
        </div>
        <div className="rounded-[20px] bg-[#f8f7f1] p-3 text-sm text-ink/72 sm:rounded-[24px] sm:p-4">
          <div className="space-y-2.5 text-[11px] leading-5 sm:text-xs sm:leading-6">
            <p><span className="text-ink/45">农场：</span>{farm?.name || "合作农场公开"}</p>
            <p><span className="text-ink/45">认证：</span>{certificationText}</p>
            <p><span className="text-ink/45">最近检测：</span>{getDetectionLine(report)}</p>
            <p><span className="text-ink/45">运输：</span>{transportText}</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] text-[#79a35a] sm:text-xs">会员价</p>
            <p className="text-3xl font-semibold tracking-tight text-[#6fb25a] sm:text-4xl">¥{product.memberPrice}</p>
            <p className="text-xs text-ink/40 line-through sm:text-sm">日常价 ¥{product.price}</p>
            <p className="mt-1 text-[11px] text-ink/45 sm:text-xs">{traceLabel}</p>
          </div>
          <Link href={`/products/${product.slug}`} className="inline-flex items-center justify-center rounded-full border border-[#dfe5d6] bg-white px-4 py-2.5 text-xs font-medium text-[#507a35] transition hover:border-[#b8cf9d] hover:bg-[#f5faec] sm:px-5 sm:py-3 sm:text-sm">
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
