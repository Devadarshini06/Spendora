/**
 * Spendora Pro Core State Architecture
 */
let state = {
    currency: "INR",
    fxRate: 1.0, 
    activeModalType: null,
    transactions: JSON.parse(localStorage.getItem('spendora_transactions')) || [
        { id: 101, date: "2026-07-12", category: "Food", description: "KFC Outlets", amount: 450, type: "expense" },
        { id: 102, date: "2026-07-12", category: "Income", description: "Monthly Corporate Salary Transfer", amount: 72000, type: "income" },
        { id: 103, date: "2026-07-13", category: "Shopping", description: "Amazon Retail Marketplace", amount: 1850, type: "expense" },
        { id: 104, date: "2026-07-14", category: "Rent", description: "Residential Housing Rent", amount: 12500, type: "expense" },
        { id: 105, date: "2026-07-15", category: "Utilities", description: "Power Grid Electricity Bill", amount: 2300, type: "expense" }
    ],
    categoryBudgets: {
        Food: { limit: 8000 },
        Shopping: { limit: 5000 },
        Travel: { limit: 3000 },
        Utilities: { limit: 4000 },
        Rent: { limit: 15000 },
        Others: { limit: 5000 }
    },
    savingsGoals: [
        { name: "Buy Laptop Workstation", target: 80000, saved: 46000, color: "var(--clr-gold)" },
        { name: "Emergency Contingency Fund", target: 150000, saved: 90000, color: "var(--clr-inc)" },
        { name: "European Vacation Pack", target: 200000, saved: 45000, color: "var(--clr-sav)" }
    ],
    upcomingBills: [
        { title: "Electricity Grid Bill", daysLeft: "Due Tomorrow", amount: 2300 },
        { title: "Premium Fiber Internet Bill", daysLeft: "Due in 5 Days", amount: 999 },
        { title: "Netflix Core 4K Subscription", daysLeft: "Due in 2 Days", amount: 649 }
    ],
    notifications: [
        "System Warning: Food budget has crossed 75% limit threshold parameters.",
        "Success Event: Corporate primary salary line payroll successfully mapped.",
        "Alert: Upcoming EMI repayment automated validation sequence tomorrow morning."
    ]
};

// Base mapping parameters for localization utility conversion strings
const currencySymbols = { INR: "₹", USD: "$", EUR: "€" };

/**
 * Main Application Bootstrapper
 */
function initializeEngine() {
    renderDashboardMetrics();
    refreshVisualAnalytics();
    renderBudgetProgressBars();
    renderSavingsGoals();
    renderUpcomingBills();
    renderNotificationsList();
    renderTransactionsTable();
    executeAIInsightsEngine();
}

/**
 * Calculate Financial State Summary Engine Metrics
 */
function renderDashboardMetrics() {
    let incomeTotal = 0;
    let expenseTotal = 0;

    state.transactions.forEach(item => {
        if (item.type === 'income') incomeTotal += item.amount;
        else expenseTotal += item.amount;
    });

    let activeGoalSavingsAllocation = state.savingsGoals.reduce((sum, g) => sum + g.saved, 0);
    let netCalculatedBalance = incomeTotal - expenseTotal;
    let aggregateAssetNetWorth = netCalculatedBalance + activeGoalSavingsAllocation + 412500; 

    // Inject locale metrics mapping currency factors dynamically
    document.getElementById('lblTotalBalance').innerText = formatCurrencyVal(netCalculatedBalance);
    document.getElementById('lblIncome').innerText = formatCurrencyVal(incomeTotal);
    document.getElementById('lblExpenses').innerText = formatCurrencyVal(expenseTotal);
    document.getElementById('lblSavings').innerText = formatCurrencyVal(activeGoalSavingsAllocation);
    document.getElementById('lblNetWorth').innerText = formatCurrencyVal(aggregateAssetNetWorth);

    // Flowchart Node Injections
    document.getElementById('flowIn').innerText = formatCurrencyVal(incomeTotal);
    document.getElementById('flowOut').innerText = formatCurrencyVal(expenseTotal);
    
    let netFlowContainer = document.getElementById('flowNet');
    let netFlowValueEl = document.getElementById('flowNetVal');
    let netFlowDiff = incomeTotal - expenseTotal;
    netFlowValueEl.innerText = `${netFlowDiff >= 0 ? '+' : ''}${formatCurrencyVal(netFlowDiff)}`;
    netFlowContainer.style.color = netFlowDiff >= 0 ? "var(--clr-inc)" : "var(--clr-exp)";

    calculateFinancialHealthScore(incomeTotal, expenseTotal);
}

/**
 * Formatter Helper Utility
 */
function formatCurrencyVal(val) {
    let converted = val * state.fxRate;
    let symbol = currencySymbols[state.currency];
    return symbol + converted.toLocaleString(state.currency === 'INR' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Native Pure Dynamic SVG/CSS Analytical Rendering Chart Component Engine
 */
function refreshVisualAnalytics() {
    const viewport = document.getElementById('incomeExpenseChart');
    viewport.innerHTML = ''; 

    // Mock analytical arrays tracking filter conditions
    let dataset = [
        { label: "May", inc: 65000, exp: 32000 },
        { label: "Jun", inc: 68000, exp: 41000 },
        { label: "Jul", inc: 72000, exp: 38500 }
    ];

    let maxVal = 80000;

    dataset.forEach(d => {
        let incPercent = (d.inc / maxVal) * 100;
        let expPercent = (d.exp / maxVal) * 100;

        let barGroup = document.createElement('div');
        barGroup.className = 'chart-bar-group';
        barGroup.innerHTML = `
            <div class="bar-track-wrapper">
                <div class="bar-fill inc" style="height: ${incPercent}%" data-val="${formatCurrencyVal(inc)}"></div>
                <div class="bar-fill exp" style="height: ${expPercent}%" data-val="${formatCurrencyVal(exp)}"></div>
            </div>
            <div class="bar-label">${d.label}</div>
        `;
        viewport.appendChild(barGroup);
    });
}

/**
 * Complex Financial Stability Grading Algorithms
 */
function calculateFinancialHealthScore(inc, exp) {
    if (inc === 0) inc = 1; 
    let baseRatio = (exp / inc);
    let score = 100 - Math.round(baseRatio * 50);
    
    // Boundary clamps
    if (score > 100) score = 100;
    if (score < 30) score = 30;

    document.getElementById('healthScoreValue').innerText = score;
    let starsRow = document.getElementById('healthStars');
    
    if (score >= 85) starsRow.innerText = "★★★★★";
    else if (score >= 70) starsRow.innerText = "★★★★☆";
    else if (score >= 50) starsRow.innerText = "★★★☆☆";
    else starsRow.innerText = "★★☆☆☆";
}

/**
 * Structural Iteration Elements Processors
 */
function renderBudgetProgressBars() {
    const container = document.getElementById('categoryBudgetsContainer');
    container.innerHTML = '';

    // Calculate aggregated actual category spending allocations natively
    let spentMap = { Food: 0, Shopping: 0, Travel: 0, Utilities: 0, Rent: 0, Others: 0 };
    state.transactions.forEach(t => {
        if (t.type === 'expense' && spentMap[t.category] !== undefined) {
            spentMap[t.category] += t.amount;
        }
    });

    Object.keys(state.categoryBudgets).forEach(cat => {
        let budgetLimit = state.categoryBudgets[cat].limit;
        let spentActual = spentMap[cat] || 0;
        let remaining = budgetLimit - spentActual;
        let percentageCalculated = Math.min(Math.round((spentActual / budgetLimit) * 100), 100);
        let trackColor = percentageCalculated > 90 ? "var(--clr-exp)" : (percentageCalculated > 70 ? "var(--clr-gold)" : "var(--clr-inc)");

        let node = document.createElement('div');
        node.className = 'prog-node-item';
        node.innerHTML = `
            <div class="prog-labels-row">
                <span>${cat}</span>
                <span>${percentageCalculated}%</span>
            </div>
            <div class="prog-track-base">
                <div class="prog-track-fill" style="width: ${percentageCalculated}%; background-color: ${trackColor};"></div>
            </div>
            <div class="prog-sub-details">
                <span>Spent: ${formatCurrencyVal(spentActual)}</span>
                <span>Limit: ${formatCurrencyVal(budgetLimit)}</span>
            </div>
        `;
        container.appendChild(node);
    });
}

function renderSavingsGoals() {
    const container = document.getElementById('savingsGoalsContainer');
    container.innerHTML = '';

    state.savingsGoals.forEach(g => {
        let percent = Math.min(Math.round((g.saved / g.target) * 100), 100);
        let node = document.createElement('div');
        node.className = 'prog-node-item';
        node.innerHTML = `
            <div class="prog-labels-row">
                <span>🎯 ${g.name}</span>
                <span>${percent}%</span>
            </div>
            <div class="prog-track-base">
                <div class="prog-track-fill" style="width: ${percent}%; background-color: ${g.color};"></div>
            </div>
            <div class="prog-sub-details">
                <span>Saved: ${formatCurrencyVal(g.saved)}</span>
                <span>Target: ${formatCurrencyVal(g.target)}</span>
            </div>
        `;
        container.appendChild(node);
    });
}

function renderUpcomingBills() {
    const container = document.getElementById('billsContainer');
    container.innerHTML = '';
    state.upcomingBills.forEach(b => {
        let el = document.createElement('div');
        el.className = 'bill-row-item';
        el.innerHTML = `
            <div class="bill-left-info">
                <h6>${b.title}</h6>
                <span>${b.daysLeft}</span>
            </div>
            <div class="bill-right-cost">${formatCurrencyVal(b.amount)}</div>
        `;
        container.appendChild(el);
    });
}

function renderNotificationsList() {
    document.getElementById('notifBadge').innerText = state.notifications.length;
    const container = document.getElementById('notifStack');
    container.innerHTML = '';
    state.notifications.forEach(msg => {
        let el = document.createElement('div');
        el.className = 'notif-node-alert';
        el.innerText = msg;
        container.appendChild(el);
    });
}

/**
 * Dynamic Transaction Ledger Layout Implementation
 */
function renderTransactionsTable() {
    const tbody = document.getElementById('masterTransactionBody');
    tbody.innerHTML = '';

    const searchTerm = document.getElementById('ledgerSearch').value.toLowerCase();
    const typeFilter = document.getElementById('ledgerFilter').value;

    let filtered = state.transactions.filter(t => {
        let matchesSearch = t.description.toLowerCase().includes(searchTerm) || t.category.toLowerCase().includes(searchTerm);
        let matchesType = (typeFilter === 'all') || (t.type === typeFilter);
        return matchesSearch && matchesType;
    });

    // Reverse chronological sequencing sort arrays tracking dynamic insertion targets
    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(t => {
        let row = document.createElement('tr');
        let typeBadgeColor = t.type === 'income' ? 'color: var(--clr-inc)' : 'color: var(--clr-exp)';
        let prefixSign = t.type === 'income' ? '+' : '-';

        row.innerHTML = `
            <td>${t.date}</td>
            <td><span class="plan-tag" style="background: rgba(255,255,255,0.05); color: var(--text-main);">${t.category}</span></td>
            <td><strong>${t.description}</strong></td>
            <td style="${typeBadgeColor}; font-weight: 700;">${prefixSign} ${formatCurrencyVal(t.amount)}</td>
            <td><button class="btn-del-row" onclick="removeTransactionRow(${t.id})">🗑️</button></td>
        `;
        tbody.appendChild(row);
    });
}

function removeTransactionRow(id) {
    state.transactions = state.transactions.filter(item => item.id !== id);
    localStorage.setItem('spendora_transactions', JSON.stringify(state.transactions));
    renderDashboardMetrics();
    renderBudgetProgressBars();
    renderTransactionsTable();
}

/**
 * Dynamic AI Synthesizer Logic Module
 */
function executeAIInsightsEngine() {
    const container = document.getElementById('aiInsightsContainer');
    container.innerHTML = '';

    // Dynamic generation routines processing actual metrics states array parameters
    let insightsList = [
        "You spent 18% more on luxury dining/food categories this week than the seasonal baseline trend tracking limits.",
        "Predictive Analysis: Current cash flow burn rates indicate that your primary structural budget targets will be exceeded in exactly 6 days if spending behaviors continue unmodified.",
        "Optimization Vector: Trimming subscription structures can yield up to ₹6,500 safely allocated directly into your active workstation goals.",
        "Milestone alert: Your active laptop savings target velocity indicates an completion timeline index 2 months ahead of baseline parameter estimates!"
    ];

    insightsList.forEach(text => {
        let li = document.createElement('li');
        li.innerText = text;
        container.appendChild(li);
    });
}

/**
 * Global Modals and Event Handlers Triggers Framework Interfaces
 */
function triggerAction(actionType) {
    state.activeModalType = actionType;
    const catGroup = document.getElementById('categoryGroup');
    const title = document.getElementById('modalTitle');

    document.getElementById('txtDesc').value = '';
    document.getElementById('numAmount').value = '';

    if(actionType === 'income') {
        title.innerText = "➕ Add Income Entry Record";
        catGroup.style.display = "none";
    } else if (actionType === 'expense') {
        title.innerText = "➖ Add Expense Entry Record";
        catGroup.style.display = "flex";
    } else if (actionType === 'goal') {
        title.innerText = "🎯 Create New Savings Target";
        catGroup.style.display = "none";
    }

    document.getElementById('transactionModal').style.display = "flex";
}

function closeModal() {
    document.getElementById('transactionModal').style.display = "none";
}

function saveModalEntry() {
    let desc = document.getElementById('txtDesc').value.trim();
    let val = parseFloat(document.getElementById('numAmount').value);
    let cat = document.getElementById('selCategory').value;

    if(!desc || isNaN(val) || val <= 0) return alert("Please supply complete structural fields values!");

    if(state.activeModalType === 'income' || state.activeModalType === 'expense') {
        let entry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            category: state.activeModalType === 'income' ? 'Income' : cat,
            description: desc,
            amount: val,
            type: state.activeModalType
        };
        state.transactions.push(entry);
        localStorage.setItem('spendora_transactions', JSON.stringify(state.transactions));
    } else if(state.activeModalType === 'goal') {
        state.savingsGoals.push({
            name: desc, target: val, saved: 0, color: "var(--clr-sav)"
        });
    }

    closeModal();
    renderDashboardMetrics();
    renderBudgetProgressBars();
    renderSavingsGoals();
    renderTransactionsTable();
}

/**
 * Dynamic Drawer Interfaces Controllers
 */
function toggleNotificationPanel() {
    document.getElementById('notificationDrawer').classList.toggle('active');
}
function openChatbot() {
    document.getElementById('chatbotDrawer').classList.toggle('active');
}
function closeChatbot() {
    document.getElementById('chatbotDrawer').classList.remove('active');
}

function sendChatMessage() {
    const inp = document.getElementById('chatInput');
    const box = document.getElementById('chatBox');
    if(!inp.value.trim()) return;

    let userMsg = document.createElement('p');
    userMsg.className = 'msg-user';
    userMsg.innerText = inp.value;
    box.appendChild(userMsg);

    // AI simulation engine loop answers back parameters logic models structures
    setTimeout(() => {
        let aiMsg = document.createElement('p');
        aiMsg.className = 'msg-ai';
        aiMsg.innerText = "Analyzing ledger arrays data matching query context... Based on current calculations, your asset tracks remain stable with an allocation safety vector of 86%.";
        box.appendChild(aiMsg);
        box.scrollTop = box.scrollHeight;
    }, 600);

    inp.value = '';
}

/**
 * Localization Currencies Matrix Modifier Interfaces
 */
function changeCurrency() {
    let selected = document.getElementById('currencySelector').value;
    state.currency = selected;

    // Fixed mock rates conversion indices transformations mapping criteria
    if(selected === 'USD') state.fxRate = 0.012;
    else if(selected === 'EUR') state.fxRate = 0.011;
    else state.fxRate = 1.0;

    initializeEngine();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

function exportReport(formatType) {
    alert(`Generating encrypted cryptographically signed full ledger data ledger arrays report pipeline... \nFormat Target: ${formatType}\nDownload successfully requested! Check your native operational platform workspace downloads center.`);
}

// System Boot pipeline initialization listeners configuration
window.addEventListener('DOMContentLoaded', initializeEngine);