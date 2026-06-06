const storefront = window.Storefront;

const state = {
  activeFilter: '全部',
  query: '',
  products: [],
  drops: [],
  looks: []
};

const categoryItems = [
  {
    label: '一周鲜配',
    filter: '全部',
    summary: '适合第一次下单，直接浏览本周全部内容。'
  },
  {
    label: '叶菜与蔬菜箱',
    filter: '时令蔬菜箱',
    summary: '围绕高频做饭家庭的日常补给。'
  },
  {
    label: '水果与亲子常备',
    filter: '生态水果',
    summary: '更偏向零食、早餐和家庭分享场景。'
  },
  {
    label: '轻食与厨房补给',
    filter: '健康轻食',
    summary: '适合备餐、早餐和工作日快速补给。'
  },
  {
    label: '长期囤货',
    filter: '有机常备',
    summary: '适合减少补货频率的家庭常备内容。'
  }
];

const searchInput = document.getElementById('search-input');
const categoryGrid = document.getElementById('category-grid');
const signatureLayout = document.getElementById('signature-layout');
const productGrid = document.getElementById('product-grid');
const dropsGrid = document.getElementById('drops-grid');
const communityGrid = document.getElementById('community-grid');
const heroNote = document.getElementById('hero-note');
const heroAside = document.getElementById('hero-aside');

const visibleProducts = () => {
  const query = state.query.trim().toLowerCase();
  return state.products.filter((product) => {
    const matchesFilter = state.activeFilter === '全部' || product.category === state.activeFilter;
    const matchesQuery =
      !query ||
      [product.name, product.category, product.description, product.story, product.badge]
        .join(' ')
        .toLowerCase()
        .includes(query);
    return matchesFilter && matchesQuery;
  });
};

const updateMetrics = () => {
  const categoryCount = new Set(state.products.map((product) => product.category)).size;
  const metrics = {
    '[data-metric-products]': `${state.products.length}+`,
    '[data-metric-categories]': `${categoryCount} 类`,
    '[data-metric-drops]': `${state.drops.length} 段`
  };

  Object.entries(metrics).forEach(([selector, value]) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  });
};

const renderHero = () => {
  const firstProduct = state.products[0];
  const firstDrop = state.drops[0];
  if (heroNote && firstProduct) {
    heroNote.innerHTML = `
      <span>本周主推</span>
      <strong>${firstProduct.name}</strong>
      <p>${firstProduct.story}</p>
    `;
  }

  if (heroAside && firstDrop) {
    heroAside.innerHTML = `
      <span>${firstDrop.tag}</span>
      <strong>${firstDrop.title}</strong>
      <p>${firstDrop.text}</p>
    `;
  }
};

const renderCategories = () => {
  categoryGrid.innerHTML = categoryItems
    .map(
      (item, index) => `
        <button
          type="button"
          class="farm-category-card ${item.filter === state.activeFilter ? 'active' : ''}"
          data-filter="${item.filter}"
        >
          <span class="farm-category-index">0${index + 1}</span>
          <h3>${item.label}</h3>
          <p>${item.summary}</p>
        </button>
      `
    )
    .join('');
};

const renderSignature = () => {
  const [lead, second, third, fourth] = state.products;
  if (!lead) {
    signatureLayout.innerHTML = '';
    return;
  }

  signatureLayout.innerHTML = `
    <article class="farm-feature-main">
      <div class="farm-feature-visual" style="background:${lead.visual};">
        ${storefront.productArtMarkup(lead, 'card')}
      </div>
      <div class="farm-feature-copy">
        <span class="farm-pill">${lead.badge}</span>
        <h3>${lead.name}</h3>
        <p>${lead.description}</p>
        <div class="farm-feature-meta">
          <strong>${storefront.formatCurrency(lead.price)}</strong>
          <span>适合规格：${lead.availableSizes.join(' / ')}</span>
        </div>
        <div class="farm-feature-actions">
          <a class="farm-secondary-button" href="${storefront.fileLink(`product.html?id=${lead.id}`)}">看详情</a>
          <button class="farm-primary-button action-button" type="button" data-add-product="${lead.id}">加入购物车</button>
        </div>
      </div>
    </article>
    <div class="farm-feature-side">
      ${[second, third, fourth]
        .filter(Boolean)
        .map(
          (product) => `
            <article class="farm-brief-card">
              <span class="farm-pill">${product.category}</span>
              <h3>${product.name}</h3>
              <p>${product.story}</p>
              <div class="farm-brief-footer">
                <strong>${storefront.formatCurrency(product.price)}</strong>
                <a href="${storefront.fileLink(`product.html?id=${product.id}`)}">查看</a>
              </div>
            </article>
          `
        )
        .join('')}
    </div>
  `;
};

const renderProducts = () => {
  const products = visibleProducts();
  if (!products.length) {
    productGrid.innerHTML = `
      <article class="empty-state">
        没找到符合条件的商品，试试切换入口或者换个关键词。
      </article>
    `;
    return;
  }

  productGrid.innerHTML = products
    .slice(0, 6)
    .map(
      (product) => `
        <article class="farm-product-card">
          <div class="farm-product-visual" style="background:${product.visual};">
            <span class="farm-pill">${product.badge}</span>
            ${storefront.productArtMarkup(product, 'card')}
          </div>
          <div class="farm-product-copy">
            <div class="farm-product-head">
              <h3>${product.name}</h3>
              <strong>${storefront.formatCurrency(product.price)}</strong>
            </div>
            <p>${product.description}</p>
            <div class="farm-product-tags">
              <span>${product.category}</span>
              <span>评分 ${product.rating}</span>
              <span>库存 ${product.inventoryTotal}</span>
            </div>
            <div class="farm-product-actions">
              <a class="farm-secondary-button" href="${storefront.fileLink(`product.html?id=${product.id}`)}">查看详情</a>
              <button class="farm-primary-button action-button" type="button" data-add-product="${product.id}">快速加入</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
};

const renderDrops = () => {
  dropsGrid.innerHTML = state.drops
    .map(
      (drop, index) => `
        <article class="farm-route-card">
          <span class="farm-route-index">0${index + 1}</span>
          <span class="farm-pill">${drop.tag}</span>
          <h3>${drop.title}</h3>
          <p>${drop.text}</p>
          <strong>${drop.date}</strong>
        </article>
      `
    )
    .join('');
};

const renderLooks = () => {
  communityGrid.innerHTML = state.looks
    .map(
      (look, index) => `
        <article class="farm-journal-card ${index === 0 ? 'feature' : ''}">
          <span class="farm-pill">${look.tag}</span>
          <h3>${look.title}</h3>
          <p>${look.text}</p>
        </article>
      `
    )
    .join('');
};

document.addEventListener('click', async (event) => {
  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) {
    state.activeFilter = filterButton.dataset.filter;
    renderCategories();
    renderProducts();
  }

  const addCartButton = event.target.closest('[data-add-product]');
  if (addCartButton) {
    const product = state.products.find((item) => String(item.id) === addCartButton.dataset.addProduct);
    if (!product) return;
    try {
      await storefront.addToCart(product.id, product.availableSizes[0], 1);
      storefront.showStatus(`${product.name} 已加入购物车`);
    } catch (error) {
      storefront.showStatus(error.message, true);
    }
  }
});

searchInput?.addEventListener('input', (event) => {
  state.query = event.target.value;
  renderProducts();
});

document.addEventListener('DOMContentLoaded', async () => {
  renderCategories();
  try {
    const [{ products }, { drops }, { looks }] = await Promise.all([
      storefront.api('/products'),
      storefront.api('/drops'),
      storefront.api('/looks')
    ]);
    state.products = products;
    state.drops = drops;
    state.looks = looks;

    updateMetrics();
    renderHero();
    renderSignature();
    renderProducts();
    renderDrops();
    renderLooks();
    await storefront.refreshCartCount();
  } catch (error) {
    storefront.showStatus(`页面加载失败：${error.message}`, true);
    productGrid.innerHTML = `
      <article class="empty-state">
        当前无法连接商城接口。请先启动本地服务，再通过浏览器打开首页。
      </article>
    `;
  }
});
