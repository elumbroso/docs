# Troubleshooting Checklist

Use this checklist to diagnose and fix any issues with the Figma sync workflow.

## Before You Start

- [ ] You have read `.github/QUICKSTART.md`
- [ ] You have a Figma account with access to files
- [ ] You have push access to the repository
- [ ] You understand your Figma file and node IDs

## Pre-Deployment Checklist

### GitHub Repository Setup

- [ ] Repository has Actions enabled (Settings → Actions)
- [ ] `FIGMA_API_TOKEN` secret is added (Settings → Secrets)
- [ ] Secret name is exactly `FIGMA_API_TOKEN` (case-sensitive)
- [ ] Secret contains valid Figma personal access token
- [ ] Token has "File read" scope in Figma settings

### Workflow File

- [ ] `.github/workflows/sync-figma.yml` exists
- [ ] File has correct YAML syntax (no spacing errors)
- [ ] Cron schedule is in correct format `'0 9 * * 1'`
- [ ] All step names are unique

### Script Files

- [ ] `.github/scripts/sync-figma.js` exists and is executable
- [ ] `.github/scripts/test-sync.js` exists
- [ ] `package.json` exists in repository root
- [ ] All scripts have proper Node.js shebangs (`#!/usr/bin/env node`)

### Documentation Files

- [ ] `.mdx` files have Figma frame comments
- [ ] Comment format is exact: `<!-- figma-frame: FILE_ID/NODE_ID -->`
- [ ] No typos in FILE_ID or NODE_ID
- [ ] File and nodes still exist in Figma

## Local Testing

### Test 1: Check API Token

```bash
export FIGMA_API_TOKEN=your_token
node .github/scripts/test-sync.js
```

Expected output:
```
✓ FIGMA_API_TOKEN found
Found X file(s) with Figma references:
Configuration looks good! ✓
```

**Issues?**
- Token not set: `export FIGMA_API_TOKEN=...`
- Token invalid: Regenerate in Figma settings
- No files found: Check `.mdx` file format

### Test 2: Verify Files Exist

```bash
ls -la .github/workflows/sync-figma.yml
ls -la .github/scripts/sync-figma.js
ls -la package.json
```

All should exist and be readable.

### Test 3: Check Comment Format

```bash
grep -r "figma-frame:" --include="*.mdx"
```

Should show:
```
components/button.mdx:<!-- figma-frame: h8Ugks6YufraLCbPxOkgxb/1-11 -->
```

**Issues?**
- No output: Add comments to your `.mdx` files
- Wrong format: Check exact format with no spaces

### Test 4: Validate YAML

```bash
# If you have yamllint installed
yamllint .github/workflows/sync-figma.yml

# Or use an online validator
# https://yamllint.com/
```

No errors should appear.

## GitHub Actions Troubleshooting

### Workflow Not Appearing

**Problem**: Workflow doesn't show in Actions tab

1. [ ] Repository is public or Actions enabled for private repos
2. [ ] Workflow file is in `.github/workflows/` directory
3. [ ] Workflow file has `.yml` or `.yaml` extension
4. [ ] YAML syntax is valid (check for colons, indentation)
5. [ ] Refresh GitHub page (hard refresh: Cmd+Shift+R)

**Solution**: Check workflow file syntax, push changes, and refresh.

### Workflow Not Running

**Problem**: Scheduled workflow doesn't run automatically

1. [ ] At least one commit exists on the branch (workflows need git history)
2. [ ] Cron schedule is valid (test at [crontab.guru](https://crontab.guru/))
3. [ ] Branch is set as default branch in settings
4. [ ] Actions are enabled in repository settings
5. [ ] No `if:` condition preventing execution

**Solution**: Push a commit, wait for the scheduled time, check Actions tab.

### Manual Trigger Not Working

**Problem**: "Run workflow" button is missing or disabled

1. [ ] Workflow file contains `workflow_dispatch:`
2. [ ] File is in `.github/workflows/` directory
3. [ ] YAML is valid
4. [ ] Refresh page and try again

**Solution**: Add `workflow_dispatch:` to workflow, commit, and refresh.

### Workflow Runs but Fails

Check the logs in the failing step:

#### "Scan and sync Figma frames" Step Fails

**Error: FIGMA_API_TOKEN not found**
- [ ] Secret name is exactly `FIGMA_API_TOKEN`
- [ ] Secret is in Settings → Secrets → Actions
- [ ] Secret contains the full token value
- [ ] Try deleting and re-adding the secret

**Error: API request failed**
- [ ] Token has "File read" scope
- [ ] Token hasn't been revoked in Figma
- [ ] Token is for your current Figma account
- [ ] File ID and Node ID are correct

**Error: Node not found**
- [ ] FILE_ID is from the file URL (not a team ID)
- [ ] NODE_ID is from the node URL (with the `?node-id=` parameter)
- [ ] Node still exists in Figma (not deleted)
- [ ] You have access to the Figma file

#### "Create Pull Request" Step Fails

**Error: Permission denied**
- [ ] Workflow has `permissions: contents: write`
- [ ] Branch doesn't have protection rules blocking it
- [ ] Repository is not read-only

**Error: Branch already exists**
- [ ] Previous branch wasn't deleted (shouldn't matter with unique run ID)
- [ ] Try deleting the old `figma-sync-*` branch manually

#### Installation/Setup Step Fails

**Error: npm ci fails**
- [ ] `package.json` exists in repository root
- [ ] `package.json` has valid JSON syntax
- [ ] No circular dependencies

**Error: Node.js version issues**
- [ ] Node 18 is available on ubuntu-latest
- [ ] Try changing to `node-version: '20'` if needed

## Common Errors and Fixes

### Error: "Cannot find module 'https'"

**Cause**: Node.js built-in module not available
**Fix**: This shouldn't happen. Check Node.js installation in workflow.

### Error: "API error 403"

**Cause**: Invalid or unauthorized token
**Fix**: 
1. Generate new Figma token
2. Update GitHub secret
3. Verify token has "File read" scope

### Error: "API error 404: File not found"

**Cause**: Wrong FILE_ID or file doesn't exist
**Fix**:
1. Get correct FILE_ID from Figma URL
2. Verify file is accessible to your account
3. Check file hasn't been moved/deleted

### Error: "API error 404: Node not found"

**Cause**: Wrong NODE_ID or node was deleted
**Fix**:
1. Get NODE_ID from frame URL (`?node-id=...`)
2. Verify frame/component still exists in Figma
3. Select the frame again to get correct ID

### Error: "Changes detected but PR not created"

**Cause**: `steps.sync.outputs.changes_detected` output not set
**Fix**:
1. Check sync-figma.js has `::set-output` commands
2. Verify script exits with code 0 (success)
3. Check for errors in sync step logs

### Error: "No changes detected" but files were updated

**Cause**: Script couldn't write to files or gitignore blocking files
**Fix**:
1. Check file permissions (should be writable)
2. Verify `.mdx` files aren't in `.gitignore`
3. Check for `figma-screenshots/` directory creation

## Workflow Step-by-Step Verification

### Step 1: Checkout Repository
**Expected**: Repository cloned successfully

**Check**: Logs should show repo details
```
Repository name:  docs
Branch: main
Commit:  abc123...
```

If fails:
- [ ] Repository exists
- [ ] Branch exists
- [ ] User has access

### Step 2: Set up Node.js
**Expected**: Node 18 installed

**Check**: Logs show Node.js version
```
Setup Node.js [18.x]
Installed successfully
```

If fails:
- [ ] Check Node.js version availability
- [ ] Try different version

### Step 3: Install Dependencies
**Expected**: npm ci succeeds

**Check**: No errors installing packages
```
npm warn ...
up to date
```

If fails:
- [ ] Check `package.json` syntax
- [ ] Check internet connection in runner

### Step 4: Scan and Sync Figma Frames
**Expected**: Frames are scanned and synced

**Check**: Logs show:
```
Found X file(s) with Figma references
✓ Syncing frame [NODE_ID]
Updated X frame(s)
::set-output name=changes_detected::true
```

If fails:
- [ ] See "API Errors" section above
- [ ] Check Figma token validity

### Step 5: Create Pull Request
**Expected**: PR is created (if changes detected)

**Check**: Logs show PR details
```
Created pull request #123
Branch: figma-sync-12345
Title: chore: sync Figma updates
```

If skipped:
- [ ] This is normal if no changes detected
- [ ] Check sync step logs

## Testing Checklist

Before running in production:

- [ ] Test comment format with `grep -r "figma-frame:"`
- [ ] Test API token with `node .github/scripts/test-sync.js`
- [ ] Verify NODE_IDs by visiting Figma links
- [ ] Check file permissions are writable
- [ ] Test manual workflow run first
- [ ] Review generated PR before merging
- [ ] Check generated screenshots are correct
- [ ] Verify specifications are accurate

## FAQ: Common Questions

**Q: Why is the PR not being created?**
A: This is expected if no frames were detected or no changes occurred. Check sync logs.

**Q: How do I test without pushing to main?**
A: Create a test branch, push, and run workflow manually from Actions tab.

**Q: Can I run the sync multiple times per day?**
A: Yes, change the cron schedule or use `workflow_dispatch` to run manually.

**Q: What if a frame is deleted in Figma?**
A: Workflow will fail with "404: Node not found". Remove the comment from `.mdx` file.

**Q: How do I know what specifications will be extracted?**
A: See `.github/FIGMA_SYNC_README.md` for details. Size, colors, and typography are extracted.

**Q: Can I manually edit the generated sections?**
A: Yes, but they will be overwritten on the next sync. Add content outside the markers.

## Getting Help

1. **Check logs**: GitHub Actions → Workflow run → Step logs
2. **Review documentation**: `.github/FIGMA_SYNC_README.md`
3. **Run local test**: `node .github/scripts/test-sync.js`
4. **Verify setup**: `.github/SECRETS_SETUP.md`
5. **Review examples**: `.github/EXAMPLE_COMPONENT.mdx`

## Still Stuck?

**Create a GitHub Issue with**:
- [ ] Workflow run number (from Actions tab)
- [ ] Full error message from logs
- [ ] Your FILE_ID and NODE_ID
- [ ] Screenshot of where you added the comment
- [ ] Output of `node .github/scripts/test-sync.js`

---

**Last Updated**: November 18, 2025

For comprehensive documentation, see `.github/FIGMA_SYNC_README.md`
