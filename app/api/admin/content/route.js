import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";

async function ensureAdmin() {
  const ok = await isAdminAuthenticated();

  if (!ok) {
    return NextResponse.json({ error: "请先登录后台。" }, { status: 401 });
  }

  return null;
}

export async function GET() {
  const denied = await ensureAdmin();
  if (denied) return denied;

  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  const body = await request.json();
  const requiredKeys = ["products", "farms", "reports", "membershipPlans", "trustModules"];

  for (const key of requiredKeys) {
    if (!Array.isArray(body[key])) {
      return NextResponse.json({ error: `缺少 ${key} 数据。` }, { status: 400 });
    }
  }

  const saved = await saveSiteContent(body);
  return NextResponse.json(saved);
}
