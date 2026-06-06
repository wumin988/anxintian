import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white/60">
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="font-serif text-2xl text-ink">安心田</p>
          <p className="max-w-md text-sm leading-7 text-ink/70">
            可信有机食材会员直供平台。把农场、检测、配送和家庭饮食建议整合在一起，让“吃得安心”成为可以长期坚持的生活方式。
          </p>
        </div>

        <div className="space-y-3 text-sm text-ink/75">
          <p className="font-medium text-ink">快速访问</p>
          <Link href="/products" className="block hover:text-moss">商品列表</Link>
          <Link href="/membership" className="block hover:text-moss">会员介绍</Link>
          <Link href="/trust" className="block hover:text-moss">信任中心</Link>
        </div>

        <div className="space-y-3 text-sm text-ink/75">
          <p className="font-medium text-ink">联系我们</p>
          <p>会员顾问：400-101-3030</p>
          <p>服务城市：上海 / 杭州 / 苏州 / 深圳</p>
          <p>邮箱：hello@anxintian.local</p>
        </div>
      </div>
    </footer>
  );
}
