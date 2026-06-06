import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/admin-auth";
import { getAdminPassword } from "@/lib/site-content";

export async function POST(request) {
  const body = await request.json();
  const password = String(body.password || "");

  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "后台密码不正确。" }, { status: 401 });
  }

  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
