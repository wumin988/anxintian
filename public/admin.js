const storefront = window.Storefront;

const form = document.getElementById('admin-product-form');
const productList = document.getElementById('admin-product-list');
const ordersList = document.getElementById('orders-list');
const productCount = document.getElementById('product-count');
const resetFormButton = document.getElementById('reset-form');
const cancelEditButton = document.getElementById('cancel-edit');
const submitButton = document.getElementById('submit-product');
const loginForm = document.getElementById('admin-login-form');
const loginCard = document.getElementById('login-card');
const loginPanel = document.getElementById('admin-login-panel');
const dashboard = document.getElementById('admin-dashboard');
const imageFileInput = document.getElementById('image-file');
const uploadImageButton = document.getElementById('upload-image-button');
const imagePreview = document.getElementById('image-preview');
const logoutButton = document.getElementById('logout-button');

const state = {
  products: [],
  orders: [],
  editingId: null,
  authenticated: false
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('读取图片失败'));
    reader.readAsDataURL(file);
  });

const setAuthUI = (authenticated) => {
  state.authenticated = authenticated;
  dashboard.hidden = !authenticated;
  loginCard.hidden = authenticated;
  loginPanel.hidden = authenticated;
};

const renderImagePreview = (url) => {
  imagePreview.innerHTML = url
    ? `<img src="${url}" alt="商品图预览" referrerpolicy="no-referrer">`
    : '<span class="subtle">上传后会在这里预览。</span>';
};

const formToPayload = () => {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  delete payload.productId;

  payload.price = Number(payload.price);
  payload.originalPrice = Number(payload.originalPrice);
  payload.rating = Number(payload.rating);
  payload.reviews = Number(payload.reviews);
  payload.featured = payload.featured === 'true';
  payload.details = payload.details
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  try {
    payload.inventory = JSON.parse(payload.inventory);
  } catch (error) {
    throw new Error('规格库存必须是合法 JSON，例如 {"轻享装":12,"家庭装":8}');
  }

  return payload;
};

const fillForm = (product) => {
  form.productId.value = product.id;
  form.name.value = product.name;
  form.category.value = product.category;
  form.price.value = product.price;
  form.originalPrice.value = product.originalPrice;
  form.badge.value = product.badge;
  form.rating.value = product.rating;
  form.reviews.value = product.reviews;
  form.featured.value = String(product.featured);
  form.accent.value = product.accent;
  form.visual.value = product.visual;
  form.image.value = product.image;
  renderImagePreview(product.image);
  form.description.value = product.description;
  form.story.value = product.story;
  form.details.value = product.details.join('\n');
  form.inventory.value = JSON.stringify(product.inventory, null, 2);
  state.editingId = product.id;
  submitButton.textContent = '保存修改';
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const resetForm = () => {
  form.reset();
  form.productId.value = '';
  form.category.value = '时令蔬菜箱';
  form.featured.value = 'true';
  form.rating.value = '4.8';
  form.reviews.value = '0';
  form.accent.value = '#7b9449';
  form.visual.value = 'linear-gradient(145deg, #fff9ee, #dce7c0 48%, #86ab4f 100%)';
  form.inventory.value = '{\n  "轻享装": 12,\n  "家庭装": 8\n}';
  form.details.value = '产地：上海崇明合作农场\n认证：批次有机认证可查\n建议：适合每周固定配送';
  imageFileInput.value = '';
  renderImagePreview('');
  state.editingId = null;
  submitButton.textContent = '发布商品';
};

const renderProducts = () => {
  productCount.textContent = `${state.products.length} 件商品`;
  productList.innerHTML = state.products
    .map(
      (product) => `
        <article class="admin-product-card">
          <div class="admin-product-photo">
            ${
              product.image
                ? `<img src="${product.image}" alt="${product.name} 商品图" referrerpolicy="no-referrer">`
                : `<div class="admin-product-fallback" style="background:${product.visual};"></div>`
            }
          </div>
          <div class="admin-product-copy">
            <div class="admin-product-head">
              <div>
                <span class="detail-tag">${product.category}</span>
                <h3>${product.name}</h3>
              </div>
              <strong>${storefront.formatCurrency(product.price)}</strong>
            </div>
            <p class="subtle">${product.badge} · 评分 ${product.rating} · 库存 ${product.inventoryTotal}</p>
            <p>${product.description}</p>
            <div class="pill-row">
              ${product.sizes.map((size) => `<span class="pill">${size}:${product.inventory[size]}</span>`).join('')}
            </div>
            <div class="summary-actions" style="margin-top:16px;">
              <button class="outline-button" type="button" data-edit-product="${product.id}">编辑</button>
              <button class="outline-button" type="button" data-delete-product="${product.id}">删除</button>
              <a class="outline-button" href="${storefront.fileLink(`product.html?id=${product.id}`)}">预览</a>
            </div>
          </div>
        </article>
      `
    )
    .join('');
};

const renderOrders = () => {
  if (!state.orders.length) {
    ordersList.innerHTML = '<article class="empty-state">暂时还没有订单。</article>';
    return;
  }

  ordersList.innerHTML = state.orders
    .slice(0, 6)
    .map(
      (order) => `
        <article class="admin-order-card">
          <div class="admin-order-head">
            <strong>${order.number}</strong>
            <span class="pill">${storefront.formatCurrency(order.summary.total)}</span>
          </div>
          <p class="subtle">${order.customer.name} · ${order.customer.city} · ${order.status}</p>
          <p class="subtle">${order.items.map((item) => `${item.name} x${item.quantity}`).join(' / ')}</p>
        </article>
      `
    )
    .join('');
};

const loadData = async () => {
  const [{ products }, { orders }] = await Promise.all([
    storefront.api('/products'),
    storefront.api('/orders')
  ]);
  state.products = products;
  state.orders = orders;
  renderProducts();
  renderOrders();
};

const ensureSession = async () => {
  const { authenticated } = await storefront.api('/admin/session');
  setAuthUI(authenticated);
  if (authenticated) {
    await loadData();
  }
};

document.addEventListener('click', async (event) => {
  const editButton = event.target.closest('[data-edit-product]');
  if (editButton) {
    const product = state.products.find((item) => String(item.id) === editButton.dataset.editProduct);
    if (product) fillForm(product);
  }

  const deleteButton = event.target.closest('[data-delete-product]');
  if (deleteButton) {
    const product = state.products.find((item) => String(item.id) === deleteButton.dataset.deleteProduct);
    if (!product) return;
    const confirmed = window.confirm(`确认删除商品「${product.name}」吗？`);
    if (!confirmed) return;

    try {
      await storefront.api(`/products/${product.id}`, { method: 'DELETE' });
      storefront.showStatus(`已删除 ${product.name}`);
      resetForm();
      await loadData();
    } catch (error) {
      storefront.showStatus(error.message, true);
    }
  }
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const payload = formToPayload();
    if (state.editingId) {
      await storefront.api(`/products/${state.editingId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      storefront.showStatus('商品已更新');
    } else {
      await storefront.api('/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      storefront.showStatus('商品已发布');
    }
    resetForm();
    await loadData();
  } catch (error) {
    storefront.showStatus(error.message, true);
  }
});

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  try {
    await storefront.api('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password: formData.get('password') })
    });
    storefront.showStatus('后台登录成功');
    loginForm.reset();
    await ensureSession();
  } catch (error) {
    storefront.showStatus(error.message, true);
  }
});

uploadImageButton?.addEventListener('click', async () => {
  const file = imageFileInput.files?.[0];
  if (!file) {
    storefront.showStatus('先选择图片再上传', true);
    return;
  }

  try {
    const dataUrl = await fileToDataUrl(file);
    const { imageUrl } = await storefront.api('/admin/upload', {
      method: 'POST',
      body: JSON.stringify({
        filename: file.name,
        dataUrl
      })
    });
    form.image.value = new URL(imageUrl, window.location.origin).toString();
    renderImagePreview(form.image.value);
    storefront.showStatus('图片上传成功');
  } catch (error) {
    storefront.showStatus(error.message, true);
  }
});

form?.elements.image?.addEventListener('input', (event) => {
  renderImagePreview(event.target.value.trim());
});

logoutButton?.addEventListener('click', async () => {
  await storefront.api('/admin/logout', { method: 'POST' });
  setAuthUI(false);
  storefront.showStatus('已退出后台');
});

resetFormButton?.addEventListener('click', resetForm);
cancelEditButton?.addEventListener('click', resetForm);

document.addEventListener('DOMContentLoaded', async () => {
  resetForm();
  await storefront.refreshCartCount();
  try {
    await ensureSession();
  } catch (error) {
    storefront.showStatus(`后台加载失败：${error.message}`, true);
  }
});
