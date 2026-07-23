## ADDED Requirements

### Requirement: 导航栏登录按钮
导航栏 SHALL 在用户未登录时显示登录按钮，点击后跳转到登录页面。

#### Scenario: 未登录用户看到登录按钮
- **WHEN** 用户未登录（localStorage 中不存在 'TOKEN'）
- **THEN** 导航栏显示登录按钮

#### Scenario: 已登录用户不显示登录按钮
- **WHEN** 用户已登录（localStorage 中存在 'TOKEN'）
- **THEN** 导航栏不显示登录按钮

#### Scenario: 点击登录按钮跳转
- **WHEN** 未登录用户点击登录按钮
- **THEN** 页面跳转到配置的登录 URL（从 runtimeConfig.public.loginUrl 获取）

#### Scenario: 登录按钮使用 Button 组件
- **WHEN** 登录按钮被渲染
- **THEN** 使用 Button 组件实现，样式为 primary 变体

#### Scenario: 登录状态实时更新
- **WHEN** 用户在未登录和已登录状态之间切换
- **THEN** 登录按钮的显示/隐藏状态实时更新（响应式）












