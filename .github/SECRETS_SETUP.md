# GitHub Secrets Setup Guide

This guide walks you through setting up the `FIGMA_API_TOKEN` secret required for the Figma sync workflow.

## Why You Need This Secret

The Figma sync workflow needs permission to:
- Access your Figma files
- Read frame and component data
- Export screenshots
- Extract design specifications

Your personal access token provides this access securely.

## Step 1: Generate a Figma Personal Access Token

### 1a. Visit Figma Settings

1. Open [Figma Settings](https://www.figma.com/settings/profile) in your browser
2. Or: In Figma → Account → Profile Settings

### 1b. Create Personal Access Token

1. Scroll down to the **Personal access tokens** section
2. Click **Generate new token**
3. A dialog appears

### 1c. Configure the Token

1. **Name**: `GitHub Docs Sync` (or whatever you prefer)
2. **Scope**: Select **File read** at minimum
   - **File read** - Read-only access to files (recommended for this use case)
   - **File read + write** - Can also modify files (not needed for sync)

3. Click **Generate token**

### 1d. Save Your Token

**IMPORTANT**: Copy the token immediately after generation. You won't be able to see it again!

The token looks like: `figma_xxxxx_xxxxxxxxxxxxxxxxxxxxxxxx`

**Save it temporarily** (copy to a text editor momentarily):
```
figma_1234567890_1234567890abcdef1234567890abcdef
```

## Step 2: Add Token to GitHub Secrets

### 2a. Navigate to GitHub Repository Settings

1. Go to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables**
4. Click **Actions** (if not already selected)

### 2b. Create New Secret

1. Click **New repository secret** button (top right)

### 2c. Enter Secret Details

**Name**: `FIGMA_API_TOKEN`
```
Exactly this name - case sensitive!
```

**Value**: Paste your Figma token
```
figma_1234567890_1234567890abcdef1234567890abcdef
```

**Important:**
- Don't include any extra spaces or quotes
- Don't modify the token value
- Paste the entire token as-is

### 2d. Save the Secret

1. Click **Add secret** button
2. You should see your new secret in the list

✓ Done! The secret is now securely stored.

## Verification

### Verify Secret is Accessible to Workflow

1. Go to **Actions** tab
2. Click **Sync Figma Screenshots and Specs** workflow
3. Click **Run workflow**
4. The workflow should have access to the secret

### Test the Workflow

1. Click **Run workflow** button
2. Check the logs for the "Scan and sync Figma frames" step
3. Look for errors related to authentication

If you see `Error: FIGMA_API_TOKEN environment variable is not set`, the secret wasn't properly added.

## Troubleshooting

### "Secret not working" / "API errors"

1. **Verify token is correct**
   - Go to [Figma Settings](https://www.figma.com/settings/profile)
   - Check if token still appears in the list
   - If it's been revoked, generate a new one

2. **Verify GitHub secret is set**
   - Go to repository Settings → Secrets
   - Look for `FIGMA_API_TOKEN`
   - Make sure it's spelled exactly right (case-sensitive)

3. **Try a new token**
   - Revoke the current token in Figma
   - Generate a new token
   - Update the GitHub secret

### "File access denied" Errors

1. Verify the token has **File read** scope
2. Verify you have permission to access the Figma file
3. Try regenerating the token with the correct scope

### "Token appears as [secure]" in logs

This is normal and expected! GitHub hides secret values in logs for security.

## Security Best Practices

### What This Secret Can Do

With `FIGMA_API_TOKEN`, anyone with access to your repository can:
- Read all your Figma files
- Export screenshots and data
- (If using File read+write scope) Modify your files

### What to Avoid

❌ **Don't**: Commit tokens to your repository
❌ **Don't**: Paste tokens in issues, PRs, or discussions
❌ **Don't**: Share tokens with other people
❌ **Don't**: Use the same token for multiple purposes

### How GitHub Protects Your Secret

✅ GitHub encrypts the token at rest
✅ Token only exposed to workflows in this repository
✅ Token is hidden from logs (shown as `[secure]`)
✅ You can revoke the token anytime in Figma settings

## Token Expiration and Rotation

### Figma Token Lifespan

- Figma personal access tokens **do not expire automatically**
- You control when to revoke them

### Rotate Your Token (Optional)

For added security, periodically:

1. Generate a new token in Figma
2. Update the GitHub secret with the new token
3. Revoke the old token in Figma

## Multiple Repositories

If you have multiple documentation repositories:

**Option 1: Same Token for All**
- Add the same `FIGMA_API_TOKEN` to each repository
- Simplest setup
- Revoke once to disconnect all repos

**Option 2: Organization Secrets (GitHub Enterprise)**
- Set up organization-level secrets in GitHub
- Shared across all repositories
- Requires GitHub organization

## Accessing Secret Value Later

To view or update your secret:

1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click the secret name to edit it
4. Click **Update secret** to change the value

Note: You can't see the current value, only replace it with a new one.

## If You Lose Your Token

If you forgot to save your Figma token:

1. Go to [Figma Settings](https://www.figma.com/settings/profile)
2. Find the token in **Personal access tokens**
3. Click the token to view it (one-time)
4. Copy it
5. Update your GitHub secret

If the token was already revoked:

1. In Figma, click the trash icon to delete the old token
2. Generate a new token
3. Update your GitHub secret

## Testing Locally

To test the sync script locally with your token:

```bash
export FIGMA_API_TOKEN=your_actual_token
node .github/scripts/test-sync.js
```

You'll see output like:
```
✓ FIGMA_API_TOKEN found
```

## FAQ

**Q: Can I use the same token for multiple Figma accounts?**
A: No, each token is tied to one account.

**Q: What if my token leaks?**
A: Immediately revoke it in Figma settings and generate a new one.

**Q: Does the token work for team files?**
A: Yes, if you have access to team files through your account.

**Q: How often should I rotate my token?**
A: Up to you. At least annually is recommended for security.

**Q: Can I limit the token to specific files?**
A: No, Figma tokens have file:read scope for all files you can access.

## Need Help?

1. Check Figma documentation: [Personal access tokens](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)
2. Check GitHub documentation: [Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
3. Review workflow logs in the **Actions** tab

---

**You're all set!** Your Figma sync workflow is ready to use. 🎉
