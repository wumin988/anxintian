import { SectionHeading } from "@/components/section-heading";
import { getSiteContent } from "@/lib/site-content";

export const metadata = {
  title: "关于我们 | 安心田"
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();
  const aboutValues = content.aboutValues || [];

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
            <div className="relative min-h-[360px]">
              <img
                src="https://images.pexels.com/photos/6231588/pexels-photo-6231588.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="安心田品牌理念"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/15 to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-xl p-8 text-white">
                <p className="text-xs tracking-[0.2em] text-white/70 uppercase">brand story</p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">把复杂标准翻译成家庭能真正用上的安心感</h1>
              </div>
            </div>
            <div className="bg-earth-glow p-8 sm:p-10">
              <p className="text-sm leading-7 text-ink/72">
                安心田相信，真正的健康饮食平台不只是卖食材，而是帮助一个家庭逐步建立起稳定、透明、可持续的生活方式。
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">品牌出发点</p>
                  <p className="mt-2 text-lg font-medium text-ink">替家庭把关，而不是替货架扩容</p>
                </div>
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">品牌承诺</p>
                  <p className="mt-2 text-lg font-medium text-ink">让用户看懂来源、看懂检测、看懂为什么值得买</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel overflow-hidden">
            <div className="relative min-h-[360px]">
              <img
                src="https://images.pexels.com/photos/7656746/pexels-photo-7656746.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="品牌团队与产地沟通"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/15 to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-xl p-8 text-white">
                <p className="text-xs tracking-[0.18em] uppercase text-white/70">field work</p>
                <p className="mt-2 text-3xl font-medium leading-tight">真正的信任，不是在页面里说出来，而是在田间、仓储和履约里一点点建立起来</p>
              </div>
            </div>
          </div>
          <div className="panel p-8">
            <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">our method</p>
            <h3 className="mt-3 font-serif text-3xl text-ink">我们如何把标准变成用户能感知的体验</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] bg-mist p-5">
                <p className="text-sm text-ink/45">前端呈现</p>
                <p className="mt-2 text-base leading-7 text-ink/75">通过商品图、农场图、报告入口和批次信息，让用户先建立感知，再建立信任。</p>
              </div>
              <div className="rounded-[24px] bg-mist p-5">
                <p className="text-sm text-ink/45">后台运营</p>
                <p className="mt-2 text-base leading-7 text-ink/75">通过后台内容台持续更新商品、农场和检测资料，让品牌表达不是一次性静态页面。</p>
              </div>
            </div>
          </div>
        </div>
        <SectionHeading
          eyebrow="about anxintian"
          title="一家把信任感当成核心产品来打磨的食材平台"
          description="安心田相信，家庭真正需要的不是更多选择，而是更少焦虑、更强把握感，以及长期稳定的健康饮食支持。"
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="panel bg-earth-glow p-8">
            <h2 className="text-2xl font-medium text-ink">我们为什么存在</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-ink/72">
              <p>越来越多家庭想为孩子、父母和自己买更好的食材，但市场上有机、生态、农场直供的信息过于分散，也难以验证。</p>
              <p>安心田希望把复杂标准整理成普通家庭看得懂、用得上的体验，让好食材的选择不再靠猜。</p>
              <p>我们关注的不只是卖出一单，而是陪伴一个家庭逐渐建立起更稳的健康饮食方式。</p>
            </div>
          </div>
          <div className="panel p-8">
            <h2 className="text-2xl font-medium text-ink">我们的工作方式</h2>
            <div className="mt-6 space-y-4">
              {aboutValues.map((item) => (
                <div key={item.title} className="rounded-[24px] bg-mist p-5">
                  <h3 className="text-lg font-medium text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink/72">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel p-8">
          <h2 className="text-2xl font-medium text-ink">品牌关键词</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {["可信", "有机", "溯源", "家庭健康", "会员制", "长期服务", "生活方式"].map((word) => (
              <span key={word} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-ink/70">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
