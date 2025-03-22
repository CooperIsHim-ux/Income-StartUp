class IncomeManager {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.initializeEventListeners();
        this.updateSummary();
        this.displayTransactions();
        this.updateCharts();
    }

    initializeEventListeners() {
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });
    }

    addTransaction() {
        const transaction = {
            id: Date.now(),
            type: document.getElementById('type').value,
            category: document.getElementById('category').value,
            amount: parseFloat(document.getElementById('amount').value),
            date: document.getElementById('date').value,
            description: document.getElementById('description').value
        };

        this.transactions.push(transaction);
        this.saveToLocalStorage();
        this.updateSummary();
        this.displayTransactions();
        this.updateCharts();
        document.getElementById('transactionForm').reset();
    }

    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    updateSummary() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        document.getElementById('totalIncome').textContent = `$${income.toFixed(2)}`;
        document.getElementById('totalExpenses').textContent = `$${expenses.toFixed(2)}`;
        document.getElementById('netBalance').textContent = `$${(income - expenses).toFixed(2)}`;
    }

    displayTransactions() {
        const container = document.getElementById('transactions');
        container.innerHTML = '';

        this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .forEach(transaction => {
                const div = document.createElement('div');
                div.className = 'transaction-item';
                div.innerHTML = `
                    <div>
                        <strong>${transaction.description}</strong><br>
                        ${transaction.category} - ${transaction.date}
                    </div>
                    <div style="color: ${transaction.type === 'income' ? 'green' : 'red'}">
                        ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                        <button onclick="incomeManager.deleteTransaction(${transaction.id})">Delete</button>
                    </div>
                `;
                container.appendChild(div);
            });
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.updateSummary();
        this.displayTransactions();
        this.updateCharts();
    }

    updateCharts() {
        const categoryData = {
            income: {},
            expense: {}
        };

        this.transactions.forEach(transaction => {
            const type = transaction.type;
            const category = transaction.category;
            if (!categoryData[type][category]) {
                categoryData[type][category] = 0;
            }
            categoryData[type][category] += transaction.amount;
        });

        this.createChart('incomeChart', 'Income by Category', categoryData.income);
        this.createChart('expenseChart', 'Expenses by Category', categoryData.expense);
    }

    createChart(canvasId, title, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const existingChart = Chart.getChart(canvasId);
        if (existingChart) {
            existingChart.destroy();
        }

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        });
    }
}

const incomeManager = new IncomeManager();

class IncomeManager {
    constructor() {
        // ... existing constructor code ...
        this.initializeQuickButtons();
        this.initializeFilters();
        this.setupAutomaticBackup();
    }

    initializeQuickButtons() {
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const transaction = {
                    id: Date.now(),
                    type: btn.dataset.type,
                    category: btn.dataset.category,
                    amount: parseFloat(btn.dataset.amount),
                    date: new Date().toISOString().split('T')[0],
                    description: `Quick ${btn.dataset.category} transaction`
                };
                this.transactions.push(transaction);
                this.saveToLocalStorage();
                this.updateSummary();
                this.displayTransactions();
                this.updateCharts();
                this.showNotification('Transaction added successfully!');
            });
        });
    }

    initializeFilters() {
        const filterType = document.getElementById('filterType');
        const filterCategory = document.getElementById('filterCategory');
        const filterMonth = document.getElementById('filterMonth');

        // Populate categories
        const categories = [...new Set(this.transactions.map(t => t.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterCategory.appendChild(option);
        });

        // Add filter event listeners
        [filterType, filterCategory, filterMonth].forEach(filter => {
            filter.addEventListener('change', () => this.displayTransactions());
        });
    }

    displayTransactions() {
        const filterType = document.getElementById('filterType').value;
        const filterCategory = document.getElementById('filterCategory').value;
        const filterMonth = document.getElementById('filterMonth').value;

        let filtered = [...this.transactions];

        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }
        if (filterCategory !== 'all') {
            filtered = filtered.filter(t => t.category === filterCategory);
        }
        if (filterMonth) {
            filtered = filtered.filter(t => t.date.startsWith(filterMonth));
        }

        // ... existing display code but use filtered instead of this.transactions ...
    }

    clearFilters() {
        document.getElementById('filterType').value = 'all';
        document.getElementById('filterCategory').value = 'all';
        document.getElementById('filterMonth').value = '';
        this.displayTransactions();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 4px;
            z-index: 1000;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    setupAutomaticBackup() {
        // Backup to localStorage every 5 minutes
        setInterval(() => {
            this.saveToLocalStorage();
            console.log('Auto-backup completed');
        }, 300000);
    }

    // ... rest of the existing code ...
}

const incomeManager = new IncomeManager();


displayTransactions() {
    // ... existing filtering code ...

    filtered.forEach(transaction => {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div class="transaction-content">
                <div class="transaction-header">
                    <strong class="${transaction.type}-text">
                        ${transaction.type === 'income' ? '+ $' : '- $'}${transaction.amount.toFixed(2)}
                    </strong>
                    <span class="transaction-date">${transaction.date}</span>
                </div>
                <div class="transaction-details">
                    <span class="transaction-description">${transaction.description}</span>
                    <span class="transaction-category">${transaction.category}</span>
                </div>
            </div>
            <button class="delete-btn" onclick="incomeManager.deleteTransaction(${transaction.id})">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </button>
        `;
        container.appendChild(div);
    });
}

// Update the chart colors
createChart(canvasId, title, data) {
    // ... existing code ...
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#ec4899',
                    '#14b8a6',
                    '#f59e0b',
                    '#ef4444'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    color: '#1e293b',
                    font: {
                        size: 16,
                        weight: '600'
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}