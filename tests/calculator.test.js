import { 
    calculateAnnualFootprintKg, 
    classifyFootprint, 
    getTopCategory, 
    estimateTreesToOffset, 
    generateRecommendations 
} from '../src/modules/calculator.js';

describe('Calculator Module', () => {
    describe('calculateAnnualFootprintKg', () => {
        it('handles zero-value inputs correctly', () => {
            const answers = { transport: 0, food: 0, energy: 0, shopping: 0 };
            const result = calculateAnnualFootprintKg(answers);
            expect(result.total).toBe(0);
            expect(result.breakdown).toEqual(answers);
        });

        it('handles missing keys gracefully', () => {
            const result = calculateAnnualFootprintKg({ transport: 100 });
            expect(result.total).toBe(100);
            expect(result.breakdown).toEqual({ transport: 100, food: 0, energy: 0, shopping: 0 });
        });

        it('calculates total footprint correctly for known values', () => {
            // e.g. driving 10km/day * 365 * 0.21 = 766.5 kg
            const answers = { transport: 766.5, food: 1000, energy: 2000, shopping: 500 };
            const result = calculateAnnualFootprintKg(answers);
            expect(result.total).toBe(4266.5);
            expect(result.breakdown).toEqual(answers);
        });
    });

    describe('classifyFootprint', () => {
        it('classifies footprint as low if < 4000', () => {
            expect(classifyFootprint(3999)).toBe('low');
            expect(classifyFootprint(0)).toBe('low');
        });

        it('classifies footprint as medium if 4000 - 8000', () => {
            expect(classifyFootprint(4000)).toBe('medium');
            expect(classifyFootprint(8000)).toBe('medium');
        });

        it('classifies footprint as high if > 8000', () => {
            expect(classifyFootprint(8001)).toBe('high');
            expect(classifyFootprint(15000)).toBe('high');
        });
    });

    describe('getTopCategory', () => {
        it('returns the category with the highest emission', () => {
            const breakdown = { transport: 100, food: 500, energy: 200, shopping: 50 };
            expect(getTopCategory(breakdown)).toBe('food');
        });

        it('returns transport as default if all zero', () => {
            const breakdown = { transport: 0, food: 0, energy: 0, shopping: 0 };
            expect(getTopCategory(breakdown)).toBe('transport');
        });
    });

    describe('estimateTreesToOffset', () => {
        it('estimates trees correctly based on 21kg per year', () => {
            expect(estimateTreesToOffset(21)).toBe(1);
            expect(estimateTreesToOffset(42)).toBe(2);
            expect(estimateTreesToOffset(10)).toBe(1); // Math.ceil
            expect(estimateTreesToOffset(0)).toBe(0);
        });
    });

    describe('generateRecommendations', () => {
        const mockActions = [
            { id: '1', category: 'transport', savingsKgPerYear: 100 },
            { id: '2', category: 'transport', savingsKgPerYear: 200 },
            { id: '3', category: 'food', savingsKgPerYear: 300 }
        ];

        it('boosts actions from the top category', () => {
            const breakdown = { transport: 1000, food: 100 }; // top is transport
            const clearBreakdown = { transport: 1000, food: 100 }; 
            const clearActions = [
                { id: '1', category: 'transport', savingsKgPerYear: 250 }, // Boosted: 375
                { id: '2', category: 'food', savingsKgPerYear: 300 }       // Boosted: 300
            ];
            const clearRecs = generateRecommendations(clearBreakdown, 2, clearActions);
            expect(clearRecs[0].id).toBe('1');
        });

        it('respects the count limit', () => {
            const breakdown = { transport: 100 };
            const recs = generateRecommendations(breakdown, 1, mockActions);
            expect(recs.length).toBe(1);
        });
    });
});
