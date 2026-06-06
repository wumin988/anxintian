const storefront = window.Storefront;
const cartList = document.getElementById('cart-list');
const summaryList = document.getElementById('summary-list');
const checkoutForm = document.getElementById('checkout-form');
const orderResult = document.getElementById('order-result');
const authRequiredCard = document.getElementById('auth-required-card');

const TOKEN_KEY = 'tianlu_auth_token';
const USER_KEY = 'tianlu_auth_user';

const state = {
  cart: {
    items: [],
    summary: { count: 0, subtotal: 0, shipping: 0, discount: 0, total: 0 }
  },
  token: localStorage.getItem(TOKEN_KEY) || '',
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null')
};

const syncAuthUI = () => {
  const loggedIn = Boolean(state.token && state.user);
  if (authRequiredCard) {
    authRequiredCard.hidden = loggedIn;
  }

  if (checkoutForm) {
    const elements = Array.from(checkoutForm.elements);
    elements.forEach((element) => {
      if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        element.disabled = !loggedIn;
      }
    });
  }

  if (loggedIn && checkoutForm) {
    const nameField = checkoutForm.elements.namedItem('name');
    const phoneField = checkoutForm.elements.namedItem('phone');
    if (nameField && !nameField.value) {
      nameField.value = state.user.name || '';
    }
    if (phoneField && !phoneField.value) {
      phoneField.value = '';
    }
  }
};

const renderSummary = () => {
  const { summary } = state.cart;
  summaryList.innerHTML = `
    <div class="summary-row"><span>商品件数</span><strong>${summary.count}</strong></div>
    <div class="summary-row"><span>商品小计</span><strong>${storefront.formatCurrency(summary.subtotal)}</strong></div>
    <div class="summary-row"><span>配送费</span><strong>${summary.shipping ? storefront.formatCurrency(summary.shipping) : '免配送费'}</strong></div>
    <div class="summary-row"><span>优惠</span><strong>${summary.discount ? `-${storefront.formatCurrency(summary.discount)}` : '无'}</strong></div>
    <div class="summary-row total"><span>应付总额</span><strong>${storefront.formatCurrency(summary.total)}</strong></div>
  `;
};

const renderCart = () => {
  if (!state.cart.items.length) {
    cartList.innerHTML = `
      <article class="empty-state">
        购物车还是空的。先去首页挑几样当季商品，再回来结算。
      </article>
    `;
    renderSummary();
    return;
  }

  cartList.innerHTML = state.cart.items
    .map(
      (item) => `
        <article class="cart-item">
          <div class="cart-item-visual">
            ${storefront.productArtMarkup(item, 'cart')}
          </div>
          <div class="cart-item-copy">
            <div class="cart-item-head">
              <div>
                <span class="detail-tag">${item.category}</span>
                <h3>${item.name}</h3>
              </div>
              <strong>${storefront.formatCurrency(item.subtotal)}</strong>
            </div>
            <p class="subtle">${item.badge} · 规格 ${item.size} · 单价 ${storefront.formatCurrency(item.price)}</p>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button class="qty-button" type="button" data-qty-change="${item.id}" data-step="-1">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-button" type="button" data-qty-change="${item.id}" data-step="1">+</button>
              </div>
              <div class="summary-actions">
                <a class="outline-button" href="${storefront.fileLink(`product.html?id=${item.productId}`)}">查看详情</a>
                <button class="outline-button" type="button" data-remove-item="${item.id}">移除</button>
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  renderSummary();
};

const loadCart = async () => {
  state.cart = await storefront.api('/cart');
  renderCart();
  await storefront.refreshCartCount();
};

document.addEventListener('click', async (event) => {
  const qtyButton = event.target.closest('[data-qty-change]');
  if (qtyButton) {
    const item = state.cart.items.find((entry) => String(entry.id) === qtyButton.dataset.qtyChange);
    if (!item) return;
    const step = Number(qtyButton.dataset.step);
    const nextQuantity = item.quantity + step;
    if (nextQuantity <= 0) {
      await storefront.api(`/cart/${item.id}`, { method: 'DELETE' });
    } else {
      await storefront.api(`/cart/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: nextQuantity })
      });
    }
    await loadCart();
  }

  const removeButton = event.target.closest('[data-remove-item]');
  if (removeButton) {
    await storefront.api(`/cart/${removeButton.dataset.removeItem}`, { method: 'DELETE' });
    storefront.showStatus('商品已从购物车移除');
    await loadCart();
  }
});

checkoutForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.token || !state.user) {
    storefront.showStatus('请先登录账号再提交订单', true);
    window.location.href = storefront.fileLink('auth.html');
    return;
  }

  if (!state.cart.items.length) {
    storefront.showStatus('购物车为空，先添加一些商品吧', true);
    return;
  }

  const formData = new FormData(checkoutForm);
  const customer = Object.fromEntries(formData.entries());

  try {
    const { order } = await storefront.api('/orders', {
      method: 'POST',
      body: JSON.stringify({ customer })
    });

    orderResult.innerHTML = `
      <article class="order-confirmation">
        <span class="detail-tag">下单成功</span>
        <p>订单已经创建完成，分拣中心会按你的城市和预约信息安排配送。</p>
        <strong>${order.number}</strong>
        <div class="pill-row">
          <span class="pill">${order.status}</span>
          <span class="pill">${order.eta}</span>
          <span class="pill">${storefront.formatCurrency(order.summary.total)}</span>
        </div>
      </article>
    `;

    checkoutForm.reset();
    storefront.showStatus(`订单 ${order.number} 已创建`);
    await loadCart();
  } catch (error) {
    storefront.showStatus(error.message, true);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  syncAuthUI();
  try {
    await loadCart();
  } catch (error) {
    cartList.innerHTML = `<article class="empty-state">购物车加载失败：${error.message}</article>`;
  }
});
