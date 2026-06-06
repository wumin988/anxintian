import { FarmCard } from "@/components/farm-card";
import { ReportCard } from "@/components/report-card";
import { SectionHeading } from "@/components/section-heading";
import { getReportById, getSiteContent } from "@/lib/site-content";

export const metadata = {
  title: "农场溯源 | 安心田"
};

export const dynamic = "force-dynamic";

export default async function TraceabilityPage() {
  const content = await getSiteContent();
  const farms = content.farms || [];

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[360px]">
              <img
                src="/imagery/traceability-hero-china.png"
                alt="农场溯源场景"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/18 to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-xl p-8 text-white">
                <p className="text-xs tracking-[0.18em] uppercase text-white/70">traceability files</p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">先认识农场，再决定这份食材是否值得长期放进家里</h1>
              </div>
            </div>
            <div className="bg-earth-glow p-8">
              <p className="text-sm leading-7 text-ink/72">
                安心田把农场信息放在前面，是因为真正的信任不该等到付款后才出现。你可以先看到产地、管理方式、认证资料和最近报告，再决定是否加入会员关系。
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">公开内容</p>
                  <p className="mt-2 text-lg font-medium text-ink">产地、农法、检测、履约方式</p>
                </div>
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">目标感受</p>
                  <p className="mt-2 text-lg font-medium text-ink">让用户在购买前就有把握感</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SectionHeading
          eyebrow="farm traceability"
          title="合作农场溯源档案"
          description="这一页集中展示农场背景、管理方式、认证资料和近期检测摘要。用户不需要先下单，先建立信任再决定是否加入。"
        />

        <div className="grid gap-6 xl:grid-cols-3">
          {farms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} report={getReportById(content, farm.reportId)} />
          ))}
        </div>

        <div className="space-y-6">
          {farms.map((farm) => {
            const report = getReportById(content, farm.reportId);

            return (
              <section key={farm.id} id={farm.id} className="panel p-6 sm:p-8">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-[28px]">
                      <img src={farm.image} alt={farm.name} className="h-64 w-full object-cover sm:h-72" />
                    </div>
                    <span className="eyebrow">{farm.location}</span>
                    <h2 className="section-title">{farm.name}</h2>
                    <p className="body-muted">{farm.story}</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[24px] bg-mist p-4">
                        <p className="text-xs text-ink/45">建场年份</p>
                        <p className="mt-2 text-xl font-medium text-ink">{farm.established}</p>
                      </div>
                      <div className="rounded-[24px] bg-mist p-4">
                        <p className="text-xs text-ink/45">规模</p>
                        <p className="mt-2 text-xl font-medium text-ink">{farm.acreage}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium text-ink">管理与履约方式</h3>
                      <div className="mt-4 grid gap-3">
                        {farm.practices.map((item) => (
                          <div key={item} className="rounded-[22px] border border-ink/8 bg-white px-4 py-3 text-sm leading-7 text-ink/72">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="rounded-[28px] bg-mist p-5">
                        <h3 className="text-lg font-medium text-ink">认证资料</h3>
                        <ul className="mt-4 space-y-3 text-sm text-ink/72">
                          {farm.certifications.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-[28px] bg-ink p-5 text-white">
                        <h3 className="text-lg font-medium">最近检测摘要</h3>
                        <p className="mt-4 text-sm leading-7 text-white/80">{report?.summary}</p>
                        <p className="mt-4 text-sm text-white/65">报告编号：{report?.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="space-y-6">
          <SectionHeading
            eyebrow="report attachments"
            title="公开检测附件预览"
            description="MVP 已经支持本地附件链接展示。后续可以把这里替换成真实 PDF、扫描件或图像报告。"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {(content.reports || []).map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
