import { calculateCarbonScore, generateTips } from '../lib/utils/calculations';

describe('Carbon Calculations', () => {
  it('should accurately calculate total carbon score without side effects', () => {
    const data = { travel: 10, energyUse: 5, foodType: 'vegan' as const };
    // Expected: (10 * 0.21) + (5 * 0.233) + 2.5 = 2.1 + 1.165 + 2.5 = 5.765
    expect(calculateCarbonScore(data)).toBeCloseTo(5.765, 3);
  });

  it('should generate personalized tips for high-emission areas', () => {
    const data = { travel: 30, energyUse: 2, foodType: 'omnivore' as const };
    const tips = generateTips(data);
    expect(tips.length).toBe(2);
    expect(tips[0]).toContain("public transit");
    expect(tips[1]).toContain("plant-based");
  });
});
