import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportCard } from "@/components/report-card";
import { getFarmById, getProductBySlug, getReportById, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const content = await getSiteContent();
  const product = getProductBySlug(content, params.slug);

  return {
    title: product ? `${product.name} | 安心田` : "商品详情 | 安心田"
  };
}

export default async function ProductDetailPage({ params }) {
  const content = await getSiteContent();
  const product = getProductBySlug(content, params.slug);

  if (!product) {
    notFound();
  }

  const farm = getFarmById(content, product.farmId);
  const relatedProducts = (content.products || []).filter((item) => item.slug !== product.slug).slice(0, 3);
  const reports = (product.reportIds || []).map((reportId) => getReportById(content, reportId)).filter(Boolean);

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div className="panel overflow-hidden bg-earth-glow p-5 sm:p-6">
            <div className="relative h-[340px] overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#dce7d6,#f5dfcf_55%,#fffaf6)] sm:h-[460px]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-white/10" />
              <div className="absolute left-8 top-8 rounded-full bg-[#f4f8e8]/95 px-4 py-2 text-xs font-medium text-[#507a35]">
                会员精选
              </div>
              <div className="absolute bottom-8 left-8 right-8 rounded-[24px] border border-white/60 bg-white/82 p-4 backdrop-blur-sm sm:max-w-md">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eef7dc] px-3 py-1 text-xs font-medium text-[#5c8a3f]">{farm?.name}</span>
                  <span className="rounded-full bg-[#f4f2ea] px-3 py-1 text-xs text-ink/65">{farm?.location?.replace("·", " · ")}</span>
                </div>
                <p className="mt-3 text-xs text-ink/45">批次信息</p>
                <p className="mt-1 text-sm leading-6 text-ink/75">{product.traceability[0]}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <span className="eyebrow">{product.badge}</span>
            <div>
              <p className="text-sm text-ink/50">{product.category}</p>
              <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{product.name}</h1>
              <p className="mt-4 text-base leading-8 text-ink/72">{product.desc}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel p-5">
                <p className="text-xs text-ink/45">会员价</p>
                <p className="mt-2 text-3xl font-semibold text-ink">¥{product.memberPrice}</p>
                <p className="mt-1 text-sm text-ink/45 line-through">日常价 ¥{product.price}</p>
              </div>
              <div className="panel p-5">
                <p className="text-xs text-ink/45">来源农场</p>
                <p className="mt-2 text-2xl font-medium text-ink">{farm?.name}</p>
                <p className="mt-1 text-sm text-ink/60">{farm?.location}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/join" className="cta-primary">预约会员购买</Link>
              <Link href="/traceability" className="cta-secondary">查看农场溯源</Link>
            </div>
            <div className="rounded-[28px] border border-[#e6ead8] bg-[#f8f8f1] p-5">
              <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">quick guide</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "看产地", value: farm?.location || "产地公开" },
                  { label: "看批次", value: product.traceability[0] },
                  { label: "看适合谁", value: product.highlights?.[1] || "适合家庭常备" }
                ].map((item) => (
                  <div key={item.label} className="rounded-[22px] bg-white p-4">
                    <p className="text-xs text-ink/45">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/75">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-ink">商品亮点</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {product.highlights.map((item) => (
                <div key={item} className="rounded-[24px] bg-mist p-4 text-sm leading-7 text-ink/72">
                  {item}
                </div>
              ))}
            </div>
            <h3 className="mt-8 text-xl font-medium text-ink">适合家庭场景</h3>
            <p className="mt-3 text-sm leading-7 text-ink/72">{product.nutrition}</p>
            <h3 className="mt-8 text-xl font-medium text-ink">可追溯信息</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink/72">
              {product.traceability.map((item) => (
                <li key={item} className="rounded-[22px] border border-ink/8 bg-white px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="overflow-hidden rounded-[28px]">
                <img
                  src={farm?.image || product.image}
                  alt={farm?.name || product.name}
                  className="h-full min-h-[280px] w-full object-cover"
                />
              </div>
              <div className="space-y-4 rounded-[28px] bg-earth-glow p-6">
                <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">how to trust this item</p>
                <h3 className="text-2xl font-medium text-ink">一份安心食材，具体要看哪些信息</h3>
                <div className="space-y-3">
                  <div className="rounded-[22px] bg-white/85 p-4 text-sm leading-7 text-ink/72">
                    先看来源农场是否长期稳定，是否能说清楚产地、种植方式和履约流程。
                  </div>
                  <div className="rounded-[22px] bg-white/85 p-4 text-sm leading-7 text-ink/72">
                    再看批次信息和最近检测摘要，确认这不是一句泛泛而谈的有机宣传。
                  </div>
                  <div className="rounded-[22px] bg-white/85 p-4 text-sm leading-7 text-ink/72">
                    最后看它是否适合你的家庭场景，比如儿童加餐、主粮补货或固定周配需求。
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel p-6">
              <h2 className="text-2xl font-medium text-ink">检测与认证</h2>
              {reports.length ? (
                <div className="mt-4 space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="rounded-[24px] bg-mist p-5 text-sm leading-7 text-ink/72">
                      <p className="font-medium text-ink">{report.title}</p>
                      <p className="mt-2">{report.summary}</p>
                      <p className="mt-3 text-ink/55">报告编号：{report.id}</p>
                      <a href={report.attachmentUrl} target="_blank" rel="noreferrer" className="cta-secondary mt-4">
                        查看报告附件
                      </a>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 space-y-3 text-sm text-ink/72">
                {farm?.certifications.map((item) => (
                  <div key={item} className="rounded-[20px] border border-ink/8 bg-white px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-6">
              <h2 className="text-2xl font-medium text-ink">配送建议</h2>
              <p className="mt-4 text-sm leading-7 text-ink/72">
                推荐加入会员后设置每周或每两周补货频率，系统将依据家庭结构和常购记录提醒下单与预约配送。
              </p>
            </div>
          </div>
        </div>

        {reports.length ? (
          <div className="space-y-6">
            <h2 className="section-title">本商品关联检测报告</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-6">
          <h2 className="section-title">你可能还想一起加入家庭食材清单</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <div key={item.slug} className="overflow-hidden rounded-[28px] border border-[#e9eadf] bg-white p-4 shadow-[0_18px_44px_rgba(65,87,48,0.06)]">
                <div className="mb-4 h-44 overflow-hidden rounded-[22px] bg-mist">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-[#5a843d]">{item.category}</p>
                  <p className="text-2xl font-semibold tracking-tight text-[#6fb25a]">¥{item.memberPrice}</p>
                </div>
                <h3 className="mt-2 text-xl font-medium text-ink">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/70">{item.desc}</p>
                <Link href={`/products/${item.slug}`} className="cta-secondary mt-5">
                  查看商品
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
