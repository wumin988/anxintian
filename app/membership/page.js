import Link from "next/link";
import { MembershipCard } from "@/components/membership-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getFarmById, getReportById, getSiteContent } from "@/lib/site-content";

const serviceFlow = [
  "加入会员，填写家庭结构、饮食偏好与所在城市",
  "获取一份适合你家庭的精选食材建议清单",
  "设置按周、双周或月度配送节奏",
  "在查看溯源和检测信息的前提下稳定补货"
];

export const metadata = {
  title: "会员介绍 | 安心田"
};

export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const content = await getSiteContent();
  const membershipPlans = content.membershipPlans || [];
  const products = content.products || [];

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[340px]">
              <img
                src="https://images.pexels.com/photos/4262424/pexels-photo-4262424.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="安心田会员家庭生活方式"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-xl p-8 text-white">
                <p className="text-xs tracking-[0.2em] text-white/70 uppercase">family membership</p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">把每周买菜，变成长期安心的家庭习惯</h1>
                <p className="mt-4 text-sm leading-7 text-white/80">适合有孩子、关注老人饮食和想减少选购焦虑的家庭用户。</p>
              </div>
            </div>
            <div className="bg-earth-glow p-8">
              <p className="text-sm leading-7 text-ink/72">
                会员制不是为了提高门槛，而是为了换来更稳定的农场合作、更透明的检测公开、更顺滑的配送服务，以及更低的家庭决策成本。
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">精选供给</p>
                  <p className="mt-2 text-lg font-medium text-ink">少而精，不靠堆 SKU</p>
                </div>
                <div className="rounded-[24px] bg-white/85 p-5">
                  <p className="text-sm text-ink/45">长期服务</p>
                  <p className="mt-2 text-lg font-medium text-ink">从补货到配送都更省心</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="panel overflow-hidden lg:col-span-2">
            <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
              <div className="relative min-h-[280px]">
                <img
                  src="https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1400"
                  alt="家庭厨房餐桌"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <p className="text-xs tracking-[0.18em] uppercase text-white/70">weekly routine</p>
                  <p className="mt-2 text-2xl font-medium">固定补货，让家庭餐桌更稳定</p>
                </div>
              </div>
              <div className="relative min-h-[280px]">
                <img
                  src="https://images.pexels.com/photos/6995221/pexels-photo-6995221.jpeg?auto=compress&cs=tinysrgb&w=1400"
                  alt="冷链配送服务"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <p className="text-xs tracking-[0.18em] uppercase text-white/70">delivery care</p>
                  <p className="mt-2 text-2xl font-medium">从农场到入户，履约体验也被认真管理</p>
                </div>
              </div>
            </div>
          </div>
          <div className="panel p-6">
            <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">membership value</p>
            <h3 className="mt-3 font-serif text-3xl text-ink">会员不是折扣卡，而是家庭食品管家</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-[22px] bg-mist p-4 text-sm leading-7 text-ink/72">
                你得到的是每周家庭食材清单，知道本周什么值得买、什么不值得买，而不是每次都从零开始筛选食材。
              </div>
              <div className="rounded-[22px] bg-mist p-4 text-sm leading-7 text-ink/72">
                你看到的是农场溯源权限、检测报告库和走进农场的生产现场，而不是一次性的营销文案。
              </div>
              <div className="rounded-[22px] bg-mist p-4 text-sm leading-7 text-ink/72">
                你享受的是根据家庭结构推荐、专属配送协调和补货提醒一起组成的长期服务体验。
              </div>
            </div>
          </div>
        </div>
        <SectionHeading
          eyebrow="membership system"
          title="年费会员，购买的是长期安心的家庭食材管理能力"
          description="安心田的会员制设计，不是为了打折，而是为了把每周家庭食材清单、农场信息、检测报告、定配服务和家庭建议持续运转起来。"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {membershipPlans.map((plan, index) => (
            <MembershipCard key={plan.name} plan={plan} featured={index === 1} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-ink">会员服务是怎样运作的</h2>
            <div className="mt-6 space-y-4">
              {serviceFlow.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-[24px] bg-mist p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-medium text-white">
                    0{index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-7 text-ink/72">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel bg-earth-glow p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-ink">为什么适合家庭用户</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-ink/72">
              <p>宝宝辅食家庭，更需要有人告诉你哪些叶菜、主粮和乳品更适合长期放进家里。</p>
              <p>老人健康家庭，更需要稳定、易理解、少焦虑的采购方式，而不是频繁试错。</p>
              <p>健身家庭，也需要更清楚的主粮、乳品和高频补货建议，减少日常决策成本。</p>
            </div>
            <Link href="/join" className="cta-primary mt-8">预约加入会员</Link>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeading
            eyebrow="member picks"
            title="会员常从这些高频食材开始建立家庭清单"
            description="先从一周内真正会吃掉、也适合长期补货的食材开始，比一次买很多更轻松。"
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
