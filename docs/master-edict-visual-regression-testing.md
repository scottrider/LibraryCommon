# Master Agent Edict: Visual Regression Testing

## 🚨 MANDATORY COMPLIANCE NOTICE

**Status**: NON-NEGOTIABLE MASTER EDICT  
**Applies To**: ALL UI/CSS changes  
**Effective Date**: October 28, 2025  
**Authority**: Master Agent Configuration  
**Triggered By**: CSS restructuring breaking navigation and styling

## 📋 Executive Summary

This edict establishes **MANDATORY visual documentation and comparison** for all UI changes to prevent visual regressions and maintain historical records of interface evolution.

## 🏛️ The Law

### **VISUAL REGRESSION TESTING IS MANDATORY**

Every UI modification MUST include before/after visual documentation with explicit approval process for any visual changes.

## 🎯 Core Requirements

### **1. Screenshot Protocol**

#### **Timing Requirements**
- ✅ **BEFORE**: Capture baseline screenshots prior to any UI changes
- ✅ **AFTER**: Capture identical screenshots after modifications  
- ✅ **COMPARISON**: Generate side-by-side visual diff analysis
- ✅ **APPROVAL**: Explicit sign-off on visual changes required

#### **Scope Coverage**
- **Full Page Views**: Complete application pages
- **Component Level**: Individual UI components in isolation
- **Interactive States**: Default, hover, active, focus, error states
- **Navigation Elements**: Menus, sidebars, headers, footers
- **Form Elements**: Input fields, buttons, validation states

#### **Viewport Requirements**
- **Desktop**: 1920x1080 (primary development resolution)
- **Mobile**: 375x667 (iPhone standard)
- **Tablet**: 768x1024 (iPad standard) [when applicable]

#### **Browser Coverage**
- **Primary**: Chrome/Chromium (development browser)
- **Secondary**: Firefox, Safari, Edge [when cross-browser critical]

### **2. Historical Baseline System**

#### **Minimum Documentation**
- **3 Historical Reference Screenshots** minimum
- **Chronological progression** showing UI evolution
- **Annotated changes** with rationale documentation
- **Baseline comparison** against approved standards

#### **File Organization**
```
screenshots/
├── baseline/
│   ├── 2025-10-28-navigation-default.png
│   ├── 2025-10-28-navigation-mobile.png
│   └── 2025-10-28-job-search-desktop.png
├── current/
│   ├── 2025-10-28-navigation-after-css-refactor.png
│   └── 2025-10-28-job-search-after-css-refactor.png
├── diffs/
│   ├── 2025-10-28-navigation-comparison.png
│   └── 2025-10-28-job-search-comparison.png
└── approved/
    ├── 2025-10-28-navigation-approved.png
    └── 2025-10-28-job-search-approved.png
```

### **3. Automation Tools**

#### **Preferred Solutions**
- **Playwright**: Automated browser screenshot capture
- **Puppeteer**: Headless Chrome screenshot automation  
- **Visual Diff Tools**: Percy, Chromatic, BackstopJS
- **Browser DevTools**: Manual screenshot as fallback

#### **Manual Process** (when automation unavailable)
1. Open browser DevTools
2. Set viewport to standard sizes
3. Capture full-page screenshots
4. Save with consistent naming convention
5. Create manual visual comparison document

## ⚖️ Enforcement Mechanisms

### **Automatic Triggers**
- Any `.css` file modification
- HTML template changes affecting layout
- JavaScript modifications affecting UI state
- New component implementation
- Responsive design changes
- Color or typography modifications

### **Quality Gates**
- **PR Approval**: Cannot merge without visual regression report
- **Screenshot Requirement**: Before/after images mandatory
- **Visual Diff Analysis**: Side-by-side comparison required
- **Approval Documentation**: Signed-off visual changes

### **Violation Consequences**
- ❌ **Automatic PR rejection** without visual documentation
- ❌ **Deployment blocking** for unapproved visual changes
- ❌ **Code review failure** without screenshot comparison
- ❌ **Mandatory remediation** for broken layouts

## 🔧 Implementation Workflow

### **Pre-Change Protocol**
1. **Document Current State**
   - Capture baseline screenshots of all affected components
   - Note current functionality and visual appearance
   - Identify potential impact areas

2. **Prepare Comparison Plan**
   - Define specific components to monitor
   - Set viewport and browser testing requirements
   - Establish success criteria for visual changes

### **Post-Change Protocol**
1. **Capture New State**
   - Take identical screenshots using same settings
   - Test interactive states and responsive behavior
   - Document any intentional visual changes

2. **Generate Comparison**
   - Create side-by-side before/after images
   - Highlight differences and changes
   - Annotate intentional vs unintentional modifications

3. **Analysis and Approval**
   - Review layout and positioning integrity
   - Verify typography and color accuracy
   - Check spacing and alignment consistency
   - Test interactive element functionality
   - Confirm mobile responsiveness

## 📊 Visual Regression Checklist

### **Layout Verification**
- [ ] Header positioning and sizing
- [ ] Navigation menu functionality and appearance
- [ ] Sidebar behavior and styling
- [ ] Main content layout and spacing
- [ ] Footer positioning and content

### **Component Integrity**
- [ ] Button states and styling
- [ ] Form element appearance and validation
- [ ] Modal dialog positioning and backdrop
- [ ] Data grid layout and functionality
- [ ] Tab navigation and content switching

### **Responsive Behavior**
- [ ] Mobile navigation (hamburger menu)
- [ ] Tablet layout adaptations
- [ ] Text scaling and readability
- [ ] Image and media responsiveness
- [ ] Touch target sizing

### **Interactive States**
- [ ] Hover effects and transitions
- [ ] Focus management and indicators
- [ ] Active states and feedback
- [ ] Error states and messaging
- [ ] Loading states and spinners

## 🎯 Current Application Context

### **LibraryCommon CSS Refactoring Impact**
The recent modular CSS restructuring likely affected:
- ✋ **Navigation system** styling and behavior
- ✋ **Layout positioning** and spacing
- ✋ **Component styling** consistency
- ✋ **Responsive behavior** across viewports
- ✋ **Interactive states** and transitions

### **Immediate Action Required**
1. **Capture current broken state** for documentation
2. **Compare against historical working screenshots**
3. **Identify specific regression points**
4. **Create remediation plan** with visual targets
5. **Implement fixes with visual verification**

## 🚀 Benefits and Outcomes

### **Immediate Benefits**
- **Instant visual regression detection**
- **Clear before/after documentation**
- **Stakeholder visual approval process**
- **Reduced manual testing overhead**

### **Long-term Value**
- **Historical UI evolution tracking**
- **Design decision documentation**
- **Quality assurance automation**
- **Client presentation materials**

## 📝 Tools and Scripts

### **Quick Screenshot Commands**
```bash
# Playwright example
npx playwright screenshot --viewport=1920,1080 http://localhost:3000
npx playwright screenshot --viewport=375,667 http://localhost:3000

# Chrome DevTools Console
# Take full page screenshot: Ctrl+Shift+P -> "Capture full size screenshot"
```

### **Visual Diff Tools**
- **Online**: img.ly/blog/image-compare-tool
- **CLI**: pixelmatch, looks-same
- **GUI**: Beyond Compare, Kaleidoscope

## ⚖️ Authority and Compliance

This visual regression testing requirement is established at the **Master Agent level** and is **NON-NEGOTIABLE**. It applies to all current and future UI development work.

**Any UI change without proper visual documentation will result in automatic rejection and mandatory remediation.**

---

*Master Agent Edict established October 28, 2025*  
*Authority: LibraryCommon Master Agent Configuration*  
*Triggered by: CSS refactoring breaking navigation styling*