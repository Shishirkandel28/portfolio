# 🚀 Complete GitHub Build and Deployment Guide

This guide will help you deploy your portfolio website to GitHub Pages with automatic builds.

## 📋 Prerequisites

1. **Git installed** on your laptop ([download here](https://git-scm.com))
2. **VS Code installed** ([download here](https://code.visualstudio.com))
3. **GitHub account** ([sign up here](https://github.com))

## 🎯 Step-by-Step Deployment Process

### Step 1: Download Your Project
1. In Replit, click **⋮ menu** → **"Download as zip"**
2. Extract to your Desktop/Documents
3. Rename folder to: `shishir-portfolio-website`

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click **"New repository"** (green button)
3. Repository name: `shishir-portfolio-website`
4. Make it **Public** ✅
5. **Don't** check "Add README"
6. Click **"Create repository"**

### Step 3: Upload Code to GitHub
1. Open **VS Code**
2. **File** → **Open Folder** → Select your project folder
3. **View** → **Terminal**
4. Run these commands one by one:

```bash
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shishir-portfolio-website.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your GitHub repository
2. Click **"Settings"** tab
3. Click **"Pages"** in left sidebar
4. Under **"Source"**, select **"GitHub Actions"**
5. Click **"Save"**

### Step 5: Automatic Deployment
The GitHub Actions workflow is already configured! It will:
- ✅ Build your website automatically
- ✅ Deploy to GitHub Pages
- ✅ Update your live site every time you push changes

## 🌍 Your Live Website

After deployment, your website will be available at:
```
https://YOUR_USERNAME.github.io/shishir-portfolio-website
```

## 🔄 Making Updates

To update your live website:
1. Make changes in VS Code
2. Save files
3. Run in terminal:
```bash
git add .
git commit -m "Updated portfolio"
git push
```
4. Your live site updates automatically in 2-3 minutes!

## ✅ Features Included

- **Automatic builds** - No manual work needed
- **Free hosting** - GitHub Pages is completely free
- **Custom domain support** - Add your own domain later
- **HTTPS enabled** - Secure by default
- **Mobile responsive** - Works on all devices

## 🎉 That's It!

Your professional portfolio website will be live on the internet with automatic updates whenever you make changes!

---

**Default Admin Login:**
- Email: shishirxkandel@gmail.com
- Password: password

**Note:** The admin features will work locally. For production admin features, you'll need to set up a database service like Neon.tech or Supabase.