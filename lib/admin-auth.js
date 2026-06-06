import { cookies } from "next/headers";

const cookieName = "anxintian_admin";

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(cookieName)?.value === "ok";
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(cookieName, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0
  });
}
