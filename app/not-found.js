import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="panel bg-earth-glow p-8 sm:p-12">
          <span className="eyebrow">page not found</span>
          <h1 className="mt-5 font-serif text-4xl text-ink sm:text-5xl">这页暂时没有找到</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink/72">
            你访问的内容可能还没公开，或者链接已经调整。可以先回首页、浏览商品，或直接去看农场和信任中心。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="cta-primary">
              返回首页
            </Link>
            <Link href="/products" className="cta-secondary">
              浏览商品
            </Link>
            <Link href="/traceability" className="cta-secondary">
              查看农场溯源
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
