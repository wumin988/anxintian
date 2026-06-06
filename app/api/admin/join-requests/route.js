import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getJoinRequests } from "@/lib/site-content";

export async function GET() {
  const ok = await isAdminAuthenticated();

  if (!ok) {
    return NextResponse.json({ error: "请先登录后台。" }, { status: 401 });
  }

  const items = await getJoinRequests();
  return NextResponse.json({ items });
}
