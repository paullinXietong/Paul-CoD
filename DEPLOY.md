# 部署指南

## 打包

### 方式一：生成静态文件（推荐 - 适用于 SPA 模式）

运行以下命令生成包含 `index.html` 的静态文件：

```bash
npm run generate
```

或者：

```bash
nuxt generate
```

打包完成后，所有静态文件将生成在 `.output/public` 目录中，**包含 `index.html` 文件**。

### 方式二：标准构建

如果只需要构建代码（不生成静态 HTML）：

```bash
npm run build
```

**注意**：在 SPA 模式（`ssr: false`）下，`npm run build` 不会生成 `index.html` 文件。要生成静态的 `index.html` 文件，必须使用 `npm run generate`。

## 部署方式

### 方式一：使用静态文件服务器（推荐）

`.output/public` 目录包含了所有需要部署的静态文件，可以直接部署到任何静态文件服务器。

#### 1. 使用 Nginx 部署

将 `.output/public` 目录中的文件复制到 Nginx 的网站根目录（如 `/var/www/html` 或 `/usr/share/nginx/html`）。

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # SPA 路由支持 - 所有路由都返回 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /_nuxt/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 2. 使用 Apache 部署

将 `.output/public` 目录中的文件复制到 Apache 的网站根目录（如 `/var/www/html`）。

**Apache 配置示例（.htaccess）：**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# 静态资源缓存
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

#### 3. 使用 Node.js 静态服务器（开发/测试）

```bash
# 安装 serve
npm install -g serve

# 进入打包目录
cd .output/public

# 启动服务器
serve -s . -l 3000
```

### 方式二：使用 CDN/云存储部署

#### 1. Vercel 部署

1. 安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 在项目根目录创建 `vercel.json`：
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".output/public",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

3. 部署：
   ```bash
   vercel
   ```

#### 2. Netlify 部署

1. 在项目根目录创建 `netlify.toml`：
   ```toml
   [build]
     command = "npm run build"
     publish = ".output/public"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. 通过 Netlify 网站上传 `.output/public` 目录，或使用 Netlify CLI：
   ```bash
   npm install -g netlify-cli
   netlify deploy --dir=.output/public --prod
   ```

#### 3. GitHub Pages 部署

1. 将 `.output/public` 目录内容推送到 `gh-pages` 分支
2. 在 GitHub 仓库设置中启用 GitHub Pages

#### 4. 云存储服务（阿里云 OSS、腾讯云 COS、AWS S3 等）

将 `.output/public` 目录中的所有文件上传到云存储的静态网站托管服务。

## 部署步骤总结

1. **打包应用**（SPA 模式必须使用 generate）：
   ```bash
   npm run generate
   ```
   
   **重要**：对于 SPA 模式，必须使用 `generate` 命令而不是 `build` 命令，这样才能生成 `index.html` 文件。

2. **找到打包文件**：
   - 所有静态文件位于 `.output/public` 目录

3. **上传到服务器**：
   - 将 `.output/public` 目录中的所有文件上传到你的 Web 服务器

4. **配置服务器**：
   - 确保所有路由都返回 `index.html`（SPA 模式需要）
   - 配置静态资源缓存策略

5. **配置环境变量**（如需要）：
   - 如果需要修改 API 地址，可以在打包前设置环境变量：
     ```bash
     NUXT_PUBLIC_BASE_URL=https://api.example.com/api npm run build
     ```

## 注意事项

1. **路由配置**：SPA 应用需要服务器配置将所有路由重定向到 `index.html`，否则直接访问路由会返回 404。

2. **环境变量**：API 地址等配置在打包时已写入，如需更改需要重新打包。

3. **HTTPS**：生产环境建议使用 HTTPS，可以通过 Let's Encrypt 等免费证书服务获取。

4. **缓存策略**：
   - HTML 文件：不缓存或短时间缓存
   - `/_nuxt/` 目录下的资源：长时间缓存（已包含版本号）

