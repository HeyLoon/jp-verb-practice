# 部署到 GitHub Pages

## 📋 部署步驟

### 1. 創建 GitHub Repository

```bash
cd japanese-verb-drill
git init
git add .
git commit -m "Initial commit: Japanese Verb Drill App"
git branch -M main
git remote add origin https://github.com/你的用戶名/japanese-verb-drill.git
git push -u origin main
```

### 2. 啟用 GitHub Pages

1. 進入你的 GitHub Repository
2. 點擊 **Settings** (設定)
3. 在左側選單找到 **Pages**
4. 在 **Source** 下拉選單中選擇 **GitHub Actions**

### 3. 自動部署

一旦完成上述設定,每次你推送到 `main` 分支時:
- GitHub Actions 會自動觸發
- 使用 Bun 安裝依賴和構建專案
- 自動部署到 GitHub Pages

### 4. 訪問你的應用

部署完成後,你的應用將可以在以下網址訪問:

```
https://你的用戶名.github.io/japanese-verb-drill/
```

## 🔧 本地測試構建

在推送到 GitHub 之前,你可以在本地測試構建:

```bash
# 構建生產版本
bun run build

# 預覽構建結果
bun run preview
```

## 📝 工作流說明

`.github/workflows/deploy.yml` 文件包含自動部署配置:

- **觸發條件**: 推送到 `main` 分支或手動觸發
- **構建工具**: Bun
- **部署目標**: GitHub Pages
- **構建產物**: `dist` 目錄

## 🚨 注意事項

### 如果使用自定義域名

修改 `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // 自定義域名使用根路徑
})
```

### 如果 Repository 名稱不是 japanese-verb-drill

修改 `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/你的repository名稱/', // 注意前後的斜線
})
```

目前設定使用相對路徑 `'./'`,適用於大多數情況。

## 🔍 故障排除

### 部署失敗

1. 檢查 GitHub Actions 日誌
2. 確認 Pages 設定為 **GitHub Actions** 模式
3. 確認 Repository 有正確的權限設定

### 頁面無法正常顯示

1. 檢查瀏覽器控制台是否有資源載入錯誤
2. 確認 `vite.config.js` 的 `base` 設定正確
3. 嘗試硬性重新整理頁面 (Ctrl + Shift + R)

### 手動觸發部署

在 GitHub Repository 頁面:
1. 點擊 **Actions** 標籤
2. 選擇 **Deploy to GitHub Pages** 工作流
3. 點擊 **Run workflow** 按鈕

## 📚 更多資訊

- [GitHub Pages 文檔](https://docs.github.com/pages)
- [GitHub Actions 文檔](https://docs.github.com/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
