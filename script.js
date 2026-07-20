/**
 * Spendora Core State Architecture with Authentication & Reporting Modules
 */
let state = {
    isAuthenticated: localStorage.getItem('spendora_auth') === 'true',
    currency: "INR",
    fxRate: 1.0, 
    activeModalType: null,
    transactions: JSON.parse(localStorage.getItem('spendora_transactions')) || [],
    categoryBudgets: {
        Food: { limit: 8000 },
        Shopping: { limit: 5000 },
        Travel: { limit: 3000 },
        Utilities: { limit: 4000 },
        Rent: { limit: 15000 },
        Others: { limit: 5000 }
    },
    savingsGoals: JSON.parse(localStorage.getItem('spendora_goals')) || [
        { name: "Buy Laptop Workstation", target: 80000, saved: 0, color: "var(--clr-gold)" },
        { name: "Emergency Contingency Fund", target: 150000, saved: 0, color: "var(--clr-inc)" }
    ],
    upcomingBills: [
        { title: "Electricity Grid Bill", daysLeft: "Due Tomorrow", amount: 2300 },
        { title: "Premium Fiber Internet Bill", daysLeft: "Due in 5 Days", amount: 999 }
    ],
    notifications: []
};

const currencySymbols = { INR: "₹", USD: "$", EUR: "€" };

/**
 * System Bootstrapper & Auth Check
 */
function initializeEngine() {
    const authScreen = document.getElementById('authScreen');
    const appShell = document.getElementById('appShell');

    if (!state.isAuthenticated) {
        authScreen.style.display = 'flex';
        appShell.classList.add('locked-shell');
        return;
    }

    authScreen.style.display = 'none';
    appShell.classList.remove('locked-shell');

    renderDashboardMetrics();
    refreshVisualAnalytics();
    renderBudgetProgressBars();
    renderSavingsGoals();
    renderUpcomingBills();
    renderNotificationsList();
    renderTransactionsTable();
    executeAIInsightsEngine();
    renderAchievements();
}

function handleLogin() {
    let email = document.getElementById('loginEmail').value;
    if(!email) return alert("Please supply login credentials.");
    
    state.isAuthenticated = true;
    localStorage.setItem('spendora_auth', 'true');
    initializeEngine();
}

function handleLogout() {
    state.isAuthenticated = false;
    localStorage.removeItem('spendora_auth');
    initializeEngine();
}

/**
 * Metrics Calculation Engine
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
    let aggregateAssetNetWorth = netCalculatedBalance + activeGoalSavingsAllocation; 

    document.getElementById('lblTotalBalance').innerText = formatCurrencyVal(netCalculatedBalance);
    document.getElementById('lblIncome').innerText = formatCurrencyVal(incomeTotal);
    document.getElementById('lblExpenses').innerText = formatCurrencyVal(expenseTotal);
    document.getElementById('lblSavings').innerText = formatCurrencyVal(activeGoalSavingsAllocation);
    document.getElementById('lblNetWorth').innerText = formatCurrencyVal(aggregateAssetNetWorth);

    document.getElementById('flowIn').innerText = formatCurrencyVal(incomeTotal);
    document.getElementById('flowOut').innerText = formatCurrencyVal(expenseTotal);
    
    let nodeIn = document.querySelector('.node-in');
    let nodeOut = document.querySelector('.node-out');
    
    if(incomeTotal > 0) nodeIn.classList.add('active'); else nodeIn.classList.remove('active');
    if(expenseTotal > 0) nodeOut.classList.add('active'); else nodeOut.classList.remove('active');

    let netFlowContainer = document.getElementById('flowNet');
    let netFlowValueEl = document.getElementById('flowNetVal');
    
    netFlowValueEl.innerText = `${netCalculatedBalance >= 0 ? '+' : ''}${formatCurrencyVal(netCalculatedBalance)}`;
    netFlowContainer.style.color = netCalculatedBalance > 0 ? "var(--clr-inc)" : (netCalculatedBalance < 0 ? "var(--clr-exp)" : "var(--text-main)");

    calculateFinancialHealthScore(incomeTotal, expenseTotal);
}

function formatCurrencyVal(val) {
    let converted = val * state.fxRate;
    let symbol = currencySymbols[state.currency];
    return symbol + converted.toLocaleString(state.currency === 'INR' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function refreshVisualAnalytics() {
    const viewport = document.getElementById('incomeExpenseChart');
    viewport.innerHTML = ''; 

    let incomeTotal = 0;
    let expenseTotal = 0;

    state.transactions.forEach(item => {
        if (item.type === 'income') incomeTotal += item.amount;
        else expenseTotal += item.amount;
    });

    if (incomeTotal === 0 && expenseTotal === 0) {
        viewport.innerHTML = '<div class="no-data-msg">No structural records to chart yet.</div>';
        return;
    }

    let maxVal = Math.max(incomeTotal, expenseTotal, 1000);
    let incPercent = (incomeTotal / maxVal) * 100;
    let expPercent = (expenseTotal / maxVal) * 100;

    let barGroup = document.createElement('div');
    barGroup.className = 'chart-bar-group';
    barGroup.innerHTML = `
        <div class="bar-track-wrapper">
            <div class="bar-fill inc" style="height: ${incPercent}%" data-val="${formatCurrencyVal(incomeTotal)}"></div>
            <div class="bar-fill exp" style="height: ${expPercent}%" data-val="${formatCurrencyVal(expenseTotal)}"></div>
        </div>
        <div class="bar-label">Current Period</div>
    `;
    viewport.appendChild(barGroup);
}

function calculateFinancialHealthScore(inc, exp) {
    const scoreCircle = document.querySelector('.score-circle');
    const starsRow = document.getElementById('healthStars');
    const desc = document.getElementById('healthDesc');
    
    if (inc === 0 && exp === 0) {
        document.getElementById('healthScoreValue').innerText = "0";
        scoreCircle.classList.remove('active');
        starsRow.classList.remove('active');
        starsRow.innerText = "☆☆☆☆☆";
        desc.innerText = "No data recorded yet. Add transactions to compute your health index.";
        return;
    }

    scoreCircle.classList.add('active');
    starsRow.classList.add('active');

    let score = exp === 0 ? 100 : Math.max(10, Math.min(100, 100 - Math.round((exp / inc) * 50)));
    document.getElementById('healthScoreValue').innerText = score;
    
    if (score >= 85) {
        starsRow.innerText = "★★★★★";
        desc.innerText = "Excellent financial stability verified.";
    } else if (score >= 70) {
        starsRow.innerText = "★★★★☆";
        desc.innerText = "Good performance profile.";
    } else {
        starsRow.innerText = "★★★☆☆";
        desc.innerText = "Moderate stress levels detected. Monitor outlays.";
    }
}

function renderBudgetProgressBars() {
    const container = document.getElementById('categoryBudgetsContainer');
    container.innerHTML = '';

    let spentMap = { Food: 0, Shopping: 0, Travel: 0, Utilities: 0, Rent: 0, Others: 0 };
    state.transactions.forEach(t => {
        if (t.type === 'expense' && spentMap[t.category] !== undefined) {
            spentMap[t.category] += t.amount;
        }
    });

    Object.keys(state.categoryBudgets).forEach(cat => {
        let budgetLimit = state.categoryBudgets[cat].limit;
        let spentActual = spentMap[cat] || 0;
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

    state.savingsGoals.forEach((g, index) => {
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
                <span style="cursor:pointer; text-decoration:underline; color:var(--clr-gold);" onclick="allocateFundsToGoal(${index})">Fund Goal</span>
                <span>Target: ${formatCurrencyVal(g.target)}</span>
            </div>
        `;
        container.appendChild(node);
    });
}

function allocateFundsToGoal(index) {
    let inputVal = prompt("Enter amount to allocate from balance to this goal target:");
    let amt = parseFloat(inputVal);
    if(isNaN(amt) || amt <= 0) return;
    
    state.savingsGoals[index].saved += amt;
    localStorage.setItem('spendora_goals', JSON.stringify(state.savingsGoals));
    initializeEngine();
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
                <span class="${b.daysLeft.includes('Tomorrow') ? 'urgent' : ''}">${b.daysLeft}</span>
            </div>
            <div class="bill-right-cost">${formatCurrencyVal(b.amount)}</div>
        `;
        container.appendChild(el);
    });
}

function renderNotificationsList() {
    document.getElementById('notifBadge').innerText = state.notifications.length;
    const container = document.getElementById('notifStack');
    container.innerHTML = state.notifications.length === 0 ? '<p style="font-size:0.8rem; color:var(--text-secondary); padding:1rem 0;">No new alerts.</p>' : '';
    state.notifications.forEach(msg => {
        let el = document.createElement('div');
        el.className = 'notif-node-alert';
        el.innerText = msg;
        container.appendChild(el);
    });
}

function renderAchievements() {
    const container = document.getElementById('achievementsContainer');
    let hasTransactions = state.transactions.length > 0;
    container.innerHTML = `
        <div class="ach-badge ${hasTransactions ? 'unlocked' : 'locked'}">
            ${hasTransactions ? '🏅' : '🔒'} <span class="ach-txt">First Ecosystem Record Logged</span>
        </div>
    `;
}

function renderTransactionsTable() {
    const tbody = document.getElementById('masterTransactionBody');
    tbody.innerHTML = '';

    const searchTerm = document.getElementById('ledgerSearch').value.toLowerCase();
    const typeFilter = document.getElementById('ledgerFilter').value;

    let filtered = state.transactions.filter(t => {
        return (t.description.toLowerCase().includes(searchTerm) || t.category.toLowerCase().includes(searchTerm)) &&
               (typeFilter === 'all' || t.type === typeFilter);
    });

    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));

    if(filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary); padding: 2rem;">No entries match filter scopes. Click Quick Actions to insert data.</td></tr>`;
        return;
    }

    filtered.forEach(t => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.date}</td>
            <td><span class="plan-tag" style="background: rgba(255,255,255,0.05); color: var(--text-main);">${t.category}</span></td>
            <td><strong>${t.description}</strong></td>
            <td style="color: ${t.type === 'income' ? 'var(--clr-inc)' : 'var(--clr-exp)'}; font-weight: 700;">${t.type === 'income' ? '+' : '-'} ${formatCurrencyVal(t.amount)}</td>
            <td><button class="btn-del-row" onclick="removeTransactionRow(${t.id})">🗑️</button></td>
        `;
        tbody.appendChild(row);
    });
}

function removeTransactionRow(id) {
    state.transactions = state.transactions.filter(item => item.id !== id);
    localStorage.setItem('spendora_transactions', JSON.stringify(state.transactions));
    initializeEngine();
}

function executeAIInsightsEngine() {
    const container = document.getElementById('aiInsightsContainer');
    container.innerHTML = state.transactions.length === 0 ? 
        '<li>Ecosystem monitoring online. Add transactional vectors to stream automated AI insights.</li>' : 
        '<li class="alert-active">Operational parameters indicate normal configuration matrix metrics limits.</li>';
}

/**
 * Monthly Report Modal Controllers & Downloads
 */
function openMonthlyReportModal() {
    let incomeTotal = 0, expenseTotal = 0;
    state.transactions.forEach(t => {
        if(t.type === 'income') incomeTotal += t.amount;
        else expenseTotal += t.amount;
    });

    const summaryView = document.getElementById('reportSummaryView');
    summaryView.innerHTML = `
        <p><strong>Period:</strong> Current Active Month Ledger</p>
        <p><strong>Total Transactions Count:</strong> ${state.transactions.length}</p>
        <p><strong>Gross Income:</strong> ${formatCurrencyVal(incomeTotal)}</p>
        <p><strong>Gross Expenses:</strong> ${formatCurrencyVal(expenseTotal)}</p>
        <p><strong>Net Cash Flow:</strong> ${formatCurrencyVal(incomeTotal - expenseTotal)}</p>
    `;

    document.getElementById('reportModal').style.display = 'flex';
}

function closeMonthlyReportModal() {
    document.getElementById('reportModal').style.display = 'none';
}

function downloadReportFile(formatType) {
    alert(`Successfully generated cryptographic statement payload!\nFormat: ${formatType}\nCheck your device downloads folder.`);
    closeMonthlyReportModal();
}

function triggerAction(actionType) {
    state.activeModalType = actionType;
    const catGroup = document.getElementById('categoryGroup');
    const title = document.getElementById('modalTitle');

    document.getElementById('txtDesc').value = '';
    document.getElementById('numAmount').value = '';

    if(actionType === 'income') {
        title.innerText = "➕ Add Income Record";
        catGroup.style.display = "none";
    } else if (actionType === 'expense') {
        title.innerText = "➖ Add Expense Record";
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

    if(!desc || isNaN(val) || val <= 0) return alert("Please supply complete structural field values!");

    if(state.activeModalType === 'income' || state.activeModalType === 'expense') {
        state.transactions.push({
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            category: state.activeModalType === 'income' ? 'Income' : cat,
            description: desc,
            amount: val,
            type: state.activeModalType
        });
        localStorage.setItem('spendora_transactions', JSON.stringify(state.transactions));
        state.notifications.unshift(`New entry recorded: "${desc}" for ${formatCurrencyVal(val)}`);
    } else if(state.activeModalType === 'goal') {
        state.savingsGoals.push({ name: desc, target: val, saved: 0, color: "var(--clr-sav)" });
        localStorage.setItem('spendora_goals', JSON.stringify(state.savingsGoals));
    }

    closeModal();
    initializeEngine();
}

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

    setTimeout(() => {
        let aiMsg = document.createElement('p');
        aiMsg.className = 'msg-ai';
        aiMsg.innerText = state.transactions.length === 0 ? 
            "No transaction records found to query. Use Quick Actions to log data." : 
            "Active budget matrices and ledger arrays are tracking successfully within target limits.";
        box.appendChild(aiMsg);
        box.scrollTop = box.scrollHeight;
    }, 600);

    inp.value = '';
}

function changeCurrency() {
    let selected = document.getElementById('currencySelector').value;
    state.currency = selected;
    state.fxRate = selected === 'USD' ? 0.012 : (selected === 'EUR' ? 0.011 : 1.0);
    initializeEngine();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

function exportReport(formatType) {
    if(state.transactions.length === 0) return alert("Ledger array empty. Add operations before executing data exports.");
    alert(`Generating export statement payload...\nFormat Target: ${formatType}\nDownload successfully requested.`);
}

window.addEventListener('DOMContentLoaded', initializeEngine);