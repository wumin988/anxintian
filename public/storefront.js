(function bootstrapStorefront() {
  const API_BASE =
    window.location.protocol === 'file:' ? 'http://127.0.0.1:4000/api' : '/api';

  const money = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0
  });

  let toastTimer;

  const fileLink = (path) => {
    if (window.location.protocol === 'file:') {
      return `./${path}`;
    }
    return `/${path}`;
  };

  const statusEl = () => document.getElementById('status-message');

  const showStatus = (message, isError = false) => {
    const element = statusEl();
    if (!element) return;
    element.textContent = message;
    element.classList.add('active');
    element.style.background = isError ? 'rgba(95, 41, 33, 0.96)' : 'rgba(41, 54, 28, 0.94)';
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      element.classList.remove('active');
    }, 2400);
  };

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.error || '请求失败');
    }
    return body;
  };

  const formatCurrency = (amount) => money.format(amount);

  const escapeHtml = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  const productArtMarkup = (product, variant = 'card') => {
    if (product.image) {
      return `
        <div class="media-photo media-photo-${variant}">
          <img
            src="${escapeHtml(product.image)}"
            alt="${escapeHtml(product.name)} 商品图"
            loading="lazy"
            referrerpolicy="no-referrer"
          >
        </div>
      `;
    }

    return `
      <div class="produce-illustration produce-illustration-${variant}" style="background:${escapeHtml(product.visual)};">
        <span class="produce-shape produce-leaf"></span>
        <span class="produce-shape produce-leaf-alt"></span>
        <span class="produce-shape produce-fruit"></span>
        <span class="produce-shape produce-box"></span>
      </div>
    `;
  };

  const refreshCartCount = async () => {
    try {
      const { summary } = await api('/cart');
      document.querySelectorAll('[data-cart-count]').forEach((node) => {
        node.textContent = String(summary.count || 0);
      });
      return summary;
    } catch (error) {
      document.querySelectorAll('[data-cart-count]').forEach((node) => {
        node.textContent = '0';
      });
      return { count: 0, subtotal: 0, shipping: 0, discount: 0, total: 0 };
    }
  };

  const addToCart = async (productId, size, quantity = 1) => {
    const payload = await api('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, size, quantity })
    });
    await refreshCartCount();
    return payload;
  };

  const productCardMarkup = (product) => `
    <article class="product-card">
      <div class="product-visual">
        <span class="product-badge">${escapeHtml(product.badge)}</span>
        ${productArtMarkup(product, 'card')}
      </div>
      <div class="product-copy">
        <div class="product-title-row">
          <h3>${escapeHtml(product.name)}</h3>
          <span class="product-price">${formatCurrency(product.price)}</span>
        </div>
        <span class="product-meta">${escapeHtml(product.category)}</span>
        <p class="product-desc">${escapeHtml(product.description)}</p>
        <div class="size-row">
          ${product.availableSizes.map((size) => `<span>${escapeHtml(size)}</span>`).join('')}
        </div>
        <div class="product-bottom-row">
          <span class="rating">★ ${product.rating} · ${product.reviews} 条评价</span>
          <span class="subtle">库存 ${product.inventoryTotal}</span>
        </div>
        <div class="card-actions">
          <a class="outline-button" href="${fileLink(`product.html?id=${product.id}`)}">查看详情</a>
          <button class="add-cart" type="button" data-add-product="${product.id}">快速加入</button>
        </div>
      </div>
    </article>
  `;

  window.Storefront = {
    api,
    addToCart,
    fileLink,
    formatCurrency,
    productArtMarkup,
    productCardMarkup,
    refreshCartCount,
    showStatus
  };
})();
