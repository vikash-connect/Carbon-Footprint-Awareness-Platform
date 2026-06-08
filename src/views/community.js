let els = {};

export function initCommunity(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!els.leaderboard) {
        buildCommunityDOM(container);
    }
    updateCommunity();
}

function buildCommunityDOM(container) {
    container.innerHTML = `
        <div class="card">
            <h2>7-Day Streak</h2>
            <div class="streak-grid" id="streak-grid"></div>
        </div>
        <div class="card">
            <h2>Leaderboard</h2>
            <div id="leaderboard-list"></div>
        </div>
    `;
    els.streak = document.getElementById('streak-grid');
    els.leaderboard = document.getElementById('leaderboard-list');
}

function updateCommunity() {
    // Render Streak
    els.streak.innerHTML = '';
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const activeDays = [true, true, false, false, false, false, false]; // Mock data
    
    days.forEach((day, i) => {
        const el = document.createElement('div');
        el.className = `streak-day ${activeDays[i] ? 'streak-day--active' : ''}`;
        el.textContent = day;
        els.streak.appendChild(el);
    });

    // Animate leaderboard load with requestAnimationFrame
    requestAnimationFrame(() => {
        renderLeaderboard();
    });
}

function renderLeaderboard() {
    els.leaderboard.innerHTML = '';
    const users = [
        { name: 'Alex M.', score: 3200 },
        { name: 'Sarah K.', score: 3800 },
        { name: 'You', score: 4000 }
    ];

    users.forEach((u, i) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.padding = '8px 0';
        row.style.borderBottom = '1px solid #eee';
        
        const name = document.createElement('span');
        name.textContent = `${i + 1}. ${u.name}`;
        if (u.name === 'You') name.style.fontWeight = 'bold';
        
        const score = document.createElement('span');
        score.textContent = `${u.score} kg`;
        
        row.appendChild(name);
        row.appendChild(score);
        els.leaderboard.appendChild(row);
    });
}
