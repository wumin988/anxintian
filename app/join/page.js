import { JoinForm } from "@/components/join-form";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent } from "@/lib/site-content";

export const metadata = {
  title: "预约加入会员 | 安心田"
};

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  const content = await getSiteContent();
  const joinBenefits = content.joinBenefits || [];

  return (
    <section className="section-space">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="join waitlist"
            title="预约成为安心田会员"
            description="MVP 已接入本地真实提交。提交后可获取会员顾问联系、开通城市通知和适合你家庭的首份精选建议清单。"
          />

          <div className="panel p-6">
            <h2 className="text-xl font-medium text-ink">提交后你会收到</h2>
            <div className="mt-5 space-y-3">
              {joinBenefits.map((item) => (
                <div key={item} className="rounded-[22px] bg-mist px-4 py-3 text-sm text-ink/72">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <JoinForm />
        </div>
      </div>
    </section>
  );
}
