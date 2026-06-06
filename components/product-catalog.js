"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";

const sectionMeta = {
  "时令蔬菜": {
    icon: "菜",
    subtitle: "Vegetables",
    description: "每天餐桌都用得上的基础鲜菜，优先看新鲜度、地块与周配稳定性。",
    accent: "bg-[linear-gradient(135deg,#f4f7de,#edf6d9_45%,#f7f3e6)]",
    tagline: "每天都能用上的家庭基础菜篮"
  },
  "家庭主粮": {
    icon: "米",
    subtitle: "Staples",
    description: "主粮要长期吃，重点看产地环境、加工方式和适合家庭长期复购的稳定口感。",
    accent: "bg-[linear-gradient(135deg,#f7efdc,#f5f3e8_45%,#ecefdd)]",
    tagline: "稳定回购的安心主粮清单"
  },
  "有机乳品": {
    icon: "奶",
    subtitle: "Dairy",
    description: "更适合早餐与儿童加餐场景，优先公开菌检、冷链与定配履约信息。",
    accent: "bg-[linear-gradient(135deg,#eef6e6,#f7f3ea_45%,#eef4e8)]",
    tagline: "更适合早餐和孩子加餐场景"
  },
  "儿童友好": {
    icon: "童",
    subtitle: "Kids",
    description: "挑孩子更容易接受、也更适合家庭常备的安心食材，降低做饭与搭配压力。",
    accent: "bg-[linear-gradient(135deg,#f7f0dd,#f4f8e2_45%,#f7f2e8)]",
    tagline: "更好做、更好吃、更容易被接受"
  },
  "会员定配": {
    icon: "配",
    subtitle: "Weekly Plan",
    description: "适合按周建立固定清单，让家庭补货更省心，适合高频、稳定、可预测的食材。",
    accent: "bg-[linear-gradient(135deg,#edf6df,#f2f5e7_45%,#f8f3e6)]",
    tagline: "把高频食材做成更省心的周配"
  }
};

export function ProductCatalog({ categories, products, farms }) {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [query, setQuery] = useState("");

  const categoryOptions = ["全部", ...categories.filter((category) => category !== "全部")];
  const normalizedQuery = query.trim().toLowerCase();
  const isFiltering = activeCategory !== "全部" || Boolean(normalizedQuery);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "全部" || product.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        [product.name, product.desc, product.category, farms[product.farmId]?.name, farms[product.farmId]?.location]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, farms, normalizedQuery, products]);

  const groupedProducts = useMemo(() => {
    return categoryOptions
      .filter((category) => category !== "全部")
      .map((category) => ({
        category,
        items: products.filter((product) => product.category === category)
      }))
      .filter((group) => group.items.length);
  }, [categoryOptions, products]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">catalog tools</p>
              <h2 className="mt-2 font-serif text-3xl text-ink">按家庭需求找更合适的食材</h2>
            </div>
            <p className="text-sm text-ink/55">当前共 {filteredProducts.length} 款可浏览</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="grid gap-2 text-sm text-ink/65">
              搜索商品、农场或产地
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-moss"
                placeholder="例如：叶菜、黑河、儿童友好"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("全部");
                }}
                className="cta-secondary w-full sm:w-auto"
              >
                重置筛选
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {categoryOptions.map((category) => {
              const active = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active ? "bg-ink text-white" : "border border-ink/10 bg-white text-ink/70 hover:border-moss/35 hover:text-moss"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="panel bg-earth-glow p-6">
          <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">shopping note</p>
          <h3 className="mt-3 font-serif text-3xl text-ink">比起冲动下单，更适合先建立家里的固定清单</h3>
          <div className="mt-5 space-y-3">
            <div className="rounded-[22px] bg-white/85 p-4 text-sm leading-7 text-ink/72">
              先选一到两款高频复购食材，例如叶菜、主粮或乳品，观察家庭实际消耗速度。
            </div>
            <div className="rounded-[22px] bg-white/85 p-4 text-sm leading-7 text-ink/72">
              再看来源农场与检测报告，长期稳定比“今天刚好便宜”更重要。
            </div>
          </div>
        </aside>
      </div>

      {isFiltering ? (
        filteredProducts.length ? (
          <div className="space-y-5">
            <div className="rounded-[28px] border border-[#e6ead8] bg-[#f7f8f0] px-5 py-4 text-sm text-ink/65">
              当前正在浏览
              <span className="mx-2 rounded-full bg-white px-3 py-1 text-[#5a843d] shadow-sm">
                {activeCategory === "全部" ? "全部商品" : activeCategory}
              </span>
              {normalizedQuery ? `，关键词“${query}”` : ""}
            </div>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  farm={farms[product.farmId]?.farm || farms[product.farmId]}
                  report={farms[product.farmId]?.report}
                />
              ))}
            </div>
          </div>
        ) : (
        <div className="panel p-8 sm:p-10">
          <p className="text-xs tracking-[0.18em] text-ink/45 uppercase">no result</p>
          <h3 className="mt-3 text-2xl font-medium text-ink">这组条件下还没有找到合适商品</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/68">
            你可以换个关键词，或先回到“全部”分类重新浏览。后续也可以通过加入会员表单告诉我们你更关注的食材类型。
          </p>
        </div>
        )
      ) : (
        <div className="space-y-8">
          {groupedProducts.map(({ category, items }) => {
            const meta = sectionMeta[category] || {
              icon: "田",
              subtitle: "Selected",
              description: "会员精选食材分区。",
              accent: "bg-[linear-gradient(135deg,#f3f1df,#eef3e8)]",
              tagline: "会员精选分区"
            };

            return (
              <section key={category} className="space-y-5">
                <div className={`rounded-[30px] border border-[#e6ead8] px-5 py-5 shadow-[0_18px_40px_rgba(64,88,46,0.06)] sm:px-6 ${meta.accent}`}>
                  <div className="grid gap-5 lg:grid-cols-[0.55fr_1fr] lg:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#dce8bf] text-3xl font-serif text-[#5d8b40] shadow-sm">
                        {meta.icon}
                      </div>
                      <div>
                        <h3 className="text-4xl font-semibold tracking-[0.08em] text-[#4f7d37]">{category}</h3>
                        <p className="mt-1 text-lg text-[#7ca165]">{meta.subtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-[#56753f]">{meta.tagline}</p>
                      <p className="text-sm leading-7 text-[#5f6f58]">{meta.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      farm={farms[product.farmId]?.farm || farms[product.farmId]}
                      report={farms[product.farmId]?.report}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
