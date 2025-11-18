# Figma Sync Workflow

This GitHub Actions workflow automatically synchronizes Figma screenshots and design specifications to your documentation repository.

## Features

✅ **Automated Synchronization**: Runs on a schedule (every Monday at 9 AM UTC) or manually via workflow dispatch  
✅ **Smart Detection**: Scans all `.mdx` files for Figma frame references  
✅ **2x PNG Export**: Exports high-quality retina-ready screenshots  
✅ **Design Specs Extraction**: Automatically extracts colors, typography, and dimensions  
✅ **Auto Pull Requests**: Creates PRs only when changes are detected  
✅ **No External Dependencies**: Uses GitHub Actions and Node.js built-ins

## Setup

### 1. Add Figma API Token to Secrets

1. Go to your GitHub repository settings
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Add a secret named `FIGMA_API_TOKEN` with your Figma personal access token

To get a Figma token:
- Go to https://www.figma.com/settings/profile
- Scroll to "Personal access tokens"
- Generate a new token with scope: `file:read`
- Copy the token to GitHub Secrets

### 2. Mark Figma Frames in Documentation

Add HTML comments to your `.mdx` files to mark which Figma frames to sync:

```mdx
---
title: Button Component
---

<!-- figma-frame: FILE_ID/NODE_ID -->

## Overview

This is the button component...

<!-- figma-screenshot -->

<!-- figma-specs-start -->
<!-- figma-specs-end -->
```

**Format**: `<!-- figma-frame: FILE_ID/NODE_ID -->`

Where:
- `FILE_ID`: Your Figma file ID (from the file URL)
- `NODE_ID`: The specific frame/component node ID (from the node URL)

### 3. How to Find File ID and Node ID

**File ID**: In your Figma file URL
```
https://www.figma.com/file/[FILE_ID]/[FileName]
                          ^^^^^^^^
```

**Node ID**: When you select a frame/component
```
https://www.figma.com/file/[FILE_ID]/[FileName]?node-id=[NODE_ID]
                                                            ^^^^^^^
```

## Usage

### Manual Trigger

Go to **Actions → Sync Figma Screenshots and Specs → Run workflow**

### Scheduled Run

The workflow runs automatically every Monday at 9 AM UTC.

To modify the schedule, edit `.github/workflows/sync-figma.yml`:

```yaml
on:
  schedule:
    - cron: '0 9 * * 1'  # This is Monday at 9 AM UTC
```

[Cron syntax reference](https://crontab.guru/)

## Workflow Overview

```
1. Checkout repository
   ↓
2. Install Node.js dependencies
   ↓
3. Run sync script:
   - Scan all .mdx files
   - Find Figma frame comments
   - For each frame:
     • Fetch node data from Figma API
     • Export 2x PNG screenshot
     • Extract design specifications
     • Update .mdx file
   ↓
4. Create Pull Request (if changes detected)
   OR
4. Exit silently (if no changes)
```

## File Structure

```
.github/
├── workflows/
│   └── sync-figma.yml         # Main workflow definition
└── scripts/
    └── sync-figma.js          # Sync script (Node.js)
```

## What Gets Extracted

### Size
- Width and height in pixels

### Colors
- Fill colors with opacity
- Stroke colors with opacity
- Converted to HEX format

### Typography
- Font family
- Font size
- Font weight
- Line height
- Letter spacing

### Generated Screenshots
- Stored in `figma-screenshots/` directory relative to the `.mdx` file
- Exported at 2x scale (retina quality)
- Named as `[NODE_ID]-@2x.png`

## Example Output

When a frame is updated, the workflow:

1. **Exports screenshot** → `components/figma-screenshots/1-11-@2x.png`
2. **Updates .mdx file** with:
   - Screenshot reference
   - Extracted specifications
   - Formatted as markdown tables

3. **Creates PR** with:
   - Title: "chore: sync Figma updates"
   - Labels: `chore`, `figma-sync`
   - List of updated frames

## Configuration Options

### Change Schedule

Edit the cron expression in `.github/workflows/sync-figma.yml`:

```yaml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
```

Common patterns:
- `'0 9 * * 1'` - Monday at 9 AM UTC
- `'0 9 * * *'` - Daily at 9 AM UTC
- `'0 */6 * * *'` - Every 6 hours
- `'0 9 * * 1-5'` - Weekdays at 9 AM UTC

### Change PR Labels

Edit `.github/workflows/sync-figma.yml`:

```yaml
labels: 'chore,figma-sync,your-label'
```

### Change Scale Factor

In `.github/scripts/sync-figma.js`, modify the `exportFrame` call:

```javascript
// Current: 2x scale (retina)
await exportFrame(fileId, nodeId, 2);

// Change to 1x, 3x, 4x as needed
await exportFrame(fileId, nodeId, 1);  // 1x
await exportFrame(fileId, nodeId, 3);  // 3x
```

## Troubleshooting

### Token not working
- Verify token has `file:read` scope
- Check that the token is correctly added to GitHub Secrets as `FIGMA_API_TOKEN`
- Try generating a new token

### No frames detected
- Ensure comments follow exact format: `<!-- figma-frame: FILE_ID/NODE_ID -->`
- Check that FILE_ID and NODE_ID are correct
- Verify the file and node still exist in Figma

### Workflow fails silently
- Check **Actions** tab in GitHub for error logs
- Review the workflow run output
- Verify your Figma file is accessible

### Images not downloading
- Check file permissions in the repository
- Ensure Figma API token has read access
- Verify PNG export is enabled for the frame

## Performance Notes

- API calls are optimized by grouping frames by file ID
- Screenshots are only exported at 2x scale
- Changes are detected before creating PRs to avoid unnecessary PRs

## Limitations

- Currently extracts specifications from direct node properties
- Complex nested components may not extract all specifications
- Screenshots are limited to PNG format
- Requires manual addition of `figma-frame` comments in `.mdx` files

## Future Enhancements

Possible additions:
- Detect frame modifications automatically (without manual comments)
- Export multiple formats (SVG, WEBP)
- Extract component variants
- Generate component code snippets
- Support for design tokens
- Automatic comment generation for all frames in a file

## Support

For issues or questions:
1. Check the workflow logs in **Actions** tab
2. Verify Figma API token and permissions
3. Ensure comment format is correct
4. Test the sync script locally: `npm run sync:figma`

## License

MIT
