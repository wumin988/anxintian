import Link from "next/link";
import { MembershipCard } from "@/components/membership-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { TrustCard } from "@/components/trust-card";
import { getFarmById, getReportById, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const guaranteeEmoji = {
  "农场审核": "🌱",
  "批次检测": "📋",
  "会员直供": "🚚"
};

export default async function HomePage() {
  const content = await getSiteContent();
  const farms = content.farms || [];
  const membershipPlans = content.membershipPlans || [];
  const products = content.products || [];
  const reports = content.reports || [];
  const stats = content.stats || [];
  const testimonials = content.testimonials || [];
  const trustHighlights = content.trustHighlights || [];
  const trustModules = content.trustModules || [];

  return (
    <>
      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-6">
              <span className="eyebrow">家庭食品信任平台</span>
              <h1 className="display-title">让家人吃得更放心</h1>
              <p className="max-w-2xl text-base leading-8 text-ink/72 sm:text-lg">
                我们筛选农场、审核标准、检测批次，只把值得信任的食材送到家庭餐桌。安心田先卖信任，再卖食材。
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-ink/68">
                {["农场实地审核", "批次检测公开", "会员直供配送", "家庭场景建议"].map((item) => (
                  <span key={item} className="rounded-full border border-ink/10 bg-white/80 px-4 py-2">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/trust" className="cta-primary">了解我们的标准</Link>
                <Link href="/traceability" className="cta-secondary">查看农场</Link>
              </div>
            </div>

            <div className="panel overflow-hidden bg-earth-glow p-6 sm:p-8">
              <div className="rounded-[28px] border border-white/70 bg-white/78 p-6">
                <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">trust data</p>
                <h2 className="mt-2 font-serif text-3xl text-ink">先看一组能让家庭建立把握感的数字</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-[24px] bg-white p-5 shadow-sm">
                      <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-ink">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-ink/65">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="three safeguards"
            title="安心田三重保障"
            description="一句话让用户先懂你的平台到底保障什么，再决定要不要继续了解商品。"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {trustHighlights.map((item) => (
              <div key={item.title} className="panel p-7">
                <p className="text-sm text-ink/45">{guaranteeEmoji[item.title]} {item.title}</p>
                <h3 className="mt-3 text-2xl font-medium text-ink">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink/72">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="source farms"
              title="合作农场"
              description="你的壁垒不是商品，而是农场。用户最后记住的，应该是松林谷、黑河原生稻田、宁夏晨曦牧场这些真实来源。"
            />
            <Link href="/traceability" className="cta-primary">查看农场档案</Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {farms.map((farm) => {
              const report = getReportById(content, farm.reportId);

              return (
                <div key={farm.id} className="panel overflow-hidden">
                  <div className="h-44 overflow-hidden">
                    <img src={farm.image} alt={farm.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-ink/50">{farm.location}</p>
                    <h3 className="mt-2 text-xl font-medium text-ink">{farm.name}</h3>
                    <div className="mt-4 rounded-3xl bg-mist p-4 text-sm text-ink/72">
                      <p>认证：{farm.certifications?.[0]}</p>
                      <p className="mt-2">最近检测：{report?.summary?.split("；")[0]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="weekly reports"
            title="本周检测报告"
            description="让普通家庭在下单前就能先看最近批次的检测摘要，而不是只看到一句“我们很严格”。"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {reports.map((report) => (
              <div key={report.id} className="panel p-6">
                <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">{report.date}</p>
                <h3 className="mt-3 text-xl font-medium text-ink">{report.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/72">{report.summary}</p>
                <Link href="/trust" className="cta-secondary mt-5">进入报告库</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="membership"
            title="会员 = 家庭食品管家"
            description="会员价值不是折扣，而是每周精选推荐、农场溯源权限、检测报告库、专属配送、家庭定制食材包和农场直播。"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {membershipPlans.map((plan, index) => (
              <MembershipCard key={plan.name} plan={plan} featured={index === 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="trust center"
            title="信任中心"
            description="把准入机制、批次检测、批次追踪和会员履约放在一起，让用户知道这不是普通商品货架。"
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {trustModules.map((item) => (
              <TrustCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="selected products"
            title="精选商品"
            description="商品排在这里，因为它们只是信任关系成立之后的结果。先公开标准，再把值得放进家里的食材放到用户面前。"
          />
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                farm={getFarmById(content, product.farmId)}
                report={getReportById(content, product.reportIds?.[0])}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="panel bg-ink p-8 text-white">
            <span className="eyebrow border-white/20 bg-white/10 text-white">member voices</span>
            <div className="mt-6 space-y-6">
              {testimonials.map((item) => (
                <blockquote key={item.author} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                  <p className="text-lg leading-8">“{item.quote}”</p>
                  <footer className="mt-4 text-sm text-white/72">{item.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
          <div className="panel p-8">
            <SectionHeading
              eyebrow="next step"
              title="加入会员"
              description="信任先成交，商品才会成交。先预约，让我们根据你的家庭结构和饮食需求给出更合适的长期建议。"
            />
            <div className="mt-8 space-y-4">
              <div className="rounded-[24px] bg-mist p-5">
                <p className="text-sm text-ink/45">你将获得</p>
                <p className="mt-2 text-base leading-7 text-ink/75">每周精选推荐、农场溯源权限、检测报告库、专属配送和家庭定制食材包建议。</p>
              </div>
              <div className="rounded-[24px] bg-mist p-5">
                <p className="text-sm text-ink/45">适合谁</p>
                <p className="mt-2 text-base leading-7 text-ink/75">有孩子的家庭、关注老人饮食健康的家庭、想减少食材选择焦虑的高频用户。</p>
              </div>
            </div>
            <Link href="/join" className="cta-primary mt-8">填写预约表单</Link>
          </div>
        </div>
      </section>
    </>
  );
}
