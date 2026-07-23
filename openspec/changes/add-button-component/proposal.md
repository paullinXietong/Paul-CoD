# Change: 添加按钮组件功能

## Why
项目当前缺少一个可复用的按钮组件。现有的按钮都是内联实现，导致样式和行为不一致，难以维护。创建一个标准化的按钮组件可以提高代码复用性、保持 UI 一致性，并简化后续的样式和功能更新。

## What Changes
- 创建可复用的 `Button.vue` 组件，支持多种变体（primary、secondary、outline 等）
- 支持不同尺寸（small、medium、large）
- 支持加载状态和禁用状态
- 支持图标和文本组合
- 遵循项目的 Tailwind CSS 样式约定
- 在现有页面中逐步替换内联按钮实现
- **新增**：在导航栏添加登录按钮，未登录用户可见，点击跳转到登录页

## Impact
- **新增能力**：
  - UI 组件系统（`ui-components` capability）
  - 导航功能（`navigation` capability）
- **受影响代码**：
  - `components/Button.vue`（新建）
  - `components/NavBar.vue`（使用新组件替换搜索按钮，添加登录按钮）
  - 其他使用内联按钮的页面（可选：逐步迁移）

