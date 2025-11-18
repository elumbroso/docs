# Figma Sync - Quick Start Guide

Get your Figma documentation sync up and running in 5 minutes!

## Step 1: Add Your Figma Token to GitHub Secrets (2 min)

### 1a. Generate a Figma Personal Access Token

1. Visit [Figma Settings](https://www.figma.com/settings/profile)
2. Scroll down to **Personal access tokens**
3. Click **Generate new token**
4. Enter a name: "GitHub Docs Sync"
5. Select scope: **File read** (or File read + write if needed)
6. Click **Generate token**
7. **Copy the token immediately** (you won't be able to see it again!)

### 1b. Add Token to GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIGMA_API_TOKEN`
5. Value: Paste your Figma token
6. Click **Add secret**

✓ Done! Your token is now secure.

## Step 2: Mark Your Figma Frames in Documentation (2 min)

### Find Your Figma Details

**File ID**: From your Figma file URL
```
https://www.figma.com/file/abc123def456/MyFile
                      ^^^^^^^^^^^^^^
```

**Node ID**: Select a frame/component in Figma
```
https://www.figma.com/file/abc123def456/MyFile?node-id=123:456
                                                        ^^^^^^^
```

### Add Comment to Your .mdx File

Add this HTML comment right after your frontmatter:

```mdx
---
title: My Component
---

<!-- figma-frame: FILE_ID/NODE_ID -->

## Overview

Your component description here...
```

**Example** with actual IDs:

```mdx
---
title: Button Component
---

<!-- figma-frame: h8Ugks6YufraLCbPxOkgxb/1-11 -->

## Overview

The Button component is a foundational element...
```

## Step 3: Test Locally (1 min)

Run the test script to verify everything is set up:

```bash
export FIGMA_API_TOKEN=your_actual_token
node .github/scripts/test-sync.js
```

You should see:
```
✓ FIGMA_API_TOKEN found

Found X file(s) with Figma references:

📄 path/to/your/file.mdx
   └─ <!-- figma-frame: FILE_ID/NODE_ID -->

Configuration looks good! ✓
```

## Step 4: Run the Workflow

### Option A: Manual Trigger (Immediate)

1. Go to **Actions** tab on GitHub
2. Click **Sync Figma Screenshots and Specs**
3. Click **Run workflow**
4. Select **main** branch
5. Click **Run workflow**

Workflow will start in a few seconds!

### Option B: Scheduled (Every Monday at 9 AM UTC)

The workflow runs automatically every Monday at 9 AM UTC. No setup needed!

## Step 5: Review the Pull Request

When the workflow completes:

1. Check the **Pull requests** tab
2. Look for PR titled "chore: sync Figma updates"
3. Review the changes
4. Merge the PR

Your documentation now has:
- ✓ Fresh Figma screenshots
- ✓ Updated design specifications
- ✓ Colors, typography, and dimensions

## What Happens

```
Your .mdx file:
  ├─ Before: Just has <!-- figma-frame: FILE_ID/NODE_ID -->
  └─ After: Has screenshot + extracted specifications

Generated files:
  └─ figma-screenshots/NODE_ID-@2x.png
     (2x scale, high quality retina image)

Updated .mdx content:
  ├─ Size information
  ├─ Colors (fill & stroke) in HEX format
  ├─ Typography details
  └─ All formatted as markdown tables
```

## Common Tasks

### Change the Schedule

Edit `.github/workflows/sync-figma.yml`:

```yaml
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9 AM UTC
```

Options:
- `'0 9 * * *'` - Daily at 9 AM
- `'0 */6 * * *'` - Every 6 hours
- `'0 9 * * 1-5'` - Weekdays at 9 AM

[Cron syntax help](https://crontab.guru/)

### Add More Figma Frames

Just add more `<!-- figma-frame: FILE_ID/NODE_ID -->` comments to other `.mdx` files!

### View Workflow Logs

1. Go to **Actions** tab
2. Click the latest workflow run
3. Click the job to see detailed logs
4. Check the "Scan and sync Figma frames" step

### Troubleshoot Issues

If the workflow fails:

1. Check the workflow logs for specific errors
2. Verify your Figma token is correct
3. Verify FILE_ID and NODE_ID are correct
4. Ensure the frame/component still exists in Figma
5. Run the test script locally

## File Structure Created

```
.github/
├── workflows/
│   └── sync-figma.yml              # Main workflow
├── scripts/
│   ├── sync-figma.js               # Core sync logic
│   ├── test-sync.js                # Local testing
│   └── figma-sync.config.js         # Configuration template
└── FIGMA_SYNC_README.md            # Full documentation
```

## Examples

### Example 1: Single Button Component

**button.mdx:**
```mdx
---
title: Button
---

<!-- figma-frame: h8Ugks6YufraLCbPxOkgxb/1-11 -->

## Button Component

Reusable button element.
```

**After sync:**
```mdx
---
title: Button
---

<!-- figma-frame: h8Ugks6YufraLCbPxOkgxb/1-11 -->
<!-- figma-screenshot -->

## Button Component

Reusable button element.

## Figma Specifications
<!-- figma-specs-start -->

### Size

- **Width**: 120px
- **Height**: 48px

### Colors

| Type | Color | Opacity |
|------|-------|---------|
| fill | #0A44A0 | 100% |

### Typography

| Property | Value |
|----------|-------|
| Font Family | Inter |
| Font Size | 14px |
| Font Weight | 500 |
| Line Height | 20px |

<!-- figma-specs-end -->
```

### Example 2: Multiple Components in One File

```mdx
---
title: Form Components
---

## Text Input

<!-- figma-frame: abc123/10:100 -->

Text input field...

## Checkbox

<!-- figma-frame: abc123/10:101 -->

Checkbox component...

## Radio Button

<!-- figma-frame: abc123/10:102 -->

Radio button component...
```

All three will be synced automatically!

## Next Steps

1. ✓ Add Figma token to GitHub Secrets
2. ✓ Add `<!-- figma-frame: -->` comments to your .mdx files
3. ✓ Run the workflow manually or wait for Monday
4. ✓ Review and merge the PR
5. Keep syncing! Repeat for all your design components.

## Need Help?

Check out the full documentation: `.github/FIGMA_SYNC_README.md`

Common issues:
- **"Token not found"** → Add secret to GitHub Settings
- **"No frames detected"** → Check comment format is exact
- **"Invalid FILE_ID/NODE_ID"** → Verify IDs from Figma URL
- **"Workflow won't run"** → Check Actions tab is enabled

---

**Happy documenting!** 🎨📚
