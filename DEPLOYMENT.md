# 🚀 Deployment Guide - GitHub Pages

This guide will help you upload your project to GitHub and deploy it to GitHub Pages.

## Step 1: Configure Git (if not already done)

First, set your Git identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it `Cinque` (or any name you prefer)
5. Make it **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

## Step 3: Update Vite Config (if repository name is different)

If your repository name is NOT "Cinque", update `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

Replace `YOUR_REPO_NAME` with your actual repository name.

## Step 4: Push to GitHub

Run these commands in your terminal (replace `YOUR_USERNAME` with your GitHub username):

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/Cinque.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 5: Enable GitHub Pages

### Option A: Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that will automatically deploy on every push to `main`.

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically run and deploy your site

### Option B: Manual Deployment

If you prefer manual deployment:

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**

**Note:** For manual deployment, you'll need to:
- Build the project: `pnpm build`
- Commit the `dist` folder (not recommended, but possible)

## Step 6: Access Your Site

Once deployed, your site will be available at:
```
https://YOUR_USERNAME.github.io/Cinque/
```

Replace `YOUR_USERNAME` with your GitHub username and `Cinque` with your repository name.

## 🔄 Updating Your Site

Every time you push changes to the `main` branch, GitHub Actions will automatically rebuild and redeploy your site (if using Option A).

Just run:
```bash
git add .
git commit -m "Your commit message"
git push
```

## ⚠️ Important Notes

- The first deployment may take a few minutes
- Make sure your repository is **Public** for free GitHub Pages
- The base path in `vite.config.ts` must match your repository name
- GitHub Actions may need to be enabled in your repository settings

## 🐛 Troubleshooting

### Site shows 404
- Check that the base path in `vite.config.ts` matches your repository name
- Ensure GitHub Pages is enabled in repository settings
- Wait a few minutes for the first deployment

### Build fails
- Check the Actions tab in your repository for error messages
- Ensure all dependencies are in `package.json`
- Make sure `pnpm-lock.yaml` is committed

### Changes not appearing
- Clear your browser cache
- Check that the GitHub Actions workflow completed successfully
- Verify you pushed to the `main` branch

