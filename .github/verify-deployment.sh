#!/bin/bash

# Figma Sync Deployment Checklist
# Run this script to verify everything is ready for deployment

set -e

echo "=================================================="
echo "  Figma Sync - Deployment Verification"
echo "=================================================="
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_file() {
  local file=$1
  local description=$2
  
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $description"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $description"
    echo "  File not found: $file"
    ((CHECKS_FAILED++))
  fi
}

check_directory() {
  local dir=$1
  local description=$2
  
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓${NC} $description"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $description"
    echo "  Directory not found: $dir"
    ((CHECKS_FAILED++))
  fi
}

check_content() {
  local file=$1
  local pattern=$2
  local description=$3
  
  if grep -q "$pattern" "$file" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} $description"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $description"
    echo "  Pattern not found in: $file"
    ((CHECKS_FAILED++))
  fi
}

echo "Checking file structure..."
echo ""

check_directory ".github" "Directory .github exists"
check_directory ".github/workflows" "Directory .github/workflows exists"
check_directory ".github/scripts" "Directory .github/scripts exists"

echo ""
echo "Checking workflow file..."
echo ""

check_file ".github/workflows/sync-figma.yml" "Workflow file exists"
check_content ".github/workflows/sync-figma.yml" "name: Sync Figma Screenshots and Specs" "Workflow has correct name"
check_content ".github/workflows/sync-figma.yml" "cron:" "Workflow has schedule trigger"
check_content ".github/workflows/sync-figma.yml" "workflow_dispatch:" "Workflow has manual trigger"
check_content ".github/workflows/sync-figma.yml" "ubuntu-latest" "Workflow uses ubuntu-latest runner"
check_content ".github/workflows/sync-figma.yml" "peter-evans/create-pull-request" "Workflow uses create-pull-request action"

echo ""
echo "Checking script files..."
echo ""

check_file ".github/scripts/sync-figma.js" "Main sync script exists"
check_file ".github/scripts/test-sync.js" "Test script exists"
check_file ".github/scripts/figma-sync.config.js" "Configuration template exists"

echo ""
echo "Checking documentation files..."
echo ""

check_file ".github/QUICKSTART.md" "Quick start guide exists"
check_file ".github/FIGMA_SYNC_README.md" "Full documentation exists"
check_file ".github/SECRETS_SETUP.md" "Secrets setup guide exists"
check_file ".github/TROUBLESHOOTING.md" "Troubleshooting guide exists"
check_file ".github/IMPLEMENTATION_COMPLETE.md" "Implementation summary exists"
check_file ".github/EXAMPLE_COMPONENT.mdx" "Example component exists"

echo ""
echo "Checking configuration files..."
echo ""

check_file "package.json" "package.json exists"
check_content "package.json" "sync:figma" "package.json has npm script"

echo ""
echo "Checking script permissions..."
echo ""

if [ -x ".github/scripts/sync-figma.js" ]; then
  echo -e "${GREEN}✓${NC} sync-figma.js is executable"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}ℹ${NC} sync-figma.js is not executable (this is OK for GitHub Actions)"
  ((CHECKS_PASSED++))
fi

echo ""
echo "Checking Node.js readiness..."
echo ""

if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo -e "${GREEN}✓${NC} Node.js is installed ($NODE_VERSION)"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}ℹ${NC} Node.js not installed locally (required for local testing)"
fi

echo ""
echo "Checking git status..."
echo ""

if [ -d ".git" ]; then
  echo -e "${GREEN}✓${NC} Repository is a Git repository"
  ((CHECKS_PASSED++))
  
  if [ -z "$(git status --short)" ]; then
    echo -e "${GREEN}✓${NC} Git working directory is clean"
    ((CHECKS_PASSED++))
  else
    echo -e "${YELLOW}ℹ${NC} Git working directory has uncommitted changes"
  fi
else
  echo -e "${RED}✗${NC} Not a Git repository"
  ((CHECKS_FAILED++))
fi

echo ""
echo "=================================================="
echo "  Deployment Check Results"
echo "=================================================="
echo ""

echo "Checks passed: ${GREEN}$CHECKS_PASSED${NC}"
echo "Checks failed: ${RED}$CHECKS_FAILED${NC}"

echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Push changes to your repository"
  echo "  2. Go to GitHub Settings → Secrets → Add FIGMA_API_TOKEN"
  echo "  3. Go to Actions → Run workflow"
  echo "  4. Check logs and review PR"
  echo ""
  exit 0
else
  echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
  echo ""
  exit 1
fi
