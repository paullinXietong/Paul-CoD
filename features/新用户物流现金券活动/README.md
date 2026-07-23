# 新用户物流现金券活动

这是一个可独立启停的新用户物流现金券弹窗模块。

## 包含内容

- `ShippingCouponPopup.vue`：活动弹窗、抽奖动画、访客频控和注册跳转。
- `config.ts`：活动编号、中奖概率、满减门槛和弹窗频率。
- `activity.json`：活动包名称和版本信息。

## 开启或关闭展示

活动默认开启。

关闭活动时，在 Nuxt 项目的 `.env` 文件加入：

```env
NUXT_PUBLIC_NEW_USER_SHIPPING_COUPON_ENABLED=false
```

重新启动网页服务后，首页将不加载也不展示活动弹窗。

重新开启时，将配置改为：

```env
NUXT_PUBLIC_NEW_USER_SHIPPING_COUPON_ENABLED=true
```

也可以删除这一行，默认仍为开启状态。修改开关后必须重新启动网页服务。

## 本地预览

活动开启后访问：

```text
http://127.0.0.1:8082/?couponPreview=1
```

`couponPreview=1` 只在本地开发环境跳过登录状态和展示频率限制，不会绕过活动总开关。

## 接入位置

- Nuxt 运行开关：`nuxt.config.ts`
- 首页按需加载：`pages/index.vue`
- 注册领取、优惠券资格和订单取消逻辑位于会员前端项目 `codropshipping-serve-master`

活动包关闭时只隐藏营销弹窗，不删除已领取优惠券，也不改变订单和优惠券后台规则。
