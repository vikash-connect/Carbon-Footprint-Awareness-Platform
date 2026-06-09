export type FoodType = "vegan" | "vegetarian" | "omnivore" | "meat-heavy";

export interface FootprintData {
  travel: number;
  foodType: FoodType;
  energyUse: number;
}

const EMISSION_FACTORS = {
  travelPerKm: 0.21,   // kg CO2e per km
  energyPerKwh: 0.233, // kg CO2e per kWh
  foodDaily: {
    "vegan": 2.5,
    "vegetarian": 3.2,
    "omnivore": 5.5,
    "meat-heavy": 7.2,
  }
};

// Pure function: Calculates daily carbon score based on inputs
export const calculateCarbonScore = (data: FootprintData): number => {
  const travelEmissions = data.travel * EMISSION_FACTORS.travelPerKm;
  const energyEmissions = data.energyUse * EMISSION_FACTORS.energyPerKwh;
  const foodEmissions = EMISSION_FACTORS.foodDaily[data.foodType];

  return travelEmissions + energyEmissions + foodEmissions;
};

// Pure function: Generates tips based strictly on data thresholds
export const generateTips = (data: FootprintData): string[] => {
  const tips: string[] = [];
  
  if (data.travel > 20) tips.push("Consider public transit or carpooling to reduce transport emissions.");
  if (data.foodType === "meat-heavy" || data.foodType === "omnivore") tips.push("Swap one meat meal for a plant-based option today.");
  if (data.energyUse > 15) tips.push("Unplug unused electronics and switch to LED bulbs to conserve energy.");
  
  if (tips.length === 0) tips.push("Great job! Your footprint is low today. Keep up the sustainable habits!");
  
  return tips;
};
