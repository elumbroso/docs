/**
 * Figma Sync Configuration
 * 
 * This file can be used to customize the Figma sync behavior.
 * Currently, the sync script uses default settings, but this structure
 * allows for future extensibility.
 */

module.exports = {
  // Figma export settings
  export: {
    // Screenshot scale factor (1x, 2x, 3x, 4x)
    scale: 2,
    
    // Export format (only 'png' is currently supported)
    format: 'png',
    
    // Directory name for screenshots relative to .mdx file
    screenshotDir: 'figma-screenshots',
  },

  // Specification extraction settings
  specs: {
    // Extract size information
    extractSize: true,
    
    // Extract color information
    extractColors: true,
    
    // Extract typography information
    extractTypography: true,
    
    // Extract spacing information
    extractSpacing: false,
  },

  // File scanning settings
  scan: {
    // Directory to scan (relative to repo root)
    directory: '.',
    
    // File pattern to match
    pattern: '**/*.mdx',
    
    // Directories to exclude
    exclude: ['node_modules', '.git', '.github', 'dist', 'build'],
  },

  // Comment format for Figma references
  // Format: <!-- figma-frame: FILE_ID/NODE_ID -->
  comment: {
    pattern: /<!--\s*figma-frame:\s*([^/]+)\/([^\s]+)\s*-->/g,
  },

  // Sections that will be auto-generated in .mdx files
  autoSections: {
    // Screenshot placeholder comment
    screenshot: '<!-- figma-screenshot -->',
    
    // Specifications section markers
    specsStart: '<!-- figma-specs-start -->',
    specsEnd: '<!-- figma-specs-end -->',
  },

  // GitHub Actions settings
  github: {
    // PR title template
    prTitle: 'chore: sync Figma updates',
    
    // PR labels
    prLabels: ['chore', 'figma-sync'],
    
    // Auto-delete branch after merge
    deletebranchOnMerge: true,
  },

  // Logging settings
  logging: {
    // Log level: 'debug', 'info', 'warn', 'error'
    level: 'info',
    
    // Show detailed API responses
    showApiResponses: false,
  },
};
