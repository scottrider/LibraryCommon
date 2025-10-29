// Navigation Module
// Handles sidebar toggle, navigation interactions, and menu functionality

class NavigationManager {
    constructor() {
        this.sidebar = null;
        this.hamburger = null;
        this.content = null;
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
    }
    
    setupNavigation() {
        this.sidebar = document.getElementById('sidebar');
        this.hamburger = document.querySelector('.hamburger');
        this.content = document.querySelector('.main-content');
        this.overlay = document.querySelector('.sidebar-overlay');
        
        // Create overlay if it doesn't exist
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'sidebar-overlay';
            document.body.appendChild(this.overlay);
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('Navigation initialized');
    }
    
    setupEventListeners() {
        // Escape key to close sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebar && this.sidebar.classList.contains('is-open')) {
                this.closeSidebar();
            }
        });
        
        // Click outside sidebar to close (overlay click)
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
        
        // Click outside sidebar to close (document click)
        document.addEventListener('click', (e) => {
            if (this.sidebar && this.sidebar.classList.contains('is-open')) {
                // Don't close if clicking on sidebar, hamburger, or any navigation buttons
                if (!this.sidebar.contains(e.target) && 
                    !this.hamburger.contains(e.target) &&
                    !e.target.closest('.hamburger-column')) {
                    this.closeSidebar();
                }
            }
        });
        
        // Prevent navigation button clicks from propagating to document
        if (this.sidebar) {
            this.sidebar.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Prevent hamburger column clicks from propagating to document
        const hamburgerColumn = document.querySelector('.hamburger-column');
        if (hamburgerColumn) {
            hamburgerColumn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    toggleSidebar() {
        if (!this.sidebar) return;
        
        const isOpen = this.sidebar.classList.contains('is-open');
        
        if (isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
    
    openSidebar() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.add('is-open');
        this.hamburger?.classList.add('is-active');
        this.content?.classList.add('sidebar-open');
        this.overlay?.classList.add('is-visible');
        
        // Set focus to first navigation button for accessibility
        const firstBtn = this.sidebar.querySelector('.navigation__button');
        if (firstBtn) {
            setTimeout(() => firstBtn.focus(), 300);
        }
    }
    
    closeSidebar() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.remove('is-open');
        this.hamburger?.classList.remove('is-active');
        this.content?.classList.remove('sidebar-open');
        this.overlay?.classList.remove('is-visible');
    }
    
    navigateToSection(sectionName, element) {
        // Update active state for navigation buttons
        document.querySelectorAll('.navigation__button').forEach(button => {
            button.classList.remove('active');
        });
        
        if (element) {
            element.classList.add('active');
        }
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
        
        console.log('Navigated to:', sectionName);
    }
}

// Global function for compatibility with inline handlers
function toggleSidebar() {
    if (window.navigationManager) {
        window.navigationManager.toggleSidebar();
    }
}

function navigateToSection(sectionName, element) {
    if (window.navigationManager) {
        window.navigationManager.navigateToSection(sectionName, element);
    }
}

// Initialize navigation manager
window.navigationManager = new NavigationManager();