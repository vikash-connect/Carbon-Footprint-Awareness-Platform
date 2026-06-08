import { RECOMMENDED_ACTIONS } from '../data/actions.js';
import { loadProfile } from '../modules/storage.js';
import { generateRecommendations } from '../modules/calculator.js';

let els = {};

export function initActions(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!els.list) {
        buildActionsDOM(container);
    }
    
    updateActions();
}

function buildActionsDOM(container) {
    container.innerHTML = `
        <div class="card" style="background: var(--primary-color); color: white;">
            <h2>Daily Challenge</h2>
            <p>Meatless Monday: Save 4.5kg CO2 today!</p>
            <button class="btn btn--outline" style="border-color: white; color: white;" id="btn-challenge">Accept</button>
        </div>
        <h2>Top Recommendations</h2>
        <div id="actions-list"></div>
    `;
    
    els.list = document.getElementById('actions-list');
    document.getElementById('btn-challenge').addEventListener('click', (e) => {
        e.target.textContent = 'Accepted ✓';
    });
}

function updateActions() {
    const profile = loadProfile();
    if (!profile) return;

    const recs = generateRecommendations(profile.breakdown, 5, RECOMMENDED_ACTIONS);
    
    els.list.innerHTML = ''; 
    
    recs.forEach(action => {
        const card = document.createElement('div');
        card.className = 'card action-card';
        
        const info = document.createElement('div');
        info.className = 'action-card__info';
        
        const title = document.createElement('h3');
        title.textContent = action.title;
        
        const badge = document.createElement('span');
        badge.className = `badge badge--${action.difficulty}`;
        badge.textContent = action.difficulty;
        title.appendChild(badge);
        
        const savings = document.createElement('p');
        savings.textContent = `Saves ${action.savingsKgPerYear} kg/yr`;
        
        info.appendChild(title);
        info.appendChild(savings);
        
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.width = 'auto';
        btn.textContent = 'Commit';
        btn.addEventListener('click', (e) => {
            e.target.textContent = 'Committed ✓';
            e.target.style.background = 'var(--muted-text)';
            e.target.style.color = 'white';
        });
        
        card.appendChild(info);
        card.appendChild(btn);
        
        els.list.appendChild(card);
    });
}
