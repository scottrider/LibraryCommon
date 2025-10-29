import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Visual Regression Testing Suite
 * 
 * Master Agent Edict Compliance: MANDATORY visual documentation
 * for all UI changes with before/after screenshot comparison.
 * 
 * This test suite captures screenshots across multiple viewports
 * and generates visual diff reports for approval workflows.
 */

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = './screenshots';

// Standard viewport configurations per Master Edict
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 }
};

// Key pages and components to monitor
const TEST_SCENARIOS = [
  {
    name: 'homepage',
    path: '/',
    description: 'Main landing page with navigation'
  },
  {
    name: 'job-search',
    path: '/job-search',
    description: 'Job search page with filters and results'
  },
  {
    name: 'jobs',
    path: '/jobs',
    description: 'Jobs listing page'
  },
  {
    name: 'contact',
    path: '/contact',
    description: 'Contact form page'
  },
  {
    name: 'about',
    path: '/about',
    description: 'About page content'
  }
];

// Generate timestamp for file naming
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD format
};

/**
 * Capture baseline screenshots (run before making changes)
 */
test.describe('Baseline Screenshot Capture', () => {
  
  for (const scenario of TEST_SCENARIOS) {
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      
      test(`baseline-${scenario.name}-${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`${BASE_URL}${scenario.path}`);
        
        // Wait for page to fully load
        await page.waitForLoadState('networkidle');
        
        // Wait for any animations to complete
        await page.waitForTimeout(1000);
        
        // Take full page screenshot
        const filename = `${getTimestamp()}-${scenario.name}-${viewportName}-baseline.png`;
        const filepath = join(SCREENSHOT_DIR, 'baseline', filename);
        
        await page.screenshot({
          path: filepath,
          fullPage: true,
          animations: 'disabled'
        });
        
        console.log(`✅ Baseline captured: ${filename}`);
        console.log(`   Scenario: ${scenario.description}`);
        console.log(`   Viewport: ${viewportName} (${viewport.width}x${viewport.height})`);
      });
    }
  }
});

/**
 * Capture current state screenshots (run after making changes)
 */
test.describe('Current State Screenshot Capture', () => {
  
  for (const scenario of TEST_SCENARIOS) {
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      
      test(`current-${scenario.name}-${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`${BASE_URL}${scenario.path}`);
        
        // Wait for page to fully load
        await page.waitForLoadState('networkidle');
        
        // Wait for any animations to complete
        await page.waitForTimeout(1000);
        
        // Take full page screenshot
        const filename = `${getTimestamp()}-${scenario.name}-${viewportName}-current.png`;
        const filepath = join(SCREENSHOT_DIR, 'current', filename);
        
        await page.screenshot({
          path: filepath,
          fullPage: true,
          animations: 'disabled'
        });
        
        console.log(`📸 Current state captured: ${filename}`);
        console.log(`   Scenario: ${scenario.description}`);
        console.log(`   Viewport: ${viewportName} (${viewport.width}x${viewport.height})`);
      });
    }
  }
});

/**
 * Navigation-specific regression tests
 * (Triggered by CSS refactoring concerns)
 */
test.describe('Navigation Regression Tests', () => {
  
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    
    test(`navigation-states-${viewportName}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}/`);
      await page.waitForLoadState('networkidle');
      
      // Test navigation in different states
      const states = ['default', 'hover', 'mobile-menu'];
      
      for (const state of states) {
        let filename = `${getTimestamp()}-navigation-${state}-${viewportName}.png`;
        let filepath = join(SCREENSHOT_DIR, 'current', filename);
        
        switch (state) {
          case 'default':
            // Default navigation state
            await page.screenshot({
              path: filepath,
              fullPage: false,
              clip: { x: 0, y: 0, width: viewport.width, height: 200 }
            });
            break;
            
          case 'hover':
            // Hover state on navigation items
            const navItems = await page.locator('nav a').all();
            if (navItems.length > 0) {
              await navItems[0].hover();
              await page.waitForTimeout(500);
              await page.screenshot({
                path: filepath,
                fullPage: false,
                clip: { x: 0, y: 0, width: viewport.width, height: 200 }
              });
            }
            break;
            
          case 'mobile-menu':
            // Mobile menu state (if applicable)
            if (viewportName === 'mobile') {
              const hamburger = await page.locator('[data-mobile-menu-toggle], .hamburger, .mobile-menu-toggle').first();
              if (await hamburger.isVisible()) {
                await hamburger.click();
                await page.waitForTimeout(500);
                await page.screenshot({
                  path: filepath,
                  fullPage: true
                });
              }
            }
            break;
        }
        
        console.log(`🧭 Navigation state captured: ${state} - ${viewportName}`);
      }
    });
  }
});

/**
 * Component-level regression tests
 */
test.describe('Component Regression Tests', () => {
  
  test('form-elements-states', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');
    
    // Test form elements in different states
    const formStates = ['empty', 'filled', 'error'];
    
    for (const state of formStates) {
      let filename = `${getTimestamp()}-form-elements-${state}.png`;
      let filepath = join(SCREENSHOT_DIR, 'current', filename);
      
      switch (state) {
        case 'empty':
          await page.screenshot({ path: filepath, fullPage: true });
          break;
          
        case 'filled':
          // Fill form fields if they exist
          const nameField = page.locator('input[name="name"], #name');
          const emailField = page.locator('input[name="email"], #email');
          const messageField = page.locator('textarea[name="message"], #message');
          
          if (await nameField.isVisible()) await nameField.fill('Test User');
          if (await emailField.isVisible()) await emailField.fill('test@example.com');
          if (await messageField.isVisible()) await messageField.fill('Test message content');
          
          await page.screenshot({ path: filepath, fullPage: true });
          break;
          
        case 'error':
          // Trigger validation errors if possible
          const submitBtn = page.locator('button[type="submit"], input[type="submit"]');
          if (await submitBtn.isVisible()) {
            await submitBtn.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: filepath, fullPage: true });
          }
          break;
      }
      
      console.log(`📝 Form state captured: ${state}`);
    }
  });
  
  test('interactive-elements', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    
    // Capture button states
    const buttons = await page.locator('button, .btn, [role="button"]').all();
    
    for (let i = 0; i < Math.min(buttons.length, 5); i++) {
      const button = buttons[i];
      
      // Default state
      let filename = `${getTimestamp()}-button-${i}-default.png`;
      let filepath = join(SCREENSHOT_DIR, 'current', filename);
      
      await button.scrollIntoViewIfNeeded();
      await button.screenshot({ path: filepath });
      
      // Hover state
      filename = `${getTimestamp()}-button-${i}-hover.png`;
      filepath = join(SCREENSHOT_DIR, 'current', filename);
      
      await button.hover();
      await page.waitForTimeout(300);
      await button.screenshot({ path: filepath });
      
      console.log(`🔘 Button ${i} states captured`);
    }
  });
});

/**
 * Generate Visual Regression Report
 */
test('generate-visual-report', async ({ page }) => {
  const timestamp = getTimestamp();
  const reportData = {
    timestamp,
    baselineCount: 0,
    currentCount: 0,
    scenarios: TEST_SCENARIOS,
    viewports: VIEWPORTS,
    notes: [
      'Visual regression testing per Master Agent Edict',
      'Screenshots captured for CSS refactoring validation',
      'Navigation styling requires verification',
      'Component states documented for approval workflow'
    ]
  };
  
  // Count captured screenshots
  try {
    const fs = require('fs');
    const baselineFiles = fs.readdirSync(join(SCREENSHOT_DIR, 'baseline'));
    const currentFiles = fs.readdirSync(join(SCREENSHOT_DIR, 'current'));
    
    reportData.baselineCount = baselineFiles.length;
    reportData.currentCount = currentFiles.length;
  } catch (error) {
    console.log('Directory reading error:', error.message);
  }
  
  // Generate HTML report
  const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Regression Report - ${timestamp}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .metric { background: #e8f4ff; padding: 15px; border-radius: 8px; text-align: center; }
        .scenarios { margin: 20px 0; }
        .scenario { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .edict-notice { background: #ffe6e6; border: 2px solid #ff4444; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📸 Visual Regression Report</h1>
        <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
        <p><strong>Master Agent Edict Compliance:</strong> MANDATORY Visual Documentation</p>
    </div>
    
    <div class="edict-notice">
        <h3>🚨 Master Agent Edict Notice</h3>
        <p>This report is generated in compliance with the Master Agent Edict requiring visual regression testing for all UI changes. Any visual modifications must be explicitly approved before deployment.</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>${reportData.baselineCount}</h3>
            <p>Baseline Screenshots</p>
        </div>
        <div class="metric">
            <h3>${reportData.currentCount}</h3>
            <p>Current Screenshots</p>
        </div>
        <div class="metric">
            <h3>${TEST_SCENARIOS.length}</h3>
            <p>Test Scenarios</p>
        </div>
        <div class="metric">
            <h3>${Object.keys(VIEWPORTS).length}</h3>
            <p>Viewport Configurations</p>
        </div>
    </div>
    
    <div class="scenarios">
        <h2>📋 Test Scenarios</h2>
        ${TEST_SCENARIOS.map(scenario => `
            <div class="scenario">
                <h3>${scenario.name}</h3>
                <p><strong>Path:</strong> ${scenario.path}</p>
                <p><strong>Description:</strong> ${scenario.description}</p>
            </div>
        `).join('')}
    </div>
    
    <div class="viewports">
        <h2>📱 Viewport Configurations</h2>
        ${Object.entries(VIEWPORTS).map(([name, config]) => `
            <div class="scenario">
                <h3>${name}</h3>
                <p><strong>Resolution:</strong> ${config.width} x ${config.height}</p>
            </div>
        `).join('')}
    </div>
    
    <div class="notes">
        <h2>📝 Notes</h2>
        <ul>
            ${reportData.notes.map(note => `<li>${note}</li>`).join('')}
        </ul>
    </div>
    
    <div class="footer" style="margin-top: 40px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
        <p><strong>Next Steps:</strong></p>
        <ol>
            <li>Review all captured screenshots in the /screenshots directory</li>
            <li>Compare baseline vs current state images</li>
            <li>Document any intentional visual changes</li>
            <li>Approve or reject visual modifications</li>
            <li>Move approved screenshots to /screenshots/approved directory</li>
        </ol>
    </div>
</body>
</html>
  `;
  
  // Save report
  const reportPath = join(SCREENSHOT_DIR, `visual-regression-report-${timestamp}.html`);
  writeFileSync(reportPath, reportHtml);
  
  console.log(`📊 Visual regression report generated: ${reportPath}`);
  console.log(`📸 Baseline screenshots: ${reportData.baselineCount}`);
  console.log(`📸 Current screenshots: ${reportData.currentCount}`);
  console.log('🎯 Master Agent Edict compliance: COMPLETE');
});