import { notFound } from "next/navigation";
import { ReportCard } from "@/components/report-card";
import { getFarmById, getReportById, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const content = await getSiteContent();
  const farm = getFarmById(content, params.id);

  return {
    title: farm ? `${farm.name} | 农场详情 | 安心田` : "农场详情 | 安心田"
  };
}

export default async function FarmDetailPage({ params }) {
  const content = await getSiteContent();
  const farm = getFarmById(content, params.id);

  if (!farm) {
    notFound();
  }

  const report = getReportById(content, farm.reportId);

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative min-h-[360px]">
              <img src={farm.image} alt={farm.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/18 to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-2xl p-8 text-white">
                <p className="text-xs tracking-[0.18em] uppercase text-white/70">farm profile</p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{farm.name}</h1>
                <p className="mt-4 text-sm leading-7 text-white/82">{farm.location} · {farm.specialty}</p>
              </div>
            </div>
            <div className="bg-earth-glow p-8">
              <p className="text-sm leading-7 text-ink/72">
                在安心田，农场不是供货商备注，而是平台最重要的长期资产。用户记住的，应该是这片土地、这组管理方式，以及它连续几年交出的检测记录。
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">合作年限</p>
                  <p className="mt-2 text-2xl font-medium text-ink">{farm.cooperationYears}</p>
                </div>
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">累计检测</p>
                  <p className="mt-2 text-2xl font-medium text-ink">{farm.cumulativeTests}</p>
                </div>
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">最近检测</p>
                  <p className="mt-2 text-2xl font-medium text-ink">{farm.lastTest}</p>
                </div>
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">平台评级</p>
                  <p className="mt-2 text-2xl font-medium text-ink">{farm.platformRating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="panel p-6 sm:p-8">
            <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">farm story</p>
            <h2 className="mt-3 text-3xl font-medium text-ink">农场故事</h2>
            <p className="mt-5 text-sm leading-8 text-ink/72">{farm.story}</p>

            <h3 className="mt-8 text-xl font-medium text-ink">管理方式</h3>
            <div className="mt-4 grid gap-3">
              {farm.practices.map((item) => (
                <div key={item} className="rounded-[22px] border border-ink/8 bg-white px-4 py-3 text-sm leading-7 text-ink/72">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel p-6">
              <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">map</p>
              <h2 className="mt-3 text-2xl font-medium text-ink">地图</h2>
              <div className="mt-5 rounded-[28px] bg-earth-glow p-5">
                <div className="rounded-[24px] bg-white p-5">
                  <p className="text-sm font-medium text-ink">{farm.mapLabel}</p>
                  <p className="mt-3 text-sm leading-7 text-ink/70">{farm.mapNote}</p>
                </div>
              </div>
            </div>

            <div className="panel p-6">
              <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">certifications</p>
              <h2 className="mt-3 text-2xl font-medium text-ink">认证</h2>
              <div className="mt-5 space-y-3">
                {farm.certifications.map((item) => (
                  <div key={item} className="rounded-[22px] bg-mist px-4 py-3 text-sm text-ink/72">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="panel p-6 sm:p-8">
            <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">detection history</p>
            <h2 className="mt-3 text-3xl font-medium text-ink">检测历史</h2>
            <div className="mt-6 space-y-4">
              {farm.detectionHistory?.map((item) => (
                <div key={`${item.date}-${item.title}`} className="rounded-[24px] bg-mist p-5">
                  <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">{item.date}</p>
                  <p className="mt-2 text-lg font-medium text-ink">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-ink/72">{item.result}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6 sm:p-8">
            <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">video</p>
            <h2 className="mt-3 text-3xl font-medium text-ink">视频</h2>
            <div className="mt-6 overflow-hidden rounded-[28px] bg-black">
              <video controls playsInline preload="none" poster={farm.videoPoster} className="h-full w-full">
                <source src={farm.videoUrl} type="video/mp4" />
              </video>
            </div>
            <div className="mt-4 rounded-[24px] bg-earth-glow p-5">
              <p className="text-lg font-medium text-ink">{farm.videoTitle}</p>
              <p className="mt-3 text-sm leading-7 text-ink/72">{farm.videoNote}</p>
            </div>
          </div>
        </div>

        {report ? (
          <div className="space-y-6">
            <h2 className="section-title">最近一份关联检测报告</h2>
            <div className="max-w-xl">
              <ReportCard report={report} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
