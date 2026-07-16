// DOM Node Mappings
const transactionForm = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const transactionList = document.getElementById('transactionList');

const totalBalanceEl = document.getElementById('totalBalance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');

// Sync state using isolated Spendora engine storage keys
let transactions = JSON.parse(localStorage.getItem('spendora_data')) || [];

// Calculate math bounds for financial dashboards
function updateDashboard() {
    let incomeSum = 0;
    let expenseSum = 0;

    transactions.forEach(t => {
        if (t.type === 'income') {
            incomeSum += t.amount;
        } else {
            expenseSum += t.amount;
        }
    });

    const netBalance = incomeSum - expenseSum;

    // Render numbers safely tracking double digit float specifications with ₹ symbol
    totalBalanceEl.innerText = `₹${netBalance.toFixed(2)}`;
    totalIncomeEl.innerText = `₹${incomeSum.toFixed(2)}`;
    totalExpensesEl.innerText = `₹${expenseSum.toFixed(2)}`;
}

// Map entries directly into transaction components
function renderTransactions() {
    transactionList.innerHTML = '';

    transactions.forEach((t) => {
        const row = document.createElement('tr');
        const isInc = t.type === 'income';
        const amountSign = isInc ? '+' : '-';

        row.innerHTML = `
            <td><strong>${t.description}</strong></td>
            <td><span class="type-badge ${isInc ? 'inc' : 'exp'}">${t.type}</span></td>
            <td style="color: ${isInc ? 'var(--clr-success)' : 'var(--clr-danger)'}; font-weight: 600;">
                ${amountSign} ₹${t.amount.toFixed(2)}
            </td>
            <td>
                <button class="btn-delete" onclick="deleteTransaction(${t.id})" title="Remove item">🗑️</button>
            </td>
        `;

        transactionList.appendChild(row);
    });
}

// Form intercept execution layer
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTransaction = {
        id: Date.now(), 
        description: descriptionInput.value.trim(),
        amount: parseFloat(amountInput.value),
        type: typeSelect.value
    };

    transactions.push(newTransaction);
    
    saveToStorage();
    updateDashboard();
    renderTransactions();

    transactionForm.reset();
});

// Drop indices tracking matching item IDs
window.deleteTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToStorage();
    updateDashboard();
    renderTransactions();
}

function saveToStorage() {
    localStorage.setItem('spendora_data', JSON.stringify(transactions));
}

// Boot operations pipeline initialization
function init() {
    renderTransactions();
    updateDashboard();
}

init();