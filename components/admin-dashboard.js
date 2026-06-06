"use client";

import { useEffect, useMemo, useState } from "react";

function SectionCard({ title, description, action, children }) {
  return (
    <section className="panel p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-ink/65">{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function AdminDashboard() {
  const [auth, setAuth] = useState("checking");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState(null);
  const [savedContent, setSavedContent] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestQuery, setRequestQuery] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("");

  async function loadData() {
    const contentResponse = await fetch("/api/admin/content", { cache: "no-store" });

    if (contentResponse.status === 401) {
      setAuth("logged_out");
      return;
    }

    const contentData = await contentResponse.json();
    setContent(contentData);
    setSavedContent(contentData);
    setAuth("logged_in");

    const requestsResponse = await fetch("/api/admin/join-requests", { cache: "no-store" });
    const requestsData = await requestsResponse.json();
    setRequests(requestsData.items || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setMessage("");
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [message]);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error || "登录失败");
      return;
    }

    setPassword("");
    await loadData();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth("logged_out");
    setContent(null);
  }

  async function saveContent(nextContent = content, successMessage = "内容已保存，刷新前台后会看到最新版本。") {
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nextContent)
    });

    const payload = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(payload.error || "保存失败");
      return;
    }

    setContent(payload);
    setSavedContent(payload);
    setHasUnsavedChanges(false);
    setLastSavedAt(new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }));
    setMessage(successMessage);
  }

  async function handleSave() {
    await saveContent(content);
  }

  async function handleSectionSave(sectionName) {
    await saveContent(content, `${sectionName}已保存，前台刷新后会看到最新版本。`);
  }

  function updateProduct(index, key, value) {
    setContent((current) => {
      const next = structuredClone(current);
      next.products[index][key] = value;
      return next;
    });
    setHasUnsavedChanges(true);
  }

  function updateFarm(index, key, value) {
    setContent((current) => {
      const next = structuredClone(current);
      next.farms[index][key] = value;
      return next;
    });
    setHasUnsavedChanges(true);
  }

  function updateReport(index, key, value) {
    setContent((current) => {
      const next = structuredClone(current);
      next.reports[index][key] = value;
      return next;
    });
    setHasUnsavedChanges(true);
  }

  function isFieldChanged(section, index, key) {
    if (!savedContent || !content) {
      return false;
    }

    return savedContent[section]?.[index]?.[key] !== content[section]?.[index]?.[key];
  }

  function fieldClass(changed) {
    return `rounded-2xl border bg-white px-4 py-3 outline-none transition ${
      changed
        ? "border-amber-400 ring-2 ring-amber-100"
        : "border-ink/10 focus:border-moss"
    }`;
  }

  function textareaClass(changed) {
    return `rounded-3xl border bg-white px-4 py-3 outline-none transition ${
      changed
        ? "border-amber-400 ring-2 ring-amber-100"
        : "border-ink/10 focus:border-moss"
    }`;
  }

  const filteredRequests = useMemo(() => {
    const query = requestQuery.trim().toLowerCase();
    if (!query) {
      return requests;
    }

    return requests.filter((item) =>
      [item.name, item.phone, item.city, item.familyType, item.note, ...(item.interests || [])]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [requests, requestQuery]);

  function exportRequests() {
    const rows = [
      ["提交时间", "姓名", "手机号", "城市", "家庭结构", "关注方向", "需求备注"],
      ...filteredRequests.map((item) => [
        new Date(item.createdAt).toLocaleString("zh-CN"),
        item.name,
        item.phone,
        item.city,
        item.familyType,
        (item.interests || []).join("、"),
        item.note || ""
      ])
    ];

    const csv = "\uFEFF" + rows.map((row) => row.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "anxintian-join-requests.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (auth === "checking") {
    return <div className="panel p-8 text-sm text-ink/65">正在检查后台权限...</div>;
  }

  if (auth !== "logged_in") {
    return (
      <div className="panel mx-auto max-w-xl p-8">
        <h1 className="font-serif text-3xl text-ink">后台登录</h1>
        <p className="mt-3 text-sm leading-7 text-ink/65">默认密码为 `anxintian2026`，可通过环境变量 `ADMIN_PASSWORD` 覆盖。</p>
        <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-moss"
            placeholder="请输入后台密码"
          />
          <button type="submit" className="cta-primary">登录后台</button>
          <p className="text-sm text-ember">{message}</p>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink">安心田后台内容台</h1>
          <p className="mt-2 text-sm leading-7 text-ink/65">直接修改前台的商品、农场和检测报告内容，也能查看预约会员提交记录。</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={handleSave} disabled={saving} className="cta-primary disabled:opacity-60">
            {saving ? "保存中..." : "保存全部内容"}
          </button>
          <button type="button" onClick={handleLogout} className="cta-secondary">
            退出登录
          </button>
        </div>
      </div>

      {message ? <div className="rounded-2xl bg-mist px-4 py-3 text-sm text-ink/75">{message}</div> : null}

      <SectionCard
        title="商品配置"
        description="当前支持快速修改商品名称、分类、价格和摘要说明，适合官网 MVP 快速更新。"
        action={
          <button type="button" onClick={() => handleSectionSave("商品配置")} disabled={saving} className="cta-secondary disabled:opacity-60">
            保存本模块
          </button>
        }
      >
        <div className="grid gap-5">
          {content.products.map((product, index) => (
            <div key={product.id} className="rounded-[28px] border border-ink/8 bg-oat/80 p-5">
              <div className="grid gap-4 lg:grid-cols-4">
                <label className="grid gap-2 text-sm text-ink/70">
                  商品名称
                  <input value={product.name} onChange={(event) => updateProduct(index, "name", event.target.value)} className={fieldClass(isFieldChanged("products", index, "name"))} />
                </label>
                <label className="grid gap-2 text-sm text-ink/70">
                  分类
                  <input value={product.category} onChange={(event) => updateProduct(index, "category", event.target.value)} className={fieldClass(isFieldChanged("products", index, "category"))} />
                </label>
                <label className="grid gap-2 text-sm text-ink/70">
                  日常价
                  <input value={product.price} onChange={(event) => updateProduct(index, "price", Number(event.target.value))} className={fieldClass(isFieldChanged("products", index, "price"))} />
                </label>
                <label className="grid gap-2 text-sm text-ink/70">
                  会员价
                  <input value={product.memberPrice} onChange={(event) => updateProduct(index, "memberPrice", Number(event.target.value))} className={fieldClass(isFieldChanged("products", index, "memberPrice"))} />
                </label>
              </div>
              <label className="mt-4 grid gap-2 text-sm text-ink/70">
                商品图片链接
                <input value={product.image || ""} onChange={(event) => updateProduct(index, "image", event.target.value)} className={fieldClass(isFieldChanged("products", index, "image"))} />
              </label>
              <label className="mt-4 grid gap-2 text-sm text-ink/70">
                摘要说明
                <textarea rows="3" value={product.desc} onChange={(event) => updateProduct(index, "desc", event.target.value)} className={textareaClass(isFieldChanged("products", index, "desc"))} />
              </label>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="农场配置"
        description="可更新农场名称、产地、核心品类和农场故事。"
        action={
          <button type="button" onClick={() => handleSectionSave("农场配置")} disabled={saving} className="cta-secondary disabled:opacity-60">
            保存本模块
          </button>
        }
      >
        <div className="grid gap-5">
          {content.farms.map((farm, index) => (
            <div key={farm.id} className="rounded-[28px] border border-ink/8 bg-oat/80 p-5">
              <div className="grid gap-4 lg:grid-cols-3">
                <label className="grid gap-2 text-sm text-ink/70">
                  农场名称
                  <input value={farm.name} onChange={(event) => updateFarm(index, "name", event.target.value)} className={fieldClass(isFieldChanged("farms", index, "name"))} />
                </label>
                <label className="grid gap-2 text-sm text-ink/70">
                  产地
                  <input value={farm.location} onChange={(event) => updateFarm(index, "location", event.target.value)} className={fieldClass(isFieldChanged("farms", index, "location"))} />
                </label>
                <label className="grid gap-2 text-sm text-ink/70">
                  核心品类
                  <input value={farm.specialty} onChange={(event) => updateFarm(index, "specialty", event.target.value)} className={fieldClass(isFieldChanged("farms", index, "specialty"))} />
                </label>
              </div>
              <label className="mt-4 grid gap-2 text-sm text-ink/70">
                农场故事
                <textarea rows="4" value={farm.story} onChange={(event) => updateFarm(index, "story", event.target.value)} className={textareaClass(isFieldChanged("farms", index, "story"))} />
              </label>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="检测报告配置"
        description="可更新检测标题、摘要和附件链接。当前附件支持本地 SVG、图片或 PDF 地址。"
        action={
          <button type="button" onClick={() => handleSectionSave("检测报告配置")} disabled={saving} className="cta-secondary disabled:opacity-60">
            保存本模块
          </button>
        }
      >
        <div className="grid gap-5">
          {content.reports.map((report, index) => (
            <div key={report.id} className="rounded-[28px] border border-ink/8 bg-oat/80 p-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="grid gap-2 text-sm text-ink/70">
                  报告标题
                  <input value={report.title} onChange={(event) => updateReport(index, "title", event.target.value)} className={fieldClass(isFieldChanged("reports", index, "title"))} />
                </label>
                <label className="grid gap-2 text-sm text-ink/70">
                  附件链接
                  <input value={report.attachmentUrl} onChange={(event) => updateReport(index, "attachmentUrl", event.target.value)} className={fieldClass(isFieldChanged("reports", index, "attachmentUrl"))} />
                </label>
              </div>
              <label className="mt-4 grid gap-2 text-sm text-ink/70">
                摘要说明
                <textarea rows="3" value={report.summary} onChange={(event) => updateReport(index, "summary", event.target.value)} className={textareaClass(isFieldChanged("reports", index, "summary"))} />
              </label>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="预约记录" description="这里展示前台预约加入会员表单的真实提交内容。">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <input
            value={requestQuery}
            onChange={(event) => setRequestQuery(event.target.value)}
            placeholder="搜索姓名、手机号、城市、需求"
            className="w-full max-w-md rounded-full border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-moss"
          />
          <button type="button" onClick={exportRequests} className="cta-secondary">
            导出当前结果
          </button>
        </div>
        <div className="grid gap-4">
          {filteredRequests.length === 0 ? (
            <div className="rounded-[24px] bg-mist px-4 py-5 text-sm text-ink/65">目前还没有新的预约申请。</div>
          ) : (
            filteredRequests.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-ink/8 bg-white px-5 py-4 text-sm text-ink/72">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-base font-medium text-ink">{item.name} · {item.phone}</p>
                  <p className="text-xs text-ink/45">{new Date(item.createdAt).toLocaleString("zh-CN")}</p>
                </div>
                <p className="mt-2">城市：{item.city} · 家庭结构：{item.familyType}</p>
                <p className="mt-2">关注方向：{(item.interests || []).join("、") || "未填写"}</p>
                <p className="mt-2">需求备注：{item.note || "无"}</p>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <div className="pointer-events-none sticky bottom-4 z-40 flex justify-center">
        <div className="pointer-events-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 rounded-full border border-ink/10 bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(34,49,39,0.16)] backdrop-blur">
          <div className="flex items-center gap-3 text-sm text-ink/70">
            <span className={`h-2.5 w-2.5 rounded-full ${hasUnsavedChanges ? "bg-amber-500" : "bg-moss"}`} />
            <span>{hasUnsavedChanges ? "有未保存改动" : "当前内容已保存"}</span>
            {lastSavedAt ? <span className="text-ink/45">上次保存 {lastSavedAt}</span> : null}
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleSave} disabled={saving || !hasUnsavedChanges} className="cta-primary disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "保存中..." : "保存全部内容"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
