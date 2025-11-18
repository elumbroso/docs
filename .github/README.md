# 🎨 Figma Sync Automation

> Automatically sync Figma screenshots and design specifications to your MDX documentation

## 📂 Directory Structure

This directory contains the complete GitHub Actions workflow for automating Figma documentation sync.

```
.github/
├── workflows/
│   └── sync-figma.yml                  Main workflow definition
├── scripts/
│   ├── sync-figma.js                   Core sync logic
│   ├── test-sync.js                    Local testing utility
│   └── figma-sync.config.js             Configuration template
├── QUICKSTART.md                        5-minute setup guide ⭐ START HERE
├── DEPLOYMENT_GUIDE.md                 Complete deployment guide
├── FIGMA_SYNC_README.md                 Full feature documentation
├── SECRETS_SETUP.md                     GitHub Secrets configuration
├── TROUBLESHOOTING.md                   Diagnostic checklist
├── IMPLEMENTATION_COMPLETE.md           Implementation overview
├── EXAMPLE_COMPONENT.mdx                Example usage
├── verify-deployment.sh                 Deployment verification
└── README.md                            This file
```

## 🚀 Quick Start

**New to this? Start here:** [`QUICKSTART.md`](./QUICKSTART.md)

**Just want to deploy?** [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

## 📖 Documentation Index

| Document | Purpose |
|----------|---------|
| **QUICKSTART.md** | ⭐ Start here - 5 minute setup |
| **DEPLOYMENT_GUIDE.md** | Complete deployment checklist |
| **FIGMA_SYNC_README.md** | Full feature & usage documentation |
| **SECRETS_SETUP.md** | Configure GitHub Secrets |
| **TROUBLESHOOTING.md** | Debug and fix issues |
| **EXAMPLE_COMPONENT.mdx** | See working example |
| **IMPLEMENTATION_COMPLETE.md** | What was created overview |

## ⚡ Getting Started

### 1. Add Figma Token (2 min)

```bash
# GitHub → Settings → Secrets and variables → Actions
# Create secret named: FIGMA_API_TOKEN
# Value: (your Figma personal access token)
```

See [`SECRETS_SETUP.md`](./SECRETS_SETUP.md) for detailed instructions.

### 2. Mark Your Frames (1 min)

Add this to your `.mdx` files:

```mdx
<!-- figma-frame: YOUR_FILE_ID/YOUR_NODE_ID -->
```

See [`EXAMPLE_COMPONENT.mdx`](./EXAMPLE_COMPONENT.mdx) for details.

### 3. Run Workflow (1 min)

**GitHub → Actions → Sync Figma Screenshots and Specs → Run workflow**

## 🎯 What It Does

```
Every Monday at 9 AM UTC (or manually):
  1. Scan all .mdx files
  2. Find <!-- figma-frame: FILE_ID/NODE_ID --> comments
  3. Export 2x PNG screenshots from Figma
  4. Extract colors, typography, dimensions
  5. Update .mdx files with new specifications
  6. Create PR with all changes (or skip if no changes)
```

## 📦 Files Overview

### Workflow File
- **`workflows/sync-figma.yml`** - GitHub Actions workflow
  - Scheduled: Monday 9 AM UTC
  - Manual trigger: `workflow_dispatch`
  - Permissions: `contents:write`, `pull-requests:write`

### Scripts
- **`scripts/sync-figma.js`** - Main synchronization logic
  - 400+ lines of Node.js code
  - No external dependencies
  - Optimized API calls

- **`scripts/test-sync.js`** - Local testing utility
  - Verify configuration
  - Test without running workflow

- **`scripts/figma-sync.config.js`** - Configuration template
  - Future customization options
  - Documented settings

### Documentation (Choose by Your Need)

**Need quick setup?**
→ Read [`QUICKSTART.md`](./QUICKSTART.md) (10 min)

**Need complete overview?**
→ Read [`FIGMA_SYNC_README.md`](./FIGMA_SYNC_README.md) (20 min)

**Need to set up secrets?**
→ Read [`SECRETS_SETUP.md`](./SECRETS_SETUP.md) (15 min)

**Something not working?**
→ Read [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) (varies)

**Want to see example?**
→ Read [`EXAMPLE_COMPONENT.mdx`](./EXAMPLE_COMPONENT.mdx) (5 min)

**Need deployment checklist?**
→ Read [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) (10 min)

## ✨ Features

✅ Automated screenshot export (2x PNG)
✅ Design specification extraction
✅ MDX file auto-update
✅ Smart change detection
✅ Automatic PR creation
✅ Scheduled or manual triggers
✅ Comprehensive error handling
✅ Extensive documentation

## 🔧 Customization

### Change Schedule
Edit `workflows/sync-figma.yml`:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Monday 9 AM
```

### Change Export Scale
Edit `scripts/sync-figma.js`:
```javascript
await exportFrame(fileId, nodeId, 2);  // 1-4x scale
```

### Add PR Labels
Edit `workflows/sync-figma.yml`:
```yaml
labels: 'chore,figma-sync,my-label'
```

See [`FIGMA_SYNC_README.md`](./FIGMA_SYNC_README.md#configuration-options) for more options.

## 🧪 Testing Locally

```bash
# Verify configuration
export FIGMA_API_TOKEN=your_token
node scripts/test-sync.js
```

Expected output:
```
✓ FIGMA_API_TOKEN found
Found X file(s) with Figma references:
Configuration looks good! ✓
```

## ✅ Pre-Deployment Verification

```bash
# Run verification script
bash verify-deployment.sh
```

Expected output:
```
✓ All checks passed! Ready for deployment.
```

## 🚀 Deployment Steps

1. **Commit files to repository**
   ```bash
   git add .github/ package.json
   git commit -m "feat: add Figma sync workflow"
   git push origin main
   ```

2. **Add GitHub Secret**
   - Settings → Secrets → New repository secret
   - Name: `FIGMA_API_TOKEN`
   - Value: Your Figma personal access token

3. **Test workflow**
   - Actions → Sync Figma Screenshots and Specs → Run workflow

4. **Add Figma references**
   - Add `<!-- figma-frame: FILE_ID/NODE_ID -->` to `.mdx` files

5. **Run again** and review PR

## 📋 Typical Usage

### First Time Setup
1. Read [`QUICKSTART.md`](./QUICKSTART.md)
2. Add `FIGMA_API_TOKEN` to GitHub Secrets
3. Add Figma frame comment to one `.mdx` file
4. Run workflow manually
5. Review and merge PR

### Ongoing Use
1. Add Figma frame comments to new `.mdx` files
2. Workflow runs automatically every Monday
3. Review and merge PR when changes detected
4. Repeat as you add more components

## 🐛 Troubleshooting

### Common Issues

**Workflow not starting**
- Check Actions are enabled in Settings
- Verify workflow file exists in `.github/workflows/`
- Check YAML syntax is valid

**Frames not detected**
- Verify comment format: `<!-- figma-frame: FILE_ID/NODE_ID -->`
- Check FILE_ID and NODE_ID are correct
- Run `node scripts/test-sync.js` locally

**API errors**
- Verify `FIGMA_API_TOKEN` secret is added
- Check token has "File read" scope
- Verify token hasn't been revoked

See [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) for complete diagnostic guide.

## 📚 Learning Resources

### Figma API
- [Figma API Documentation](https://www.figma.com/developers/api)
- [Personal Access Tokens](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)

### GitHub Actions
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

### Tools & Helpers
- [Cron Syntax Reference](https://crontab.guru/)
- [YAML Validator](https://yamllint.com/)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## 🤝 Contributing

This workflow is set up for your documentation. You can:

- Customize the schedule
- Add more Figma frames
- Extend the extraction logic
- Add new documentation sections

See [`FIGMA_SYNC_README.md`](./FIGMA_SYNC_README.md#future-enhancements) for ideas.

## 📞 Support

1. **Need setup help?** → [`QUICKSTART.md`](./QUICKSTART.md)
2. **Something broken?** → [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)
3. **Have a question?** → Check the relevant doc above
4. **Want to know more?** → [`FIGMA_SYNC_README.md`](./FIGMA_SYNC_README.md)

## 📄 License

This workflow is part of your documentation repository and follows the same license as your project.

## 📝 Changelog

### November 18, 2025 - Initial Release
- Complete GitHub Actions workflow
- Node.js sync script
- Comprehensive documentation
- Troubleshooting guides
- Example implementation
- Deployment verification

---

## 🎯 Next Steps

1. **Read** [`QUICKSTART.md`](./QUICKSTART.md) (⭐ Start here)
2. **Add** `FIGMA_API_TOKEN` to GitHub Secrets
3. **Mark** your first Figma frame in an `.mdx` file
4. **Run** the workflow from Actions tab
5. **Review** the generated PR
6. **Merge** and celebrate! 🎉

---

**Questions?** Check the appropriate guide above or create an issue in your repository.

**Ready to get started?** → Open [`QUICKSTART.md`](./QUICKSTART.md) now!
