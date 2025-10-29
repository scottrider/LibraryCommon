// Search Module
// Handles search functionality with debouncing and filtering

class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchTimeout = null;
        this.debounceDelay = 300; // 300ms debounce
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSearch());
        } else {
            this.setupSearch();
        }
    }
    
    setupSearch() {
        this.searchInput = document.querySelector('.search-input');
        
        if (this.searchInput) {
            this.setupEventListeners();
            console.log('Search initialized with debounce delay:', this.debounceDelay + 'ms');
        }
    }
    
    setupEventListeners() {
        // Debounced search input
        this.searchInput.addEventListener('input', (e) => {
            this.debouncedSearch(e.target.value);
        });
        
        // Enter key to trigger immediate search
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.clearSearchTimeout();
                this.performSearch(e.target.value);
            }
        });
        
        // Search button click
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.clearSearchTimeout();
                this.performSearch(this.searchInput.value);
            });
        }
    }
    
    debouncedSearch(query) {
        this.clearSearchTimeout();
        
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, this.debounceDelay);
    }
    
    clearSearchTimeout() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
    }
    
    performSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length === 0) {
            this.clearSearch();
            return;
        }
        
        console.log('Performing search for:', trimmedQuery);
        
        // Add search functionality based on current page context
        const currentPage = this.getCurrentPageContext();
        
        switch (currentPage) {
            case 'jobsearch':
                this.searchPositions(trimmedQuery);
                break;
            case 'projects':
                this.searchProjects(trimmedQuery);
                break;
            default:
                this.globalSearch(trimmedQuery);
        }
    }
    
    getCurrentPageContext() {
        // Determine current page based on URL or active content
        const path = window.location.pathname;
        const activeContent = document.querySelector('.tab-pane.active');
        
        if (path.includes('jobsearch') || activeContent?.id === 'positions-tab') {
            return 'jobsearch';
        } else if (path.includes('projects')) {
            return 'projects';
        }
        
        return 'global';
    }
    
    searchPositions(query) {
        const positionsTable = document.getElementById('positions-grid');
        if (!positionsTable) return;
        
        const rows = positionsTable.querySelectorAll('tbody tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = text.includes(query.toLowerCase());
            
            row.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount++;
        });
        
        this.showSearchResults('positions', visibleCount, rows.length);
    }
    
    searchProjects(query) {
        // Implement project search when projects module is available
        console.log('Project search not yet implemented');
    }
    
    globalSearch(query) {
        // Implement global search across all content
        console.log('Global search for:', query);
        
        // Could search navigation items, page content, etc.
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            const parent = link.closest('.nav-item');
            
            if (text.includes(query.toLowerCase())) {
                parent.style.display = '';
                link.style.backgroundColor = 'rgba(52, 152, 219, 0.3)';
            } else {
                parent.style.display = 'none';
                link.style.backgroundColor = '';
            }
        });
    }
    
    clearSearch() {
        console.log('Clearing search');
        
        // Reset table rows visibility
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = '';
        });
        
        // Reset navigation highlighting
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const parent = link.closest('.nav-item');
            parent.style.display = '';
            link.style.backgroundColor = '';
        });
        
        this.hideSearchResults();
    }
    
    showSearchResults(context, visibleCount, totalCount) {
        // Create or update search results indicator
        let resultsEl = document.getElementById('search-results');
        
        if (!resultsEl) {
            resultsEl = document.createElement('div');
            resultsEl.id = 'search-results';
            resultsEl.className = 'search-results';
            
            const searchControl = document.querySelector('.search-control');
            if (searchControl) {
                searchControl.appendChild(resultsEl);
            }
        }
        
        resultsEl.textContent = `${visibleCount} of ${totalCount} results`;
        resultsEl.style.display = 'block';
    }
    
    hideSearchResults() {
        const resultsEl = document.getElementById('search-results');
        if (resultsEl) {
            resultsEl.style.display = 'none';
        }
    }
}

// Initialize search manager
window.searchManager = new SearchManager();