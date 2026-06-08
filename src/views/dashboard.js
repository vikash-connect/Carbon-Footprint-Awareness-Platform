import { loadProfile, loadLogs, saveLogs, sanitize } from '../modules/storage.js';
import { renderChart } from '../modules/charts.js';
import { estimateTreesToOffset } from '../modules/calculator.js';

let els = {};

export function initDashboard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!els.totalMetric) {
        buildDashboardDOM(container);
    }
    
    updateDashboard();
}

function buildDashboardDOM(container) {
    container.innerHTML = `
        <div class="metric-grid">
            <div class="card metric-card"><div id="dash-total" class="metric-card__value">0</div><div>Total / Yr</div></div>
            <div class="card metric-card"><div id="dash-avg" class="metric-card__value">0</div><div>Vs Avg</div></div>
            <div class="card metric-card"><div id="dash-trees" class="metric-card__value">0</div><div>Trees Needed</div></div>
        </div>
        <div class="card">
            <h2 class="card__title">Emissions Breakdown</h2>
            <canvas id="dashboard-donut" aria-label="Donut chart showing emissions breakdown" role="img"></canvas>
        </div>
        <div class="card">
            <h2 class="card__title">Log Activity</h2>
            <div class="input-group">
                <label for="log-val" class="input-label">Value (kg CO2)</label>
                <input type="number" id="log-val" class="input-field" min="1" max="1000">
            </div>
            <button id="btn-log" class="btn">Log</button>
        </div>
    `;

    els.totalMetric = document.getElementById('dash-total');
    els.avgMetric = document.getElementById('dash-avg');
    els.treesMetric = document.getElementById('dash-trees');
    els.canvas = document.getElementById('dashboard-donut');
    els.logInput = document.getElementById('log-val');
    els.logBtn = document.getElementById('btn-log');

    els.logInput.addEventListener('input', debounce((e) => {
        e.target.value = sanitize(e.target.value);
    }, 300));

    els.logBtn.addEventListener('click', () => {
        const val = parseInt(els.logInput.value, 10);
        if (val > 0) {
            const logs = loadLogs();
            logs.push({ value: val, date: new Date().toISOString() });
            saveLogs(logs);
            els.logInput.value = '';
            updateDashboard();
        }
    });
}

function updateDashboard() {
    const profile = loadProfile();
    const logs = loadLogs();
    if (!profile) return;

    const logTotal = logs.reduce((sum, log) => sum + log.value, 0);
    const currentTotal = profile.total + logTotal;

    els.totalMetric.textContent = `${currentTotal} kg`;
    els.avgMetric.textContent = `${Math.round(((currentTotal - 4700)/4700)*100)}%`;
    els.treesMetric.textContent = `${estimateTreesToOffset(currentTotal)} 🌳`;

    const breakdownData = [
        profile.breakdown.transport, 
        profile.breakdown.food, 
        profile.breakdown.energy, 
        profile.breakdown.shopping + logTotal
    ];

    renderChart(els.canvas, {
        type: 'doughnut',
        data: {
            labels: ['Transport', 'Food', 'Energy', 'Other'],
            datasets: [{
                data: breakdownData,
                backgroundColor: ['#2d6a4f', '#52b788', '#e9c46a', '#f4a261']
            }]
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
