import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  metadataBase: new URL("https://anxintian.vercel.app"),
  title: {
    default: "安心田 | 家庭食品信任平台",
    template: "%s | 安心田"
  },
  description: "安心田以农场审核、批次检测和会员直供为核心，为有孩子和重视长期饮食安全的家庭提供更值得信任的食材选择。",
  keywords: ["安心田", "家庭食品信任平台", "有机食品", "农场溯源", "批次检测", "会员直供", "家庭健康食材"],
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    apple: "/apple-touch-icon.svg"
  },
  openGraph: {
    title: "安心田 | 家庭食品信任平台",
    description: "先看农场、再看检测、最后再决定是否长期放进家里。安心田把家庭餐桌真正需要的信任信息放在食材前面。",
    url: "https://anxintian.vercel.app",
    siteName: "安心田",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "安心田官网分享图"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "安心田 | 家庭食品信任平台",
    description: "先看农场、再看检测、最后再决定是否长期放进家里。",
    images: ["/og-cover.svg"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
