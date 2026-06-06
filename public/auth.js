const storefront = window.Storefront;

const AUTH_API_BASE = 'http://127.0.0.1:5000/api/users';
const TOKEN_KEY = 'tianlu_auth_token';
const USER_KEY = 'tianlu_auth_user';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutButton = document.getElementById('logout-button');
const authUserCard = document.getElementById('auth-user-card');

const state = {
  activeTab: 'login',
  token: localStorage.getItem(TOKEN_KEY) || '',
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null')
};

const authTabs = Array.from(document.querySelectorAll('[data-auth-tab]'));

const saveAuthState = (token, user) => {
  state.token = token || '';
  state.user = user || null;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

const setTab = (tab) => {
  state.activeTab = tab;
  authTabs.forEach((button) => {
    button.classList.toggle('active', button.dataset.authTab === tab);
  });
  loginForm.hidden = tab !== 'login';
  registerForm.hidden = tab !== 'register';
};

const membershipLabel = (value) => {
  const map = {
    free: '免费会员',
    seasonal: '季卡会员',
    halfyear: '半年卡会员',
    yearly: '年卡会员'
  };
  return map[value] || value;
};

const renderUserCard = () => {
  if (!state.user) {
    authUserCard.innerHTML =
      '<article class="empty-state">还没有登录。登录后这里会显示用户信息和会员等级。</article>';
    return;
  }

  authUserCard.innerHTML = `
    <article class="profile-card">
      <div class="profile-avatar">${String(state.user.name || '用').slice(0, 1)}</div>
      <div class="profile-copy">
        <h3>${state.user.name}</h3>
        <p>${state.user.email}</p>
        <div class="pill-row">
          <span class="pill">${membershipLabel(state.user.membershipType)}</span>
          <span class="pill">已登录</span>
        </div>
      </div>
    </article>
    <article class="auth-token-card">
      <strong>JWT Token</strong>
      <p>${state.token ? '已获取并保存在本地浏览器。' : '当前没有 token。'}</p>
      ${
        state.token
          ? `<pre class="token-preview">${state.token}</pre>`
          : ''
      }
    </article>
  `;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${AUTH_API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
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

const refreshProfile = async () => {
  if (!state.token) {
    renderUserCard();
    return;
  }

  try {
    const { user } = await request('/me');
    saveAuthState(state.token, user);
  } catch (error) {
    saveAuthState('', null);
    storefront.showStatus(error.message, true);
  }

  renderUserCard();
};

document.addEventListener('click', (event) => {
  const tabButton = event.target.closest('[data-auth-tab]');
  if (tabButton) {
    setTab(tabButton.dataset.authTab);
  }
});

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const { token, user } = await request('/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    saveAuthState(token, user);
    renderUserCard();
    storefront.showStatus('登录成功');
  } catch (error) {
    storefront.showStatus(error.message, true);
  }
});

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    await request('/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const { token, user } = await request('/login', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password
      })
    });

    saveAuthState(token, user);
    renderUserCard();
    registerForm.reset();
    setTab('login');
    storefront.showStatus('注册并登录成功');
  } catch (error) {
    storefront.showStatus(error.message, true);
  }
});

logoutButton?.addEventListener('click', () => {
  saveAuthState('', null);
  renderUserCard();
  storefront.showStatus('已退出登录');
});

document.addEventListener('DOMContentLoaded', async () => {
  setTab(state.activeTab);
  renderUserCard();
  await storefront.refreshCartCount();
  await refreshProfile();
});
