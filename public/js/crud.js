// CRUD Module
// Handles Create, Read, Update, Delete operations for job search data

class CRUDManager {
    constructor() {
        this.apiBaseUrl = 'http://127.0.0.1:8000';
        this.companies = [];
        this.contactTypes = [];
        this.positionStatuses = [];
        this.positionsData = [];
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCRUD());
        } else {
            this.setupCRUD();
        }
    }
    
    setupCRUD() {
        this.setupTabSwitching();
        this.loadAllData();
        console.log('CRUD Manager initialized');
    }
    
    setupTabSwitching() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                
                // Remove active from all tabs and buttons
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                // Add active to clicked button and corresponding pane
                this.classList.add('active');
                document.getElementById(tabName + '-tab').classList.add('active');
            });
        });
    }
    
    // API Helper Functions
    async fetchAPI(endpoint) {
        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API fetch error:', error);
            return [];
        }
    }
    
    async postAPI(endpoint, data) {
        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API post error:', error);
            throw error;
        }
    }
    
    async putAPI(endpoint, data) {
        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API put error:', error);
            throw error;
        }
    }
    
    async deleteAPI(endpoint) {
        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API delete error:', error);
            throw error;
        }
    }
    
    // Data Loading
    async loadAllData() {
        try {
            this.companies = await this.fetchAPI('/companies');
            this.contactTypes = await this.fetchAPI('/contact-types');
            this.positionStatuses = await this.fetchAPI('/position-statuses');
            this.positionsData = await this.fetchAPI('/positions');
            this.loadPositionsData();
        } catch (error) {
            console.error('Failed to load data:', error);
            this.showNotification('Unable to connect to API. Please ensure the Python backend is running.', 'error');
        }
    }
    
    loadPositionsData() {
        this.renderPositionsTable();
    }
    
    renderPositionsTable() {
        const tbody = document.getElementById('positions-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.positionsData.map(row => `
            <tr data-id="${row.id}">
                <td>
                    <select onchange="crudManager.updatePosition(${row.id}, 'companyId', this.value)">
                        ${this.companies.map(company => 
                            `<option value="${company.id}" ${row.companyId === company.id ? 'selected' : ''}>${company.name}</option>`
                        ).join('')}
                    </select>
                </td>
                <td contenteditable="true" onblur="crudManager.updatePosition(${row.id}, 'position', this.textContent)">${row.position}</td>
                <td>${row.initialContactDate}</td>
                <td>
                    <input type="date" value="${row.lastContactDate}" 
                           onchange="crudManager.updatePosition(${row.id}, 'lastContactDate', this.value)">
                </td>
                <td>
                    <select onchange="crudManager.updatePosition(${row.id}, 'contactTypeId', this.value)">
                        ${this.contactTypes.map(type => 
                            `<option value="${type.id}" ${row.contactTypeId === type.id ? 'selected' : ''}>${type.name}</option>`
                        ).join('')}
                    </select>
                </td>
                <td>
                    <select onchange="crudManager.updatePosition(${row.id}, 'statusId', this.value)">
                        ${this.positionStatuses.map(status => 
                            `<option value="${status.id}" ${row.statusId === status.id ? 'selected' : ''}>${status.name}</option>`
                        ).join('')}
                    </select>
                </td>
                <td>
                    <button class="btn-small btn-edit" onclick="crudManager.savePosition(${row.id})">Save</button>
                    <button class="btn-small btn-delete" onclick="crudManager.deletePosition(${row.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }
    
    // CRUD Operations
    async addNewPosition() {
        try {
            this.showNotification('Creating new position...', 'info');
            
            const newPositionData = {
                companyId: this.companies[0]?.id || 1,
                position: 'New Position',
                lastContactDate: new Date().toISOString().split('T')[0],
                contactTypeId: this.contactTypes[0]?.id || 1,
                statusId: this.positionStatuses[0]?.id || 1
            };
            
            const newPosition = await this.postAPI('/positions', newPositionData);
            this.positionsData.push(newPosition);
            this.renderPositionsTable();
            
            this.showNotification('Position created successfully!', 'success');
            
            setTimeout(() => {
                const newRow = document.querySelector(`tr[data-id="${newPosition.id}"]`);
                const positionCell = newRow.querySelector('td[contenteditable="true"]');
                positionCell.focus();
                positionCell.select();
            }, 100);
        } catch (error) {
            this.showNotification('Failed to create position', 'error');
        }
    }
    
    async updatePosition(id, field, value) {
        try {
            const position = this.positionsData.find(p => p.id === id);
            if (position) {
                const updateData = {};
                updateData[field] = field.includes('Id') ? parseInt(value) : value;
                
                const updatedPosition = await this.putAPI(`/positions/${id}`, updateData);
                
                // Update local data
                Object.assign(position, updatedPosition);
                console.log('Updated position:', position);
            }
        } catch (error) {
            this.showNotification('Failed to update position', 'error');
            // Revert UI changes on error
            this.renderPositionsTable();
        }
    }
    
    async savePosition(id) {
        try {
            this.showNotification('Saving position...', 'info');
            // Position is already saved via updatePosition calls
            this.showNotification('Position saved successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to save position', 'error');
        }
    }
    
    async deletePosition(id) {
        if (confirm('Are you sure you want to delete this position?')) {
            try {
                this.showNotification('Deleting position...', 'info');
                await this.deleteAPI(`/positions/${id}`);
                this.positionsData = this.positionsData.filter(p => p.id !== id);
                this.renderPositionsTable();
                this.showNotification('Position deleted successfully!', 'success');
            } catch (error) {
                this.showNotification('Failed to delete position', 'error');
            }
        }
    }
    
    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }
}

// Global functions for compatibility with inline handlers
function addNewPosition() {
    if (window.crudManager) {
        window.crudManager.addNewPosition();
    }
}

// Initialize CRUD manager
window.crudManager = new CRUDManager();