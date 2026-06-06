import { ReportCard } from "@/components/report-card";
import { SectionHeading } from "@/components/section-heading";
import { TrustCard } from "@/components/trust-card";
import { getSiteContent } from "@/lib/site-content";

const signals = [
  {
    title: "资质核验",
    text: "农场营业资质、认证证书、合作实验室与仓储条件逐项备案。"
  },
  {
    title: "样品复检",
    text: "上线前先做样品抽检，稳定合作后依然按月度与季度节奏复检。"
  },
  {
    title: "批次记录",
    text: "对叶菜、主粮、乳品等关键品类记录采收和加工批次，便于追踪。"
  },
  {
    title: "公开说明",
    text: "报告不只上传编号，也配合摘要说明，帮助普通家庭理解检测结果。"
  }
];

export const metadata = {
  title: "信任中心 | 安心田"
};

export const dynamic = "force-dynamic";

export default async function TrustPage() {
  const content = await getSiteContent();
  const trustModules = content.trustModules || [];
  const reports = content.reports || [];

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="trust center"
          title="安心田如何建立信任"
          description="我们把可信拆成一组用户可以看见、能理解、可长期验证的机制，而不是靠品牌自说自话。"
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trustModules.map((item) => (
            <TrustCard key={item.title} item={item} />
          ))}
        </div>

        <div className="panel p-6 sm:p-8">
          <h2 className="text-2xl font-medium text-ink">信任建立流程</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {signals.map((item, index) => (
              <div key={item.title} className="rounded-[26px] bg-mist p-5">
                <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">step {index + 1}</p>
                <h3 className="mt-3 text-lg font-medium text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/72">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="panel bg-ink p-8 text-white">
            <h2 className="text-2xl font-medium">我们特别重视什么</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-white/80">
              <p>不是所有有机都足够让家庭放心，所以我们重点公开稳定供给能力、日常管理记录和检测连续性。</p>
              <p>不是所有用户都能看懂检测报告，所以平台会把关键结果翻译成普通家庭能快速判断的语言。</p>
              <p>不是每一次购买都能形成安心感，所以会员服务必须配合长期履约体验一起成立。</p>
            </div>
          </div>
          <div className="panel p-8">
            <h2 className="text-2xl font-medium text-ink">MVP 阶段信任模块建议</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-ink/72">
              <p>当前页面已经支持农场认证、报告编号、批次信息与报告附件展示，适合先验证官网的叙事方式。</p>
              <p>下一步如果继续升级，建议把检测报告做成 PDF 缩略图和时间线，品牌说服力会更强。</p>
              <p>还可以增加为什么这份食材适合孩子、孕妈、控糖家庭的解释模块，进一步靠近目标用户。</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeading
            eyebrow="report library"
            title="公开可查看的检测附件"
            description="MVP 阶段用本地附件代替真实 PDF，已经支持从前台直接打开查看。"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
