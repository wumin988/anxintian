import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getFarmById, getReportById, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const content = await getSiteContent();
  const report = getReportById(content, params.id);

  return {
    title: report ? `${report.title} | 检测报告 | 安心田` : "检测报告 | 安心田"
  };
}

export default async function ReportDetailPage({ params }) {
  const content = await getSiteContent();
  const report = getReportById(content, params.id);

  if (!report) {
    notFound();
  }

  const farm = getFarmById(content, report.farmId);
  const relatedProducts = (content.products || []).filter((item) => item.reportIds?.includes(report.id));

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="bg-ink p-8 text-white">
              <p className="text-xs tracking-[0.18em] uppercase text-white/65">report detail</p>
              <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{report.title}</h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/82">
                报告不是挂一个编号就结束，而是要让普通家庭看懂：这批食材测了什么、结果如何、适不适合长期放进家里。
              </p>
            </div>
            <div className="bg-earth-glow p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/88 p-5">
                  <p className="text-sm text-ink/45">报告编号</p>
                  <p className="mt-2 text-2xl font-medium text-ink">{report.id}</p>
                </div>
                <div className="rounded-[24px] bg-white/88 p-5">
                  <p className="text-sm text-ink/45">检测日期</p>
                  <p className="mt-2 text-2xl font-medium text-ink">{report.date}</p>
                </div>
                <div className="rounded-[24px] bg-white/88 p-5">
                  <p className="text-sm text-ink/45">关联农场</p>
                  <p className="mt-2 text-xl font-medium text-ink">{farm?.name}</p>
                </div>
                <div className="rounded-[24px] bg-white/88 p-5">
                  <p className="text-sm text-ink/45">批次编号</p>
                  <p className="mt-2 text-xl font-medium text-ink">{report.batchCode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel p-6 sm:p-8">
            <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">summary</p>
            <h2 className="mt-3 text-3xl font-medium text-ink">检测摘要</h2>
            <p className="mt-5 text-sm leading-8 text-ink/72">{report.summary}</p>

            <h3 className="mt-8 text-xl font-medium text-ink">检测项目</h3>
            <div className="mt-4 space-y-3">
              {report.items?.map((item) => (
                <div key={item} className="rounded-[22px] border border-ink/8 bg-white px-4 py-3 text-sm leading-7 text-ink/72">
                  {item}
                </div>
              ))}
            </div>

            <h3 className="mt-8 text-xl font-medium text-ink">给家庭用户的解释</h3>
            <div className="mt-4 rounded-[24px] bg-mist p-5 text-sm leading-8 text-ink/72">
              {report.interpretation}
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel p-6">
              <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">source farm</p>
              <h2 className="mt-3 text-2xl font-medium text-ink">来源农场</h2>
              <div className="mt-5 overflow-hidden rounded-[24px]">
                <img src={farm?.image} alt={farm?.name} className="h-56 w-full object-cover" />
              </div>
              <p className="mt-4 text-lg font-medium text-ink">{farm?.name}</p>
              <p className="mt-2 text-sm leading-7 text-ink/72">{farm?.location}</p>
              <Link href={`/traceability/${farm?.id}`} className="cta-secondary mt-5">
                查看农场详情
              </Link>
            </div>

            <div className="panel p-6">
              <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">transport record</p>
              <h2 className="mt-3 text-2xl font-medium text-ink">运输记录</h2>
              <p className="mt-5 text-sm leading-8 text-ink/72">{report.transportRecord}</p>
              <a href={report.attachmentUrl} target="_blank" rel="noreferrer" className="cta-secondary mt-5">
                查看附件：{report.attachmentName}
              </a>
            </div>
          </div>
        </div>

        {relatedProducts.length ? (
          <div className="space-y-6">
            <h2 className="section-title">关联商品</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  farm={getFarmById(content, product.farmId)}
                  report={report}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
