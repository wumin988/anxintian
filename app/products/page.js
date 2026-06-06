import { ProductCatalog } from "@/components/product-catalog";
import { SectionHeading } from "@/components/section-heading";
import { getFarmById, getReportById, getSiteContent } from "@/lib/site-content";

export const metadata = {
  title: "商品列表 | 安心田"
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const content = await getSiteContent();
  const categories = content.categories || [];
  const products = content.products || [];
  const farms = Object.fromEntries(
    (content.farms || []).map((farm) => [farm.id, { farm, report: getReportById(content, farm.reportId) }])
  );

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="product catalog"
          title="会员精选商品"
          description="先按家庭真实高频需求来选食材，再判断价格与配送。你可以按分类浏览，也可以直接搜索商品名、农场或产地。"
        />
        <ProductCatalog
          categories={categories}
          products={products}
          farms={Object.fromEntries(
            products.map((product) => [
              product.farmId,
              farms[product.farmId] || { farm: getFarmById(content, product.farmId), report: null }
            ])
          )}
        />
      </div>
    </section>
  );
}
