# 🔧 GitHub Pages Setup Checklist

## Step 1: Enable GitHub Pages
1. Go to: https://github.com/Networkzz/Cinque/settings/pages
2. Under **"Source"**, select **"GitHub Actions"** (NOT "Deploy from a branch")
3. Click **"Save"**

## Step 2: Check Workflow Status
1. Go to: https://github.com/Networkzz/Cinque/actions
2. Look for "Deploy to GitHub Pages" workflow
3. If it shows a yellow dot (in progress) or red X (failed), click on it to see details
4. If there's no workflow run, you may need to trigger it manually

## Step 3: Manually Trigger Workflow (if needed)
1. Go to: https://github.com/Networkzz/Cinque/actions
2. Click on "Deploy to GitHub Pages" in the left sidebar
3. Click "Run workflow" button (top right)
4. Select "main" branch
5. Click "Run workflow"

## Step 4: Wait for Deployment
- The workflow takes 1-2 minutes to complete
- You'll see a green checkmark when it's done
- Your site will be available at: https://Networkzz.github.io/Cinque/

## Troubleshooting

### If workflow fails:
- Check the error message in the Actions tab
- Common issues:
  - Missing dependencies (should be fixed with pnpm-lock.yaml)
  - Build errors (check the build step logs)

### If site shows 404:
- Wait 5-10 minutes after workflow completes (DNS propagation)
- Clear browser cache
- Try incognito/private mode
- Verify the base path in vite.config.ts matches repository name

### If workflow doesn't appear:
- Make sure GitHub Pages is set to "GitHub Actions" source
- Check that the .github/workflows/deploy.yml file exists in your repository

