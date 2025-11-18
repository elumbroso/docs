#!/usr/bin/env node

/**
 * Sync Figma Screenshots and Specifications
 * 
 * This script:
 * 1. Scans all .mdx files for Figma frame references
 * 2. Checks if frames have been modified since last screenshot
 * 3. Exports new screenshots and fetches specifications
 * 4. Updates .mdx files with latest data
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const FIGMA_API_BASE = 'https://api.figma.com/v1';
const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN;
const DOCS_DIR = '.';

if (!FIGMA_API_TOKEN) {
  console.error('Error: FIGMA_API_TOKEN environment variable is not set');
  process.exit(1);
}

/**
 * Make HTTP request to Figma API
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'X-Figma-Token': FIGMA_API_TOKEN,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`Figma API error ${res.statusCode}: ${data}`));
        } else {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Get file data from Figma API
 */
async function getFileData(fileId) {
  const url = `${FIGMA_API_BASE}/files/${fileId}`;
  return makeRequest(url);
}

/**
 * Get node data from Figma API
 */
async function getNodeData(fileId, nodeIds) {
  const url = `${FIGMA_API_BASE}/files/${fileId}/nodes?ids=${nodeIds.join(',')}`;
  return makeRequest(url);
}

/**
 * Export frame as image
 */
async function exportFrame(fileId, nodeId, scale = 2) {
  const url = `${FIGMA_API_BASE}/images/${fileId}?ids=${nodeId}&format=png&scale=${scale}`;
  const data = await makeRequest(url);
  return data.images[nodeId];
}

/**
 * Download image from URL and save locally
 */
function downloadImage(imageUrl, filePath) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${res.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filePath);
      });

      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Extract Figma frame references from .mdx file
 * Looks for: <!-- figma-frame: FILE_ID/NODE_ID -->
 */
function extractFigmaFrames(content) {
  const regex = /<!--\s*figma-frame:\s*([^/]+)\/([^\s]+)\s*-->/g;
  const frames = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    frames.push({
      fileId: match[1],
      nodeId: match[2],
    });
  }

  return frames;
}

/**
 * Parse Figma node to extract specifications
 */
function parseNodeSpecs(node) {
  const specs = {
    size: {},
    spacing: {},
    colors: [],
    typography: {},
  };

  if (node.absoluteBoundingBox) {
    specs.size = {
      width: node.absoluteBoundingBox.width,
      height: node.absoluteBoundingBox.height,
    };
  }

  // Extract fill colors
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach((fill) => {
      if (fill.type === 'SOLID' && fill.color) {
        const hex = rgbToHex(fill.color);
        specs.colors.push({
          type: 'fill',
          color: hex,
          opacity: fill.opacity || 1,
        });
      }
    });
  }

  // Extract stroke colors
  if (node.strokes && Array.isArray(node.strokes)) {
    node.strokes.forEach((stroke) => {
      if (stroke.type === 'SOLID' && stroke.color) {
        const hex = rgbToHex(stroke.color);
        specs.colors.push({
          type: 'stroke',
          color: hex,
          opacity: stroke.opacity || 1,
        });
      }
    });
  }

  // Extract typography for text nodes
  if (node.type === 'TEXT' && node.style) {
    specs.typography = {
      fontFamily: node.style.fontFamily || 'Unknown',
      fontSize: node.style.fontSize || 'Unknown',
      fontWeight: node.style.fontWeight || 400,
      lineHeight: node.style.lineHeightPx || 'auto',
      letterSpacing: node.style.letterSpacing || 0,
    };
  }

  // Recursively process children
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => {
      const childSpecs = parseNodeSpecs(child);
      if (child.type === 'TEXT' && !Object.keys(specs.typography).length) {
        specs.typography = childSpecs.typography;
      }
    });
  }

  return specs;
}

/**
 * Convert RGB to Hex color
 */
function rgbToHex(rgb) {
  const r = Math.round((rgb.r || 0) * 255).toString(16).padStart(2, '0');
  const g = Math.round((rgb.g || 0) * 255).toString(16).padStart(2, '0');
  const b = Math.round((rgb.b || 0) * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

/**
 * Format specifications as markdown table
 */
function formatSpecsAsMarkdown(specs) {
  let markdown = '';

  if (specs.size && (specs.size.width || specs.size.height)) {
    markdown += '\n### Size\n\n';
    markdown += `- **Width**: ${specs.size.width}px\n`;
    markdown += `- **Height**: ${specs.size.height}px\n`;
  }

  if (specs.colors && specs.colors.length) {
    markdown += '\n### Colors\n\n';
    markdown += '| Type | Color | Opacity |\n';
    markdown += '|------|-------|----------|\n';
    specs.colors.forEach((color) => {
      markdown += `| ${color.type} | ${color.color} | ${(color.opacity * 100).toFixed(0)}% |\n`;
    });
  }

  if (specs.typography && Object.keys(specs.typography).length) {
    markdown += '\n### Typography\n\n';
    markdown += '| Property | Value |\n';
    markdown += '|----------|-------|\n';
    if (specs.typography.fontFamily) {
      markdown += `| Font Family | ${specs.typography.fontFamily} |\n`;
    }
    if (specs.typography.fontSize) {
      markdown += `| Font Size | ${specs.typography.fontSize}px |\n`;
    }
    if (specs.typography.fontWeight) {
      markdown += `| Font Weight | ${specs.typography.fontWeight} |\n`;
    }
    if (specs.typography.lineHeight) {
      markdown += `| Line Height | ${specs.typography.lineHeight} |\n`;
    }
    if (specs.typography.letterSpacing) {
      markdown += `| Letter Spacing | ${specs.typography.letterSpacing} |\n`;
    }
  }

  return markdown;
}

/**
 * Update .mdx file with new screenshot and specs
 */
function updateMdxFile(filePath, frameRef, screenshotPath, specs) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Extract relative path for the image in mdx
  const imageRelativePath = path.relative(path.dirname(filePath), screenshotPath);

  // Add screenshot section if not present
  const figmaCommentRegex = new RegExp(
    `<!--\\s*figma-frame:\\s*${frameRef.fileId}/${frameRef.nodeId}\\s*-->`,
    'g'
  );

  if (!content.includes('<!-- figma-screenshot -->')) {
    // Insert screenshot placeholder after the comment
    content = content.replace(
      figmaCommentRegex,
      `<!-- figma-frame: ${frameRef.fileId}/${frameRef.nodeId} -->\n<!-- figma-screenshot -->`
    );
  }

  // Add or update specifications section
  const specsMarkdown = formatSpecsAsMarkdown(specs);

  if (content.includes('<!-- figma-specs-start -->')) {
    // Replace existing specs section
    const specsRegex =
      /<!-- figma-specs-start -->[\s\S]*?<!-- figma-specs-end -->/;
    content = content.replace(
      specsRegex,
      `<!-- figma-specs-start -->${specsMarkdown}\n<!-- figma-specs-end -->`
    );
  } else {
    // Add new specs section before the closing of file or before next section
    content += `\n\n## Figma Specifications\n<!-- figma-specs-start -->${specsMarkdown}\n<!-- figma-specs-end -->`;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Get last modified timestamp from git
 */
function getFileLastModified(filePath) {
  const stats = fs.statSync(filePath);
  return new Date(stats.mtimeMs);
}

/**
 * Scan for all .mdx files with Figma references
 */
function scanMdxFiles(dir) {
  const files = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    entries.forEach((entry) => {
      if (entry.name.startsWith('.')) return; // Skip hidden files

      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    });
  }

  walk(dir);
  return files;
}

/**
 * Main sync function
 */
async function syncFigmaFrames() {
  console.log('Starting Figma sync...\n');

  let changesDetected = false;
  const updatedFrames = [];

  try {
    // Scan all .mdx files
    const mdxFiles = scanMdxFiles(DOCS_DIR).filter(
      (f) => !f.includes('node_modules') && !f.includes('.git')
    );

    console.log(`Found ${mdxFiles.length} .mdx files to scan\n`);

    for (const mdxFile of mdxFiles) {
      const content = fs.readFileSync(mdxFile, 'utf-8');
      const frames = extractFigmaFrames(content);

      if (frames.length === 0) continue;

      console.log(`Processing ${mdxFile}`);

      // Group frames by file ID to minimize API calls
      const framesByFile = {};
      frames.forEach((frame) => {
        if (!framesByFile[frame.fileId]) {
          framesByFile[frame.fileId] = [];
        }
        framesByFile[frame.fileId].push(frame.nodeId);
      });

      for (const [fileId, nodeIds] of Object.entries(framesByFile)) {
        try {
          // Fetch node data from Figma
          const nodeData = await getNodeData(fileId, nodeIds);

          for (const nodeId of nodeIds) {
            const node = nodeData.nodes[nodeId];

            if (!node || !node.document) {
              console.warn(`  ⚠ Could not fetch node ${nodeId}`);
              continue;
            }

            console.log(`  ✓ Syncing frame ${nodeId}`);

            // Export screenshot
            const screenshotUrl = await exportFrame(fileId, nodeId, 2);
            const screenshotDir = path.join(
              path.dirname(mdxFile),
              'figma-screenshots'
            );

            if (!fs.existsSync(screenshotDir)) {
              fs.mkdirSync(screenshotDir, { recursive: true });
            }

            const screenshotPath = path.join(
              screenshotDir,
              `${nodeId}-@2x.png`
            );
            await downloadImage(screenshotUrl, screenshotPath);

            // Parse specifications
            const specs = parseNodeSpecs(node.document);

            // Update .mdx file
            updateMdxFile(mdxFile, { fileId, nodeId }, screenshotPath, specs);

            changesDetected = true;
            updatedFrames.push(`- ${path.basename(mdxFile)}: ${nodeId}`);
          }
        } catch (error) {
          console.error(`  ✗ Error syncing file ${fileId}:`, error.message);
        }
      }

      console.log();
    }
  } catch (error) {
    console.error('Error during sync:', error);
    process.exit(1);
  }

  // Output for GitHub Actions
  console.log('::set-output name=changes_detected::' + changesDetected);
  console.log(
    '::set-output name=updated_frames::' + updatedFrames.join('\n')
  );

  console.log('\nSync complete!');
  if (changesDetected) {
    console.log(`Updated ${updatedFrames.length} frame(s)`);
  } else {
    console.log('No frames needed updating');
  }

  return changesDetected;
}

// Run sync
syncFigmaFrames()
  .then((changed) => {
    process.exit(changed ? 0 : 0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
