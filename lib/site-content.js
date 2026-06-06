import { promises as fs } from "node:fs";
import path from "node:path";

const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");
const contentFile = path.join(dataDir, "content.json");
const joinRequestsFile = path.join(dataDir, "join-requests.json");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

async function writeJson(filePath, data) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getSiteContent() {
  return readJson(contentFile, {});
}

export async function saveSiteContent(content) {
  await writeJson(contentFile, content);
  return content;
}

export async function getJoinRequests() {
  return readJson(joinRequestsFile, []);
}

export async function createJoinRequest(payload) {
  const requests = await getJoinRequests();
  const item = {
    id: `join_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...payload
  };

  requests.unshift(item);
  await writeJson(joinRequestsFile, requests);

  return item;
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "anxintian2026";
}

export function getFarmById(content, farmId) {
  return content.farms?.find((farm) => farm.id === farmId);
}

export function getReportById(content, reportId) {
  return content.reports?.find((report) => report.id === reportId);
}

export function getProductBySlug(content, slug) {
  return content.products?.find((product) => product.slug === slug);
}
