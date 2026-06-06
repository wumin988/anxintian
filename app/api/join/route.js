import { NextResponse } from "next/server";
import { createJoinRequest } from "@/lib/site-content";

function isValidPhone(phone) {
  return /^(\+?\d[\d\s-]{6,})$/.test(String(phone || "").trim());
}

export async function POST(request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const city = String(body.city || "").trim();
  const familyType = String(body.familyType || "").trim();
  const interests = Array.isArray(body.interests) ? body.interests.map((item) => String(item)) : [];
  const note = String(body.note || "").trim();

  if (!name) {
    return NextResponse.json({ error: "请填写姓名。" }, { status: 400 });
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "请填写正确的手机号或联系电话。" }, { status: 400 });
  }

  if (!city) {
    return NextResponse.json({ error: "请选择所在城市。" }, { status: 400 });
  }

  const item = await createJoinRequest({
    name,
    phone,
    city,
    familyType,
    interests,
    note
  });

  return NextResponse.json({ ok: true, item });
}
