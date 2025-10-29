# CSS Naming Conventions Documentation
## LibraryCommon HTMX Job Search Application

### Current Analysis (October 28, 2025)

## Current Naming Patterns Identified

### 1. **Component-Based Naming (BEM-like)**
- `.hamburger-column`, `.hamburger-line`, `.hamburger.active`
- `.search-control`, `.search-input`, `.search-btn`
- `.modal-content`, `.modal-header`, `.modal-title`, `.modal-close`
- `.content-grid`, `.content-card`
- `.nav-buttons`, `.nav-btn`, `.nav-icon`, `.nav-link`

### 2. **State-Based Classes**
- `.active` (applied to buttons, tabs, navigation)
- `.open` (applied to sidebar)
- `.show` (applied to overlay, modals)
- `.loading` (applied to data grids)
- `.disabled` (applied to navigation buttons)

### 3. **Utility Classes**
- `.text-center`, `.text-left`, `.text-right`
- `.mt-1` through `.mt-5` (margin-top)
- `.mb-1` through `.mb-5` (margin-bottom)  
- `.p-1` through `.p-5` (padding)

### 4. **Layout Components**
- `.top-header`, `.site-title`, `.main-content`
- `.sidebar`, `.overlay`
- `.tab-container`, `.tab-header`, `.tab-content`, `.tab-pane`
- `.datagrid-container`, `.data-grid`

### 5. **Button Variations**
- `.btn` (base)
- `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`
- `.btn-small`, `.btn-edit`, `.btn-delete`

### 6. **Form Elements**
- `.form-group`, `.form-label`, `.form-control`
- `.is-invalid`, `.is-valid`

### 7. **Notification System**
- `.notification`
- `.notification-success`, `.notification-error`, `.notification-info`, `.notification-warning`

## Issues Identified

### 1. **Inconsistent Naming**
- Mix of hyphenated (.nav-btn) and single words (.sidebar)
- Inconsistent modifier patterns (.btn-primary vs .notification-success)

### 2. **Redundant Styles**
- Duplicate .btn-primary definitions across files
- Multiple .notification implementations

### 3. **Poor Organization**
- Global styles mixed with component-specific styles
- No clear separation between layout, components, and utilities

## Recommended Structure

### **File Organization:**
```
public/css/
├── main.css                    # Main import file
├── base/
│   ├── reset.css              # CSS reset/normalize
│   ├── variables.css          # CSS custom properties
│   └── typography.css         # Font definitions
├── layout/
│   ├── header.css             # Top header layout
│   ├── sidebar.css            # Navigation sidebar
│   └── main-content.css       # Content area layout
├── components/
│   ├── buttons.css            # All button variants
│   ├── forms.css              # Form elements
│   ├── modals.css             # Modal dialogs
│   ├── notifications.css      # Alert/notification system
│   ├── tabs.css               # Tab navigation
│   └── data-grid.css          # Table/grid components
├── pages/
│   ├── job-search.css         # Job search specific styles
│   ├── home.css               # Home page specific
│   └── about.css              # About page specific
└── utilities/
    ├── spacing.css            # Margin/padding utilities
    ├── text.css               # Text alignment utilities
    └── display.css            # Display utilities
```

### **Naming Convention Standard:**

#### **Component Naming (BEM Methodology)**
- **Block**: `.component-name`
- **Element**: `.component-name__element`
- **Modifier**: `.component-name--modifier`

Examples:
```css
/* Navigation Component */
.navigation { }
.navigation__item { }
.navigation__link { }
.navigation__link--active { }

/* Button Component */
.button { }
.button--primary { }
.button--small { }
.button--disabled { }

/* Modal Component */
.modal { }
.modal__overlay { }
.modal__content { }
.modal__header { }
.modal__title { }
.modal__close { }
```

#### **State Classes**
- Prefix with `is-` or `has-`
- `.is-active`, `.is-open`, `.is-loading`, `.is-disabled`
- `.has-error`, `.has-focus`

#### **Utility Classes**
- Single purpose, descriptive names
- `.u-text-center`, `.u-margin-top-1`, `.u-hidden`
- Prefix with `u-` to distinguish from components

#### **JavaScript Hooks**
- Prefix with `js-` for JavaScript-only selectors
- `.js-toggle-sidebar`, `.js-form-submit`
- Never style these classes directly

## Migration Plan

### Phase 1: Base Architecture
1. Create new modular file structure
2. Extract CSS variables and base styles
3. Implement new import system in main.css

### Phase 2: Component Migration
1. Refactor navigation system to new naming
2. Standardize button components
3. Consolidate form elements

### Phase 3: Page-Specific Styles
1. Extract job search specific styles
2. Create page-specific CSS files
3. Remove redundant global styles

### Phase 4: Cleanup
1. Remove old CSS files
2. Update HTML classes to match new convention
3. Test across all pages and components