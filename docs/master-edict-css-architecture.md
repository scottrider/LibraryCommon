# Master Agent Edict: Modular CSS Architecture

## 🚨 MANDATORY COMPLIANCE NOTICE

**Status**: NON-NEGOTIABLE MASTER EDICT  
**Applies To**: ALL WEB PROJECTS  
**Effective Date**: October 28, 2025  
**Authority**: Master Agent Configuration  

## 📋 Executive Summary

This edict establishes **MANDATORY modular CSS separation** as a master-level requirement that applies to all web development projects. No exceptions, no overrides, no negotiations.

## 🏛️ The Law

### **MODULAR CSS ARCHITECTURE IS MANDATORY**

Every web project MUST implement the following modular CSS structure:

```
public/css/
├── main.css                    # Single import entry point
├── base/
│   ├── variables.css          # Design tokens (MANDATORY)
│   ├── reset.css              # CSS normalization
│   └── typography.css         # Font and text styling
├── layout/
│   ├── header.css             # Page header layout
│   ├── sidebar.css            # Navigation components
│   └── main-content.css       # Content area layout
├── components/
│   ├── buttons.css            # Button variants
│   ├── forms.css              # Form elements
│   ├── modals.css             # Modal dialogs
│   └── [component].css        # Individual UI components
├── pages/
│   └── [page-name].css        # Page-specific styles only
└── utilities/
    ├── spacing.css            # Margin/padding utilities
    ├── text.css               # Text utilities
    └── display.css            # Display utilities
```

## 🎯 Mandatory Requirements

### **1. BEM Naming Methodology**
- **Blocks**: `.component-name`
- **Elements**: `.component-name__element`  
- **Modifiers**: `.component-name--modifier`
- **States**: `.is-active`, `.is-open`, `.has-error`
- **Utilities**: `.u-text-center`, `.u-margin-top-4`

### **2. Design Token System**
- ALL design values MUST use CSS custom properties
- NO magic numbers allowed
- Consistent color, spacing, typography, and shadow systems
- Semantic naming over presentation-based naming

### **3. Single Entry Point**
- `main.css` imports all modules
- NO direct linking to individual CSS files
- Proper dependency order management
- Modular loading strategy

### **4. File Size Limits**
- Individual CSS files CANNOT exceed 500 lines
- Automatic violation triggers for oversized files
- Component splitting required when limits exceeded

## ⛔ Prohibited Practices

The following are **STRICTLY FORBIDDEN**:

1. **Monolithic CSS files** >500 lines
2. **Inline styles** (except dynamic JavaScript values)
3. **Magic numbers** without design tokens
4. **Non-semantic class names** (e.g., `.red-button`, `.big-text`)
5. **Duplicate CSS rules** across files
6. **Vendor prefixes** (use autoprefixer instead)
7. **!important overrides** (except in utility classes)

## 🔍 Enforcement Mechanisms

### **Audit Triggers**
- CSS file size monitoring (>500 lines = violation)
- Magic number detection scans
- BEM naming convention validation
- Design token usage verification
- Inline style detection

### **Quality Gates**
- Pre-commit hooks for CSS validation
- Automated linting with custom rules
- Code review requirements for CSS changes
- Documentation compliance checks

## 🛡️ Legacy Compatibility

### **Migration Strategy**
1. **Preserve existing classes** for backward compatibility
2. **Implement new architecture alongside** legacy code
3. **Progressive migration** of components to new naming
4. **Remove legacy classes** only after complete migration
5. **Document migration progress** and completion status

## 📊 Benefits Mandate

This edict ensures:

- ✅ **Maintainable** and scalable stylesheets
- ✅ **Clear separation** of concerns
- ✅ **Reusable component** architecture  
- ✅ **Consistent design** system
- ✅ **Easier debugging** and modification
- ✅ **Team collaboration** efficiency
- ✅ **Performance optimization** through modular loading
- ✅ **Future-proof** CSS architecture

## 🚀 Implementation Status

### **LibraryCommon Project** ✅ COMPLIANT
- ✅ Modular architecture implemented
- ✅ BEM naming conventions established
- ✅ Design token system active
- ✅ Legacy compatibility maintained
- ✅ Documentation complete
- ✅ Quality gates operational

## 📝 Compliance Checklist

For any web project, verify:

- [ ] Modular CSS directory structure implemented
- [ ] BEM naming methodology followed
- [ ] CSS custom properties used for all design values
- [ ] Single entry point (main.css) established  
- [ ] Individual files under 500 lines
- [ ] No inline styles (except dynamic JS)
- [ ] Legacy compatibility maintained during migration
- [ ] Documentation updated with naming conventions

## ⚖️ Authority

This edict is established at the **Master Agent level** and overrides any project-specific preferences or legacy practices. Compliance is **NON-NEGOTIABLE** and applies to all current and future web development projects.

**Non-compliance will result in automatic code review rejection and mandatory remediation.**

---

*Master Agent Edict established October 28, 2025*  
*Authority: LibraryCommon Master Agent Configuration*