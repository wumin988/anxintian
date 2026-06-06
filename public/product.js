const storefront = window.Storefront;
const detailRoot = document.getElementById('detail-root');
const recommendGrid = document.getElementById('recommend-grid');

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const state = {
  product: null,
  selectedSize: ''
};

const renderRecommendations = async () => {
  const { products } = await storefront.api('/products');
  const recommendations = products
    .filter((item) => item.id !== state.product.id && item.category === state.product.category)
    .slice(0, 3);

  recommendGrid.innerHTML = recommendations.map((product) => storefront.productCardMarkup(product)).join('');
};

const renderDetail = () => {
  const product = state.product;
  detailRoot.innerHTML = `
    <article class="detail-panel">
      <div class="detail-visual">
        <span class="product-badge">${product.badge}</span>
        ${storefront.productArtMarkup(product, 'detail')}
      </div>
    </article>
    <article class="detail-panel">
      <div class="detail-copy">
        <span class="detail-tag">${product.category}</span>
        <h1>${product.name}</h1>
        <p>${product.story}</p>
        <div class="price-stack">
          <span class="detail-price">${storefront.formatCurrency(product.price)}</span>
          <span class="price-old">${storefront.formatCurrency(product.originalPrice)}</span>
          <span class="rating">★ ${product.rating} · ${product.reviews} 条评价</span>
        </div>
        <div class="detail-meta">
          <p>${product.description}</p>
          <div>
            <strong>选择规格</strong>
            <div class="size-selector" id="size-selector">
              ${product.sizes
                .map(
                  (size) => `
                    <button
                      class="size-chip ${size === state.selectedSize ? 'active' : ''}"
                      type="button"
                      data-size="${size}"
                      ${product.availableSizes.includes(size) ? '' : 'disabled'}
                    >
                      ${size}
                    </button>
                  `
                )
                .join('')}
            </div>
          </div>
          <div class="detail-actions">
            <button class="primary-button" type="button" id="detail-add-cart">加入购物车</button>
            <a class="secondary-button" href="${storefront.fileLink('cart.html')}">去结算</a>
          </div>
          <div class="detail-grid">
            <article class="detail-stat">
              <strong>${product.availableSizes.length} 个规格可选</strong>
              <span class="subtle">支持家庭份量和订阅节奏搭配</span>
            </article>
            <article class="detail-stat">
              <strong>本地冷链配送</strong>
              <span class="subtle">重点城市支持次日达或预约时段</span>
            </article>
          </div>
          <div class="detail-note">
            <strong>溯源与亮点</strong>
            <ul class="detail-list">
              ${product.details.map((detail) => `<li>${detail}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </article>
  `;
};

document.addEventListener('click', async (event) => {
  const sizeButton = event.target.closest('[data-size]');
  if (sizeButton) {
    state.selectedSize = sizeButton.dataset.size;
    renderDetail();
  }

  const addButton = event.target.closest('#detail-add-cart');
  if (addButton) {
    try {
      await storefront.addToCart(state.product.id, state.selectedSize, 1);
      storefront.showStatus(`${state.product.name} ${state.selectedSize} 已加入购物车`);
    } catch (error) {
      storefront.showStatus(error.message, true);
    }
  }

  const quickAdd = event.target.closest('[data-add-product]');
  if (quickAdd) {
    try {
      const { product } = await storefront.api(`/products/${quickAdd.dataset.addProduct}`);
      await storefront.addToCart(product.id, product.availableSizes[0], 1);
      storefront.showStatus(`${product.name} 已加入购物车`);
    } catch (error) {
      storefront.showStatus(error.message, true);
    }
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  if (!productId) {
    detailRoot.innerHTML = '<article class="empty-state">缺少商品 id，暂时无法展示详情。</article>';
    return;
  }

  try {
    const { product } = await storefront.api(`/products/${productId}`);
    state.product = product;
    state.selectedSize = product.availableSizes[0] || product.sizes[0];
    renderDetail();
    await renderRecommendations();
    await storefront.refreshCartCount();
  } catch (error) {
    detailRoot.innerHTML = `<article class="empty-state">商品加载失败：${error.message}</article>`;
  }
});
