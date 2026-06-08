import { TREE_OFFSET_KG_PER_YEAR } from '../data/emissions.js';

/**
 * Calculates annual footprint in kg CO2
 * @param {Object} answers - User answers mapped to categories
 * @returns {Object} Total and breakdown footprint
 */
export function calculateAnnualFootprintKg(answers) {
    const transport = (answers.transport || 0);
    const food = (answers.food || 0);
    const energy = (answers.energy || 0);
    const shopping = (answers.shopping || 0);

    const total = transport + food + energy + shopping;
    return {
        total,
        breakdown: { transport, food, energy, shopping }
    };
}

/**
 * Classifies total footprint into low, medium, high
 * @param {number} totalKg - Total annual footprint
 * @returns {string} Classification ('low', 'medium', 'high')
 */
export function classifyFootprint(totalKg) {
    if (totalKg < 4000) return 'low';
    if (totalKg <= 8000) return 'medium';
    return 'high';
}

/**
 * Identifies the highest emission category
 * @param {Object} breakdown - Breakdown of emissions
 * @returns {string} The key of the top category
 */
export function getTopCategory(breakdown) {
    let topCategory = 'transport';
    let maxValue = -1;

    for (const [category, value] of Object.entries(breakdown)) {
        if (value > maxValue) {
            maxValue = value;
            topCategory = category;
        }
    }
    return topCategory;
}

/**
 * Estimates trees required to offset emissions
 * @param {number} totalKg - Total annual emissions
 * @returns {number} Number of trees
 */
export function estimateTreesToOffset(totalKg) {
    return Math.ceil(totalKg / TREE_OFFSET_KG_PER_YEAR);
}

/**
 * Generates sorted recommendations based on top category
 * @param {Object} breakdown - Emission breakdown
 * @param {number} count - Number of recommendations to return
 * @param {Array} allActions - Dataset of all actions
 * @returns {Array} Sorted list of recommendations
 */
export function generateRecommendations(breakdown, count, allActions) {
    const topCategory = getTopCategory(breakdown);
    
    const sortedActions = [...allActions].sort((a, b) => {
        // Boost actions in the top category
        const scoreA = a.savingsKgPerYear * (a.category === topCategory ? 1.5 : 1);
        const scoreB = b.savingsKgPerYear * (b.category === topCategory ? 1.5 : 1);
        return scoreB - scoreA;
    });

    return sortedActions.slice(0, count);
}
