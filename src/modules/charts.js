/**
 * WeakMap to store Chart instances securely and avoid memory leaks
 */
const chartInstances = new WeakMap();

/**
 * Initializes or updates a Chart.js instance
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} config - Chart.js configuration object
 */
export function renderChart(canvas, config) {
    if (!canvas) return;

    // Destroy existing instance to prevent memory leaks
    if (chartInstances.has(canvas)) {
        chartInstances.get(canvas).destroy();
    }

    // Chart is loaded via CDN globally
    if (typeof window.Chart !== 'undefined') {
        const instance = new window.Chart(canvas, config);
        chartInstances.set(canvas, instance);
    } else {
        console.error('Chart.js is not loaded.');
    }
}
