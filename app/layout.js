import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "安心田 | 可信有机食材会员直供平台",
    template: "%s | 安心田"
  },
  description: "安心田是面向家庭健康饮食的有机食材会员直供平台，提供农场溯源、检测报告、会员价与定期配送服务。",
  keywords: ["安心田", "有机食品", "会员制", "农场溯源", "家庭健康食材", "有机食材直供"],
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
    title: "安心田 | 可信有机食材会员直供平台",
    description: "精选可信农场、公开检测与溯源信息，用会员制把家庭健康食材供应做得更稳定、更省心。",
    url: "http://localhost:3000",
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
    title: "安心田 | 可信有机食材会员直供平台",
    description: "精选可信农场、公开检测与溯源信息，用会员制把家庭健康食材供应做得更稳定、更省心。",
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
