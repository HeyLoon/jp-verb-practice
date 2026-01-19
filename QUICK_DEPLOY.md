# 快速部署指南

## 🚀 三步驟部署到 GitHub Pages

### 步驟 1: 創建 GitHub Repository

1. 前往 [GitHub](https://github.com/) 並登入
2. 點擊右上角的 **"+"** → **"New repository"**
3. 填寫資訊:
   - **Repository name**: `japanese-verb-drill` (或你喜歡的名稱)
   - **Description**: "日語動詞變化練習 Web App"
   - **Public** (必須是 public 才能使用免費的 GitHub Pages)
4. **不要** 勾選 "Initialize this repository with a README"
5. 點擊 **"Create repository"**

### 步驟 2: 推送程式碼

在專案目錄中執行:

```bash
# 初始化 Git (如果還沒有)
git init

# 添加所有檔案
git add .

# 提交
git commit -m "Initial commit: Japanese Verb Drill App"

# 設定主分支名稱
git branch -M main

# 連接到你的 GitHub repository (記得替換用戶名!)
git remote add origin https://github.com/你的GitHub用戶名/japanese-verb-drill.git

# 推送
git push -u origin main
```

### 步驟 3: 啟用 GitHub Pages

1. 前往你的 GitHub Repository 頁面
2. 點擊 **Settings** (設定)
3. 在左側選單找到 **Pages**
4. 在 **Build and deployment** 區域:
   - **Source**: 選擇 **GitHub Actions**
5. 完成! 🎉

### 等待部署完成

- 前往 Repository 的 **Actions** 標籤
- 你會看到一個正在運行的工作流 "Deploy to GitHub Pages"
- 等待它完成 (通常 2-3 分鐘)
- 完成後,你的應用將可在以下網址訪問:

```
https://你的GitHub用戶名.github.io/japanese-verb-drill/
```

## 🔄 更新應用

之後如果修改了程式碼,只需:

```bash
git add .
git commit -m "更新說明"
git push
```

GitHub Actions 會自動重新部署! 🚀

## ❓ 常見問題

### 無法訪問頁面?

1. 確認 Repository 是 **Public**
2. 確認在 Settings > Pages 中 Source 是 **GitHub Actions**
3. 檢查 Actions 標籤,確認部署成功
4. 等待幾分鐘讓 DNS 生效

### 頁面顯示 404?

檢查你的網址是否正確:
- ✅ 正確: `https://用戶名.github.io/repository名稱/`
- ❌ 錯誤: `https://用戶名.github.io` (缺少 repository 名稱)

### 樣式沒有載入?

1. 確認 `vite.config.js` 中的 `base` 設定正確
2. 目前設定是 `base: './'` (相對路徑),應該適用於大多數情況

## 🎉 完成!

現在你的日語動詞練習 App 已經上線了,可以分享給朋友一起學習! 📚🇯🇵
