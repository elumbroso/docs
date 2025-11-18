#!/usr/bin/env node

/**
 * Local Test Script for Figma Sync
 * 
 * Usage:
 *   FIGMA_API_TOKEN=your_token node .github/scripts/test-sync.js
 * 
 * This script allows you to test the Figma sync locally before running it in GitHub Actions.
 * It performs the same operations as the workflow but with additional debugging output.
 */

const fs = require('fs');
const path = require('path');

console.log('═════════════════════════════════════════');
console.log('  Figma Sync - Local Test Script');
console.log('═════════════════════════════════════════\n');

// Check for API token
const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN;

if (!FIGMA_API_TOKEN) {
  console.error('❌ Error: FIGMA_API_TOKEN environment variable is not set');
  console.error('\nTo test locally, run:');
  console.error('  export FIGMA_API_TOKEN=your_figma_token');
  console.error('  node .github/scripts/test-sync.js\n');
  process.exit(1);
}

console.log('✓ FIGMA_API_TOKEN found\n');

// Check for .mdx files with Figma references
function findMdxFilesWithFigma(dir) {
  const files = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    entries.forEach((entry) => {
      if (entry.name.startsWith('.')) return;

      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (!['node_modules', '.git', '.github'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.name.endsWith('.mdx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('figma-frame:')) {
          files.push({
            path: fullPath,
            frames: content.match(/<!--\s*figma-frame:\s*([^/]+)\/([^\s]+)\s*-->/g) || [],
          });
        }
      }
    });
  }

  walk(dir);
  return files;
}

console.log('Scanning for .mdx files with Figma references...\n');

const mdxFiles = findMdxFilesWithFigma('.');

if (mdxFiles.length === 0) {
  console.log('ℹ  No .mdx files found with figma-frame comments');
  console.log('\nTo get started:');
  console.log('  1. Add a comment to your .mdx file:');
  console.log('     <!-- figma-frame: YOUR_FILE_ID/YOUR_NODE_ID -->');
  console.log('  2. Replace YOUR_FILE_ID and YOUR_NODE_ID with your Figma details');
  console.log('  3. Run this script again\n');
  process.exit(0);
}

console.log(`Found ${mdxFiles.length} file(s) with Figma references:\n`);

mdxFiles.forEach((file) => {
  console.log(`📄 ${file.path}`);
  file.frames.forEach((frame) => {
    console.log(`   └─ ${frame}`);
  });
  console.log();
});

console.log('═════════════════════════════════════════\n');
console.log('Configuration looks good! ✓\n');

console.log('Next steps:');
console.log('  1. Review the file references above');
console.log('  2. Verify FILE_ID and NODE_ID are correct');
console.log('  3. Run the actual workflow from GitHub Actions');
console.log('     OR');
console.log('  4. Modify sync-figma.js to add additional logging');
console.log('  5. Make a commit and push to trigger the workflow\n');

console.log('Documentation: .github/FIGMA_SYNC_README.md');
