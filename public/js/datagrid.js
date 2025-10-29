/**
 * DataGrid Control Module
 * Handles CRUD operations for tabular data with API integration
 * Master Agent Edict Compliant: Modular, BEM-based, fully documented
 */

class DataGridControl {
    constructor(containerId, config = {}) {
        this.containerId = containerId;
        this.config = {
            apiEndpoint: 'http://localhost:8000/api/positions',
            companiesEndpoint: 'http://localhost:8000/api/companies',
            columns: [],
            editable: true,
            sortable: true,
            filterable: true,
            ...config
        };
        
        this.data = [];
        this.companies = [];
        this.filteredData = [];
        this.sortField = null;
        this.sortDirection = 'asc';
        this.editingRow = null;
        
        this.init();
    }
    
    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`DataGrid container not found: ${this.containerId}`);
            return;
        }
        
        this.setupEventListeners();
        this.loadCompanies().then(() => {
            this.loadData();
        });
        
        console.log('DataGrid initialized:', this.containerId);
    }
    
    async loadCompanies() {
        try {
            const response = await fetch(this.config.companiesEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.companies = await response.json();
            console.log('Companies loaded:', this.companies.length, 'companies');
        } catch (error) {
            console.error('Failed to load companies:', error);
            this.companies = [];
        }
    }
    
    getCompanyName(companyId) {
        const company = this.companies.find(c => c.id === companyId);
        return company ? company.name : `Company ID ${companyId}`;
    }
    
    renderCompanyDropdown(selectedCompanyId, fieldName = 'companyId') {
        const options = this.companies.map(company => 
            `<option value="${company.id}" ${company.id === selectedCompanyId ? 'selected' : ''}>${company.name}</option>`
        ).join('');
        
        return `<select class="datagrid__select" data-field="${fieldName}">
                    <option value="">Select Company...</option>
                    ${options}
                </select>`;
    }
    
    setupEventListeners() {
        // Add Position button
        const addBtn = document.getElementById('add-position-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addNewRow());
        }
        
        // Tab switching (if present)
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleTabSwitch(e.target.dataset.tab);
            });
        });
    }
    
    async loadData() {
        try {
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.data = Array.isArray(data) ? data : data.positions || [];
            this.filteredData = [...this.data];
            this.render();
            
            console.log('DataGrid data loaded:', this.data.length, 'records');
        } catch (error) {
            console.error('Failed to load data:', error);
            this.showError('Failed to load positions data. Please check the API connection.');
        }
    }
    
    render() {
        if (!this.container) {
            console.error('No container found in render');
            return;
        }
        
        const tbody = this.container.querySelector('#positions-body');
        if (!tbody) {
            console.error('DataGrid tbody not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (this.filteredData.length === 0) {
            tbody.innerHTML = `
                <tr class="datagrid__row--empty">
                    <td colspan="7" class="datagrid__cell--empty">
                        No positions found. Click "+" to add one.
                    </td>
                </tr>
            `;
            return;
        }
        
        this.filteredData.forEach((row, index) => {
            const tr = this.createRowElement(row, index);
            tbody.appendChild(tr);
        });
    }
    
    createRowElement(rowData, index) {
        const tr = document.createElement('tr');
        tr.className = 'datagrid__row';
        tr.dataset.index = index;
        tr.dataset.id = rowData.id || index;
        
        // Check if this row is being edited
        const isEditing = this.editingRow === index;
        
        tr.innerHTML = `
            <td class="datagrid__cell">
                ${isEditing ? 
                    this.renderCompanyDropdown(rowData.companyId) :
                    `<span class="datagrid__text">${this.getCompanyName(rowData.companyId)}</span>`
                }
            </td>
            <td class="datagrid__cell">
                ${isEditing ? 
                    `<input type="text" class="datagrid__input" value="${rowData.position || ''}" data-field="position">` :
                    `<span class="datagrid__text">${rowData.position || ''}</span>`
                }
            </td>
            <td class="datagrid__cell">
                <span class="datagrid__text datagrid__text--readonly">${this.formatDate(rowData.initialContact)}</span>
            </td>
            <td class="datagrid__cell">
                ${isEditing ? 
                    `<input type="date" class="datagrid__input" value="${rowData.lastContact || ''}" data-field="lastContact">` :
                    `<span class="datagrid__text">${this.formatDate(rowData.lastContact)}</span>`
                }
            </td>
            <td class="datagrid__cell">
                ${isEditing ? 
                    `<select class="datagrid__select" data-field="contactType">
                        <option value="email" ${rowData.contactType === 'email' ? 'selected' : ''}>Email</option>
                        <option value="phone" ${rowData.contactType === 'phone' ? 'selected' : ''}>Phone</option>
                        <option value="linkedin" ${rowData.contactType === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                        <option value="in-person" ${rowData.contactType === 'in-person' ? 'selected' : ''}>In Person</option>
                    </select>` :
                    `<span class="datagrid__text datagrid__text--${rowData.contactType}">${this.formatContactType(rowData.contactType)}</span>`
                }
            </td>
            <td class="datagrid__cell">
                ${isEditing ? 
                    `<select class="datagrid__select" data-field="status">
                        <option value="applied" ${rowData.status === 'applied' ? 'selected' : ''}>Applied</option>
                        <option value="interviewed" ${rowData.status === 'interviewed' ? 'selected' : ''}>Interviewed</option>
                        <option value="offer" ${rowData.status === 'offer' ? 'selected' : ''}>Offer</option>
                        <option value="rejected" ${rowData.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                        <option value="withdrawn" ${rowData.status === 'withdrawn' ? 'selected' : ''}>Withdrawn</option>
                    </select>` :
                    `<span class="datagrid__text datagrid__status--${rowData.status}">${this.formatStatus(rowData.status)}</span>`
                }
            </td>
            <td class="datagrid__cell datagrid__cell--actions">
                ${isEditing ? 
                    `<button class="btn btn--sm btn--success" onclick="window.positionsGrid.saveRow(${index})">💾</button>
                     <button class="btn btn--sm btn--secondary" onclick="window.positionsGrid.cancelEdit(${index})">❌</button>` :
                    `<button class="btn btn--sm btn--primary" onclick="window.positionsGrid.editRow(${index})">✏️</button>
                     <button class="btn btn--sm btn--danger" onclick="window.positionsGrid.deleteRow(${index})">🗑️</button>`
                }
            </td>
        `;
        
        return tr;
    }
    
    addNewRow() {
        const newRow = {
            id: Date.now(), // Temporary ID
            companyId: this.companies.length > 0 ? this.companies[0].id : 1,
            position: '',
            initialContact: new Date().toISOString().split('T')[0],
            lastContact: new Date().toISOString().split('T')[0],
            contactType: 'email',
            status: 'applied'
        };
        
        this.data.unshift(newRow);
        this.filteredData.unshift(newRow);
        this.editingRow = 0;
        this.render();
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = this.container.querySelector('.datagrid__select, .datagrid__input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        console.log('New row added for editing');
    }
    
    editRow(index) {
        this.cancelEdit(); // Cancel any existing edit
        this.editingRow = index;
        this.render();
        
        // Focus on first input
        setTimeout(() => {
            const editingRow = this.container.querySelector(`tr[data-index="${index}"]`);
            const firstInput = editingRow?.querySelector('.datagrid__input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        console.log('Editing row:', index);
    }
    
    async saveRow(index) {
        const row = this.container.querySelector(`tr[data-index="${index}"]`);
        if (!row) return;
        
        const rowData = this.filteredData[index];
        const updatedData = { ...rowData };
        
        // Collect form data
        row.querySelectorAll('.datagrid__input, .datagrid__select').forEach(input => {
            const field = input.dataset.field;
            let value = input.value;
            
            // Convert companyId to integer
            if (field === 'companyId') {
                value = parseInt(value, 10);
            }
            
            updatedData[field] = value;
        });
        
        // Validate required fields
        if (!updatedData.companyId || !updatedData.position) {
            this.showError('Company and Position are required fields.');
            return;
        }
        
        try {
            const isNew = !rowData.id || rowData.id === updatedData.id;
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? this.config.apiEndpoint : `${this.config.apiEndpoint}/${rowData.id}`;
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const savedData = await response.json();
            
            // Update local data
            this.filteredData[index] = savedData;
            const originalIndex = this.data.findIndex(item => item.id === savedData.id);
            if (originalIndex >= 0) {
                this.data[originalIndex] = savedData;
            } else {
                this.data.unshift(savedData);
            }
            
            this.editingRow = null;
            this.render();
            this.showSuccess('Position saved successfully!');
            
            console.log('Row saved:', savedData);
        } catch (error) {
            console.error('Failed to save row:', error);
            this.showError('Failed to save position. Please try again.');
        }
    }
    
    cancelEdit() {
        if (this.editingRow !== null) {
            // If it was a new row (no real ID), remove it
            const rowData = this.filteredData[this.editingRow];
            if (!rowData.id || rowData.id === Date.now()) {
                this.data.shift();
                this.filteredData.shift();
            }
            
            this.editingRow = null;
            this.render();
            console.log('Edit cancelled');
        }
    }
    
    async deleteRow(index) {
        if (!confirm('Are you sure you want to delete this position?')) {
            return;
        }
        
        const rowData = this.filteredData[index];
        
        try {
            const response = await fetch(`${this.config.apiEndpoint}/${rowData.id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Remove from local data
            this.filteredData.splice(index, 1);
            const originalIndex = this.data.findIndex(item => item.id === rowData.id);
            if (originalIndex >= 0) {
                this.data.splice(originalIndex, 1);
            }
            
            this.render();
            this.showSuccess('Position deleted successfully!');
            
            console.log('Row deleted:', rowData.id);
        } catch (error) {
            console.error('Failed to delete row:', error);
            this.showError('Failed to delete position. Please try again.');
        }
    }
    
    handleTabSwitch(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        console.log('Tab switched to:', tabName);
    }
    
    // Utility methods
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    formatContactType(type) {
        const types = {
            email: 'Email',
            phone: 'Phone',
            linkedin: 'LinkedIn',
            'in-person': 'In Person'
        };
        return types[type] || type;
    }
    
    formatStatus(status) {
        const statuses = {
            applied: 'Applied',
            interviewed: 'Interviewed',
            offer: 'Offer Received',
            rejected: 'Rejected',
            withdrawn: 'Withdrawn'
        };
        return statuses[status] || status;
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('notification--show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Global initialization for job search page
function initializeJobSearchDataGrid() {
    console.log('initializeJobSearchDataGrid called');
    
    // Add a visible status indicator
    const statusDiv = document.createElement('div');
    statusDiv.id = 'datagrid-status';
    statusDiv.style.cssText = 'background: #f0f0f0; padding: 10px; margin: 10px 0; border-left: 4px solid #007bff;';
    statusDiv.innerHTML = '🔄 Initializing DataGrid...';
    
    const container = document.querySelector('.datagrid-container');
    if (container) {
        container.insertBefore(statusDiv, container.firstChild);
    }
    
    const positionsContainer = document.getElementById('positions-container');
    console.log('Found container:', positionsContainer);
    
    if (positionsContainer) {
        console.log('Initializing DataGrid for positions...');
        statusDiv.innerHTML = '🔄 Creating DataGrid instance...';
        
        try {
            window.positionsGrid = new DataGridControl('positions-container', {
                apiEndpoint: 'http://localhost:8000/api/positions',
                editable: true,
                sortable: true
            });
            
            statusDiv.innerHTML = '✅ DataGrid initialized successfully!';
            
            // Remove status after 3 seconds
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.parentNode.removeChild(statusDiv);
                }
            }, 3000);
            
        } catch (error) {
            console.error('Error creating DataGrid:', error);
            statusDiv.innerHTML = '❌ Error creating DataGrid: ' + error.message;
            statusDiv.style.borderLeftColor = '#dc3545';
        }
    } else {
        console.log('DataGrid container not found - positions-container');
        statusDiv.innerHTML = '❌ Container positions-container not found!';
        statusDiv.style.borderLeftColor = '#dc3545';
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeJobSearchDataGrid);
} else {
    initializeJobSearchDataGrid();
}

// Export for module use
window.DataGridControl = DataGridControl;
window.initializeJobSearchDataGrid = initializeJobSearchDataGrid;