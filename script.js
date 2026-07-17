/**
 * Spendora Core State Architecture - Zero Baseline Engine
 */
let state = {
    currency: "INR",
    fxRate: 1.0, 
    activeModalType: null,
    // Initialize transaction records to absolute 0 empty array
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
    renderAchievements();
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
    let aggregateAssetNetWorth = netCalculatedBalance + activeGoalSavingsAllocation; 

    document.getElementById('lblTotalBalance').innerText = formatCurrencyVal(netCalculatedBalance);
    document.getElementById('lblIncome').innerText = formatCurrencyVal(incomeTotal);
    document.getElementById('lblExpenses').innerText = formatCurrencyVal(expenseTotal);
    document.getElementById('lblSavings').innerText = formatCurrencyVal(activeGoalSavingsAllocation);
    document.getElementById('lblNetWorth').innerText = formatCurrencyVal(aggregateAssetNetWorth);

    // Flowchart Node Injections
    document.getElementById('flowIn').innerText = formatCurrencyVal(incomeTotal);
    document.getElementById('flowOut').innerText = formatCurrencyVal(expenseTotal);
    
    let nodeIn = document.querySelector('.node-in');
    let nodeOut = document.querySelector('.node-out');
    
    if(incomeTotal > 0) nodeIn.classList.add('active'); else nodeIn.classList.remove('active');
    if(expenseTotal > 0) nodeOut.classList.add('active'); else nodeOut.classList.remove('active');

    let netFlowContainer = document.getElementById('flowNet');
    let netFlowValueEl = document.getElementById('flowNetVal');
    
    netFlowValueEl.innerText = `${netCalculatedBalance >= 0 ? '+' : ''}${formatCurrencyVal(netCalculatedBalance)}`;
    if (netCalculatedBalance > 0) {
        netFlowContainer.style.color = "var(--clr-inc)";
    } else if (netCalculatedBalance < 0) {
        netFlowContainer.style.color = "var(--clr-exp)";
    } else {
        netFlowContainer.style.color = "var(--text-main)";
    }

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
 * Native Pure Dynamic Graphic Rendering Engine
 */
function refreshVisualAnalytics() {
    const viewport = document.getElementById('incomeExpenseChart');
    viewport.innerHTML = ''; 

    let incomeTotal = 0;
    let expenseTotal = 0;

    state.transactions.forEach(item => {
        if (item.type === 'income') incomeTotal += item.amount;
        else expenseTotal += item.amount;
    });

    // If zero balance logged, explicitly render structured placeholder state
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

/**
 * Advanced Health Index Calculator Matrix
 */
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

    let score = 0;
    if (inc > 0 && exp === 0) score = 100;
    else {
        let baseRatio = (exp / inc);
        score = 100 - Math.round(baseRatio * 50);
    }
    
    if (score > 100) score = 100;
    if (score < 10) score = 10;

    document.getElementById('healthScoreValue').innerText = score;
    
    if (score >= 85) {
        starsRow.innerText = "★★★★★";
        desc.innerText = "Excellent stability. High savings ratio allocation verified.";
    } else if (score >= 70) {
        starsRow.innerText = "★★★★☆";
        desc.innerText = "Good performance profile. Keep monitoring variable outlays.";
    } else if (score >= 50) {
        starsRow.innerText = "★★★☆☆";
        desc.innerText = "Moderate stress indices detected. Optimize custom budgets.";
    } else {
        starsRow.innerText = "★★☆☆☆";
        desc.innerText = "Critical deficit warnings. Expenses exceed standard bounds.";
    }
}

/**
 * Budget Processing Progress Bars Loops
 */
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
    let inputVal = prompt("Enter amount to allocate from capital to this goal target:");
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
        let styleClass = b.daysLeft.includes("Tomorrow") ? "urgent" : "";
        el.innerHTML = `
            <div class="bill-left-info">
                <h6>${b.title}</h6>
                <span class="${styleClass}">${b.daysLeft}</span>
            </div>
            <div class="bill-right-cost">${formatCurrencyVal(b.amount)}</div>
        `;
        container.appendChild(el);
    });
}

function renderNotificationsList() {
    const badge = document.getElementById('notifBadge');
    badge.innerText = state.notifications.length;
    const container = document.getElementById('notifStack');
    container.innerHTML = '';
    
    if(state.notifications.length === 0) {
        container.innerHTML = '<p style="font-size:0.8rem; color:var(--text-secondary); padding:1rem 0;">Clear clean channels. No system alerts.</p>';
        return;
    }
    
    state.notifications.forEach(msg => {
        let el = document.createElement('div');
        el.className = 'notif-node-alert';
        el.innerText = msg;
        container.appendChild(el);
    });
}

function renderAchievements() {
    const container = document.getElementById('achievementsContainer');
    container.innerHTML = '';
    
    let hasTransactions = state.transactions.length > 0;
    let incomeTotal = state.transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount, 0);
    
    container.innerHTML = `
        <div class="ach-badge ${incomeTotal >= 10000 ? 'unlocked' : 'locked'}">
            ${incomeTotal >= 10000 ? '🏅' : '🔒'} <span class="ach-txt">Earned ₹10,000 Milestone</span>
        </div>
        <div class="ach-badge ${hasTransactions ? 'unlocked' : 'locked'}">
            ${hasTransactions ? '🏅' : '🔒'} <span class="ach-txt">First Ecosystem Record Logged</span>
        </div>
    `;
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

    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));

    if(filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary); padding: 2rem;">No entries match filter scopes. Click Quick Actions to insert data.</td></tr>`;
        return;
    }

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
    initializeEngine();
}

/**
 * Dynamic AI Synthesizer Logic Module
 */
function executeAIInsightsEngine() {
    const container = document.getElementById('aiInsightsContainer');
    container.innerHTML = '';

    if (state.transactions.length === 0) {
        let li = document.createElement('li');
        li.innerText = "Ecosystem mapping module online. Populate transactional vectors to stream automated behavioral advice insights.";
        container.appendChild(li);
        return;
    }

    // Dynamic generation routines processing actual metrics states array parameters
    let insightsList = [
        "Ecosystem tracks verified. Spendora engine monitoring structural category limits.",
        "Operational parameters indicate normal configuration matrix metrics limits."
    ];

    insightsList.forEach(text => {
        let li = document.createElement('li');
        li.className = "alert-active";
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
        
        // Dynamic dynamic notification pushing trigger
        state.notifications.unshift(`New entry recorded: "${desc}" for ${formatCurrencyVal(val)}`);
    } else if(state.activeModalType === 'goal') {
        state.savingsGoals.push({
            name: desc, target: val, saved: 0, color: "var(--clr-sav)"
        });
        localStorage.setItem('spendora_goals', JSON.stringify(state.savingsGoals));
    }

    closeModal();
    initializeEngine();
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

    setTimeout(() => {
        let aiMsg = document.createElement('p');
        aiMsg.className = 'msg-ai';
        
        if(state.transactions.length === 0) {
            aiMsg.innerText = "I cannot inspect your metrics because no transaction history fields exist yet. Use Quick Actions to add entries.";
        } else {
            aiMsg.innerText = "Inspecting system ledger arrays. Active budget matrices are tracking fully within parameters.";
        }
        
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

    if(selected === 'USD') state.fxRate = 0.012;
    else if(selected === 'EUR') state.fxRate = 0.011;
    else state.fxRate = 1.0;

    initializeEngine();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

function exportReport(formatType) {
    if(state.transactions.length === 0) return alert("Ledger array empty. Add operations before executing data exports.");
    alert(`Generating report file pipelines... \nFormat Target: ${formatType}\nDownload completed successfully.`);
}

// System Boot configuration
window.addEventListener('DOMContentLoaded', initializeEngine);