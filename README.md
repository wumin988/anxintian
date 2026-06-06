# 天鹿良食商城

这是一个面向用户端的有机购物平台原型，核心模式是农场直连、自营选品、本地化配送和会员订阅。项目包含用户前台、商品详情、购物车结算、后台管理，以及一个配套的 Chrome 小助手。

## 项目定位

- 主打有机农产品、生态水果、健康轻食和家庭常备食材
- 每个商品支持产地、农场信息、认证说明和规格库存展示
- 支持季卡、半年卡、年卡等订阅型叙事，适合绑定每周配送
- 强调本地冷链、灵活送达和拼单等履约体验
- 通过食谱、生活资讯和农场活动强化社区感

## 本地启动

1. 安装 Node.js 22 或更高版本
2. 在项目目录运行 `npm start`
3. 打开 `http://localhost:4000` 或 `http://127.0.0.1:4000`

默认端口是 `4000`。如果需要自定义端口，可以使用 `PORT=5000 npm start`。

## 页面与能力

- `/`：用户端首页，展示品牌故事、会员订阅、商品列表、配送计划和社区内容
- `/product.html?id=<id>`：商品详情页，展示溯源亮点、规格库存和推荐商品
- `/cart.html`：购物车与结算页
- `/admin.html`：后台管理页，可登录后新增、编辑、删除商品并查看订单
- `/api/*`：Node.js 提供的商品、购物车、订单和后台接口

## 数据与存储

- 默认种子数据位于 [src/store.json](/Users/wumin/Documents/New%20project/src/store.json)
- SQLite 数据文件默认写入 `src/tianlu-goodfood.sqlite`
- 如果设置了 `DATA_DIR`，数据库和上传图片会写入对应目录

首次启动会自动初始化商品、配送内容和社区内容。

## 后台登录

- 默认后台密码：`tianlugoodfood123`
- 生产环境建议通过环境变量 `ADMIN_PASSWORD` 覆盖

## 部署

项目带有 [render.yaml](/Users/wumin/Documents/New%20project/render.yaml) 示例配置，可直接部署到 Render：

- Web 服务名：`tianlu-goodfood`
- 持久化数据盘：`tianlu-goodfood-data`
- 健康检查：`/healthz`

## Chrome 小助手

[chrome-extension](/Users/wumin/Documents/New%20project/chrome-extension) 目录提供一个配套扩展，用于快速打开商城页面、查看商品与订单接口概览、复制常用链接。
