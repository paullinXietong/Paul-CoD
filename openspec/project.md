# Project Context

## Purpose
Codropshipping 是一个基于 Nuxt 3 的代发货（dropshipping）电商平台，允许用户搜索、浏览和购买来自1688等平台的产品。项目提供产品搜索、分类浏览、产品详情、购物车、订单管理等核心电商功能，支持游客模式和用户登录模式。

## Tech Stack
- **Nuxt 3.13.2** - Vue 3 全栈框架，启用 SSR
- **TypeScript** - 类型安全
- **Vue 3** - 前端框架（通过 Nuxt）
- **Pinia 2.2.6** - 状态管理
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Axios 1.7.7** - HTTP 客户端
- **VueUse 11.1.0** - Vue 组合式工具库
- **Swiper 9.4.1** - 轮播图组件

## Project Conventions

### Code Style
- 使用 **Composition API** 和 `<script setup>` 语法
- 使用 **TypeScript** 进行类型定义（虽然部分代码使用 `any`，建议逐步改进）
- 使用 **Tailwind CSS** 进行样式设计，允许内联样式和 Tailwind 类混合使用
- 组件文件使用 **PascalCase** 命名（如 `NavBar.vue`）
- 服务文件使用 **camelCase** 命名（如 `api.ts`）
- 使用 `@/` 别名引用 `assets` 目录
- 使用 `~/` 别名引用项目根目录

### Architecture Patterns
- **文件系统路由**：使用 Nuxt 3 的约定式路由，页面文件位于 `pages/` 目录
- **服务层模式**：所有 API 调用集中在 `services/api.ts` 中管理
- **中间件模式**：使用全局中间件（`middleware/tourist.global.ts`）处理游客 token 自动生成
- **布局系统**：使用 `layouts/default.vue` 提供统一的页面布局（包含 NavBar 和 FooterBar）
- **组件化开发**：可复用组件放在 `components/` 目录
- **运行时配置**：使用 `nuxt.config.ts` 的 `runtimeConfig` 管理环境变量和 API 端点

### Testing Strategy
- 目前项目尚未配置测试框架
- 建议添加单元测试和 E2E 测试（可考虑 Vitest + Playwright）

### Git Workflow
- 待补充（建议使用 Git Flow 或 GitHub Flow）

## Domain Context
- **代发货业务**：平台连接供应商（如1688）和买家，提供产品搜索、价格转换、物流计算等功能
- **游客模式**：未登录用户自动生成游客 token，存储在 localStorage 中
- **汇率转换**：产品价格需要根据实时汇率转换为美元（USD）显示
- **多数据源**：支持从不同平台（1688、商城等）获取产品数据
- **分类系统**：产品按分类组织，支持多级分类和翻译名称
- **特殊区域商品**：支持按区域展示特殊商品列表（Top Deals、Top Ranking、Top Arrivals）

## Important Constraints
- **SSR 要求**：项目启用 SSR，需要注意客户端和服务端代码兼容性（使用 `process.client` 检查）
- **Token 管理**：用户 token 和游客 token 存储在 localStorage，需要在客户端环境访问
- **API 超时**：Axios 请求超时时间设置为 30 秒
- **环境变量**：通过 `NUXT_PUBLIC_*` 前缀的环境变量配置 API 端点
- **HMR 端口**：Vite HMR 使用自定义端口 24680

## External Dependencies
- **API 服务**：
  - `baseUrl`: 主 API 服务（默认：`https://test-codrop.cargosoon.online/api`）
  - `orderUrl`: 订单管理服务（默认：`https://test-codrop.cargosoon.online/admin/order`）
  - `loginUrl`: 登录服务（默认：`https://test-codrop.cargosoon.online/admin/login`）
  - `mallBaseUrl`: 商城 API 服务（默认：`https://cc.cargosoon.online`）
- **WebSocket 服务**：
  - `wssUrl`: WebSocket 连接（默认：`wss://testchat.cargosoon.online/wss`）
- **第三方服务**：
  - 1688 阿里巴巴平台（产品数据源）
  - Google Fonts（Inter 字体）
  - 外部重量查询服务（`https://gsa.bi.gobizdev.com/item/get_weight`）
