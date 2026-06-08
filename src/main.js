import { loadProfile } from './modules/storage.js';
import { initOnboarding } from './views/onboarding.js';
import { initDashboard } from './views/dashboard.js';
import { initActions } from './views/actions.js';
import { initCommunity } from './views/community.js';

/**
 * Returns the application version
 * @returns {string} Semver string
 */
export function getAppVersion() {
    return '1.0.0';
}

const views = {
    onboarding: document.getElementById('view-onboarding'),
    dashboard: document.getElementById('view-dashboard'),
    actions: document.getElementById('view-actions'),
    community: document.getElementById('view-community')
};

const nav = document.getElementById('main-nav');
const navBtns = document.querySelectorAll('.nav__item');

function showView(viewId) {
    Object.values(views).forEach(v => {
        if (v) {
            v.hidden = true;
            v.setAttribute('aria-hidden', 'true');
        }
    });
    
    if (views[viewId]) {
        views[viewId].hidden = false;
        views[viewId].setAttribute('aria-hidden', 'false');
    }

    navBtns.forEach(btn => btn.classList.remove('nav__item--active'));
    const activeBtn = document.querySelector(`.nav__item[data-target="${viewId}"]`);
    if (activeBtn) activeBtn.classList.add('nav__item--active');
}

function routeTo(viewId) {
    showView(viewId);
    
    if (viewId === 'dashboard') initDashboard('dashboard-content');
    if (viewId === 'actions') initActions('actions-content');
    if (viewId === 'community') initCommunity('community-content');
}

function initApp() {
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.target;
            routeTo(target);
        });
    });

    const profile = loadProfile();
    if (profile && profile.completed) {
        nav.hidden = false;
        routeTo('dashboard');
    } else {
        nav.hidden = true;
        showView('onboarding');
        initOnboarding('onboarding-content', () => {
            nav.hidden = false;
            routeTo('dashboard');
        });
    }
}

document.addEventListener('DOMContentLoaded', initApp);
