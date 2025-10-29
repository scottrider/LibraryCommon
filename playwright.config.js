import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Visual Regression Testing
 * 
 * Master Agent Edict Compliance: This configuration ensures
 * consistent screenshot capture across all UI testing scenarios.
 */

export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video recording */
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Consistent viewport for visual regression
        viewport: { width: 1920, height: 1080 },
        // Use external browser, not VSCode Simple Browser
        headless: false,
        launchOptions: {
          // Force external browser window
          slowMo: 100
        }
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 }
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 375, height: 667 }
      },
    },

    /* Test against tablet viewports. */
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad'],
        viewport: { width: 768, height: 1024 }
      },
    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  },
  
  /* Visual regression testing specific settings */
  expect: {
    // Global timeout for expectations
    timeout: 10000,
    
    // Visual comparison settings
    toHaveScreenshot: {
      // Sensitivity for visual comparisons (0-1, lower = more sensitive)
      threshold: 0.3,
      
      // Animation handling
      animations: 'disabled',
      
      // Clip settings for consistent cropping
      mode: 'strict'
    }
  },
  
  /* Global test timeout */
  timeout: 60000,
  
  /* Global setup files */
  globalSetup: undefined,
  globalTeardown: undefined
});