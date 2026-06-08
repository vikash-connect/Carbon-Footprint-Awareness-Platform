import { createElement, emptyElement } from '../modules/renderer.js';
import { calculateAnnualFootprintKg, classifyFootprint } from '../modules/calculator.js';
import { saveProfile } from '../modules/storage.js';

const QUIZ_QUESTIONS = [
    {
        id: 'transport',
        title: 'How do you mostly get around?',
        options: [
            { label: 'Car', value: 2400, icon: '🚗' },
            { label: 'Public Transit', value: 800, icon: '🚌' },
            { label: 'Walk / Bike', value: 100, icon: '🚲' }
        ]
    },
    {
        id: 'flights',
        title: 'How often do you fly per year?',
        options: [
            { label: 'Never', value: 0, icon: '🚫' },
            { label: '1-2 times', value: 1100, icon: '✈️' },
            { label: '3+ times', value: 2500, icon: '🛫' }
        ]
    },
    {
        id: 'diet',
        title: 'What\'s your typical diet?',
        options: [
            { label: 'Vegan', value: 500, icon: '🥗' },
            { label: 'Vegetarian', value: 800, icon: '🧀' },
            { label: 'Meat Eater', value: 1500, icon: '🥩' }
        ]
    },
    {
        id: 'energy',
        title: 'Home Energy Source?',
        options: [
            { label: 'Renewable', value: 400, icon: '☀️' },
            { label: 'Standard Grid', value: 1200, icon: '⚡' }
        ]
    },
    {
        id: 'shopping',
        title: 'Shopping Habits?',
        options: [
            { label: 'Minimal', value: 300, icon: '🌱' },
            { label: 'Moderate', value: 800, icon: '👕' },
            { label: 'Frequent', value: 1500, icon: '🛍️' }
        ]
    }
];

let currentStep = 0;
let answers = {};
let onCompleteCallback = null;

export function initOnboarding(containerId, onComplete) {
    currentStep = 0;
    answers = {};
    const container = document.getElementById(containerId);
    if (!container) return;
    onCompleteCallback = onComplete;
    renderStep(container);
}

function renderStep(container) {
    emptyElement(container);

    if (currentStep >= QUIZ_QUESTIONS.length) {
        renderResult(container);
        return;
    }

    const question = QUIZ_QUESTIONS[currentStep];

    const progressContainer = createElement('div', { className: 'progress-bar', role: 'progressbar', 'aria-valuenow': currentStep, 'aria-valuemin': 0, 'aria-valuemax': QUIZ_QUESTIONS.length });
    const progressFill = createElement('div', { className: 'progress-bar__fill' });
    progressFill.style.width = `${(currentStep / QUIZ_QUESTIONS.length) * 100}%`;
    progressContainer.appendChild(progressFill);
    container.appendChild(progressContainer);

    const title = createElement('h2', { textContent: question.title, id: 'q-title' });
    container.appendChild(title);

    const optionsGrid = createElement('div', { className: 'input-group', role: 'group', 'aria-labelledby': 'q-title' });
    
    question.options.forEach(opt => {
        const btn = createElement('button', { 
            className: 'card btn--outline', 
            style: 'margin-bottom: 10px;',
            onclick: () => handleSelect(container, question.id, opt.value),
            'aria-label': opt.label
        }, [
            createElement('div', { textContent: opt.icon, style: 'font-size: 2rem;', 'aria-hidden': 'true' }),
            createElement('div', { textContent: opt.label })
        ]);
        optionsGrid.appendChild(btn);
    });

    container.appendChild(optionsGrid);
}

function handleSelect(container, category, value) {
    if (category === 'flights') {
        answers['transport'] = (answers['transport'] || 0) + value;
    } else {
        answers[category] = value;
    }
    
    currentStep++;
    renderStep(container);
}

function renderResult(container) {
    const { total, breakdown } = calculateAnnualFootprintKg(answers);
    const classification = classifyFootprint(total);

    const profile = { total, breakdown, classification, completed: true };
    saveProfile(profile);

    const title = createElement('h2', { textContent: 'Your Footprint Profile' });
    const score = createElement('div', { className: `metric-card__value`, textContent: `${total} kg CO2/yr`, style: 'margin-bottom: 16px; font-size: 2rem;' });
    
    // Accessibility color labels
    let label = 'Medium (Amber)';
    let icon = '⚠';
    if (classification === 'low') { label = 'Good (Green)'; icon = '✓'; }
    if (classification === 'high') { label = 'High (Red)'; icon = '✕'; }

    const status = createElement('p', { textContent: `Status: ${label} ${icon}`, style: 'margin-bottom: 24px; font-weight: bold;' });

    const btn = createElement('button', { className: 'btn', textContent: 'Go to Dashboard', onclick: () => onCompleteCallback() });

    container.appendChild(title);
    container.appendChild(score);
    container.appendChild(status);
    container.appendChild(btn);
}
