"use client";

import { useState } from "react";

const interestOptions = ["时令蔬菜", "主粮", "乳品", "儿童友好", "轻食", "定期配送"];

const initialForm = {
  name: "",
  phone: "",
  city: "上海",
  familyType: "三口之家",
  interests: [],
  note: ""
};

export function JoinForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function toggleInterest(value) {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(value)
        ? current.interests.filter((item) => item !== value)
        : [...current.interests, value]
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "提交失败，请稍后再试。");
      }

      setForm(initialForm);
      setStatus("success");
      setMessage("预约信息已提交，我们会根据你的城市和家庭需求安排会员顾问联系。");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-5">
        <div className="rounded-[28px] border border-moss/15 bg-mist p-6 sm:p-8">
          <span className="eyebrow">request received</span>
          <h3 className="mt-4 font-serif text-3xl text-ink">预约信息已提交</h3>
          <p className="mt-4 text-sm leading-7 text-ink/72">{message}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] bg-white/90 p-4 text-sm leading-7 text-ink/72">
              我们会优先根据你填写的城市、家庭结构和关注品类进行回访。
            </div>
            <div className="rounded-[22px] bg-white/90 p-4 text-sm leading-7 text-ink/72">
              你也可以继续回到商品页和农场页，先看看当前已公开的精选内容。
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => { setStatus("idle"); setMessage(""); }} className="cta-primary">
            再提交一份
          </button>
          <a href="/products" className="cta-secondary">
            浏览商品
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-ink/70">
          姓名
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-moss"
            placeholder="请输入姓名"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink/70">
          手机号
          <input
            required
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-moss"
            placeholder="用于会员顾问联系"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-ink/70">
          所在城市
          <select
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-moss"
          >
            <option>上海</option>
            <option>杭州</option>
            <option>苏州</option>
            <option>深圳</option>
            <option>其他城市</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-ink/70">
          家庭结构
          <select
            value={form.familyType}
            onChange={(event) => setForm({ ...form, familyType: event.target.value })}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-moss"
          >
            <option>两口之家</option>
            <option>三口之家</option>
            <option>四口及以上</option>
            <option>有老人同住</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm text-ink/70">
        更关注的食材类型
        <div className="grid gap-3 sm:grid-cols-2">
          {interestOptions.map((item) => (
            <label key={item} className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/72">
              <input
                type="checkbox"
                checked={form.interests.includes(item)}
                onChange={() => toggleInterest(item)}
                className="h-4 w-4 rounded border-ink/20 text-moss focus:ring-moss"
              />
              {item}
            </label>
          ))}
        </div>
      </label>

      <label className="grid gap-2 text-sm text-ink/70">
        想告诉我们的需求
        <textarea
          rows="5"
          value={form.note}
          onChange={(event) => setForm({ ...form, note: event.target.value })}
          className="rounded-3xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-moss"
          placeholder="例如：家里有孩子，需要固定送奶；更关注控糖主粮；希望周末收货等"
        />
      </label>

      <button type="submit" disabled={status === "submitting"} className="cta-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60">
        {status === "submitting" ? "提交中..." : "提交预约信息"}
      </button>
      <p className={`text-sm leading-7 ${status === "error" ? "text-ember" : "text-ink/55"}`}>
        {message || "当前表单会保存到本地数据文件，后续可继续接入 CRM、短信或邮件系统。"}
      </p>
    </form>
  );
}
