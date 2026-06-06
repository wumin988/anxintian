import Link from "next/link";
import { notFound } from "next/navigation";
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
  const primaryReport = reports[0];

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="panel p-6 sm:p-8">
          <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">trust order</p>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">先看农场，再看检测、批次、运输，最后再看商品</h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-ink/72">
            这页不是从“多少钱”开始，而是从“它来自哪里、最近测了什么、这一批怎么走到你家”开始。安心田希望你在考虑购买前，先把信任链条看完整。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="panel overflow-hidden">
            <div className="h-72 overflow-hidden">
              <img src={farm?.image || product.image} alt={farm?.name || product.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">1. source farm</p>
              <h2 className="mt-3 text-3xl font-medium text-ink">{farm?.name}</h2>
              <p className="mt-4 text-sm leading-8 text-ink/72">{farm?.story}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-mist p-4">
                  <p className="text-xs text-ink/45">合作时间</p>
                  <p className="mt-2 text-xl font-medium text-ink">{farm?.cooperationYears}</p>
                </div>
                <div className="rounded-[24px] bg-mist p-4">
                  <p className="text-xs text-ink/45">平台评级</p>
                  <p className="mt-2 text-xl font-medium text-ink">{farm?.platformRating}</p>
                </div>
              </div>
              <Link href={`/traceability/${farm?.id}`} className="cta-secondary mt-6">查看农场详情</Link>
            </div>
          </div>

          <div className="panel p-6 sm:p-8">
            <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">2. reports</p>
            <h2 className="mt-3 text-3xl font-medium text-ink">检测</h2>
            <div className="mt-6 space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="rounded-[24px] bg-mist p-5">
                  <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">{report.date}</p>
                  <p className="mt-2 text-lg font-medium text-ink">{report.title}</p>
                  <p className="mt-3 text-sm leading-7 text-ink/72">{report.summary}</p>
                  <Link href={`/reports/${report.id}`} className="cta-secondary mt-4">查看检测详情</Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="panel p-6 sm:p-8">
            <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">3. batch</p>
            <h2 className="mt-3 text-3xl font-medium text-ink">批次</h2>
            <div className="mt-6 space-y-3">
              {product.traceability.map((item) => (
                <div key={item} className="rounded-[22px] border border-ink/8 bg-white px-4 py-3 text-sm leading-7 text-ink/72">
                  {item}
                </div>
              ))}
            </div>
            {primaryReport?.batchCode ? (
              <div className="mt-5 rounded-[24px] bg-earth-glow p-5 text-sm leading-7 text-ink/72">
                对应检测批次：<span className="font-medium text-ink">{primaryReport.batchCode}</span>
              </div>
            ) : null}
          </div>

          <div className="panel p-6 sm:p-8">
            <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">4. transport</p>
            <h2 className="mt-3 text-3xl font-medium text-ink">运输</h2>
            <p className="mt-6 text-sm leading-8 text-ink/72">
              {primaryReport?.transportRecord || "当前商品支持会员城市冷链预约配送，平台会根据家庭结构和补货节奏安排发运。"}
            </p>
            <div className="mt-6 rounded-[24px] bg-mist p-5 text-sm leading-7 text-ink/72">
              推荐加入会员后设置每周或每两周补货频率，系统将依据家庭结构和常购记录提醒下单与预约配送。
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div className="panel overflow-hidden bg-earth-glow p-5 sm:p-6">
            <div className="relative h-[340px] overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#dce7d6,#f5dfcf_55%,#fffaf6)] sm:h-[460px]">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-white/10" />
              <div className="absolute left-8 top-8 rounded-full bg-[#f4f8e8]/95 px-4 py-2 text-xs font-medium text-[#507a35]">
                会员精选
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <span className="eyebrow">5. product</span>
            <div>
              <p className="text-sm text-ink/50">{product.category}</p>
              <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{product.name}</h2>
              <p className="mt-4 text-base leading-8 text-ink/72">{product.desc}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel p-5">
                <p className="text-xs text-ink/45">会员价</p>
                <p className="mt-2 text-3xl font-semibold text-ink">¥{product.memberPrice}</p>
                <p className="mt-1 text-sm text-ink/45 line-through">日常价 ¥{product.price}</p>
              </div>
              <div className="panel p-5">
                <p className="text-xs text-ink/45">适合家庭场景</p>
                <p className="mt-2 text-lg font-medium text-ink">{product.highlights?.[1] || "家庭常备"}</p>
                <p className="mt-2 text-sm leading-6 text-ink/60">{product.nutrition}</p>
              </div>
            </div>
            <h3 className="text-xl font-medium text-ink">商品亮点</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {product.highlights.map((item) => (
                <div key={item} className="rounded-[24px] bg-mist p-4 text-sm leading-7 text-ink/72">
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/join" className="cta-primary">预约会员购买</Link>
              <Link href={`/traceability/${farm?.id}`} className="cta-secondary">查看农场溯源</Link>
            </div>
          </div>
        </div>

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
