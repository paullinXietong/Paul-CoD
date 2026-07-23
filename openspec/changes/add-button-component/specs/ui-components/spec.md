## ADDED Requirements

### Requirement: 可复用按钮组件
系统 SHALL 提供一个可复用的按钮组件（`Button.vue`），用于在整个应用中提供一致的按钮交互体验。

#### Scenario: 基础按钮点击
- **WHEN** 用户点击按钮
- **THEN** 触发绑定的点击事件处理函数

#### Scenario: 主要按钮样式
- **WHEN** 按钮使用 `variant="primary"` 属性
- **THEN** 按钮显示为主要样式（背景色 #102D62，白色文字）

#### Scenario: 次要按钮样式
- **WHEN** 按钮使用 `variant="secondary"` 属性
- **THEN** 按钮显示为次要样式（边框样式，透明背景）

#### Scenario: 轮廓按钮样式
- **WHEN** 按钮使用 `variant="outline"` 属性
- **THEN** 按钮显示为轮廓样式（边框，无背景）

#### Scenario: 小尺寸按钮
- **WHEN** 按钮使用 `size="small"` 属性
- **THEN** 按钮显示为较小尺寸（较小的内边距和字体）

#### Scenario: 中等尺寸按钮
- **WHEN** 按钮使用 `size="medium"` 属性或未指定尺寸
- **THEN** 按钮显示为中等尺寸（默认内边距和字体）

#### Scenario: 大尺寸按钮
- **WHEN** 按钮使用 `size="large"` 属性
- **THEN** 按钮显示为较大尺寸（较大的内边距和字体）

#### Scenario: 禁用状态
- **WHEN** 按钮使用 `disabled` 属性
- **THEN** 按钮显示为禁用状态（灰色，不可点击，鼠标指针为 not-allowed）

#### Scenario: 加载状态
- **WHEN** 按钮使用 `loading` 属性
- **THEN** 按钮显示加载指示器，禁用点击，并显示加载文本（如果提供）

#### Scenario: 图标按钮
- **WHEN** 按钮使用 `icon` 属性提供图标
- **THEN** 图标显示在文本之前（如果同时提供文本）

#### Scenario: 仅图标按钮
- **WHEN** 按钮仅提供 `icon` 属性，无文本内容
- **THEN** 按钮显示为正方形，仅包含图标

#### Scenario: 完整类型支持
- **WHEN** 按钮使用 `type` 属性（button、submit、reset）
- **THEN** 按钮的 HTML type 属性设置为指定值，默认为 "button"












