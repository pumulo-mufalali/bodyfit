// Unit conversion utilities
export const convertWeight = (weightKg: number, units: 'metric' | 'imperial'): number => {
  if (units === 'imperial') {
    return Math.round(weightKg * 2.20462 * 10) / 10; // Convert kg to lbs
  }
  return weightKg; // Already in kg
};

export const convertHeight = (heightCm: number, units: 'metric' | 'imperial'): { value: number; unit: string } => {
  if (units === 'imperial') {
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { value: feet, unit: `${feet}'${inches}"` };
  }
  return { value: heightCm, unit: 'cm' };
};

export const getWeightUnit = (units: 'metric' | 'imperial'): string => {
  return units === 'imperial' ? 'lbs' : 'kg';
};

export const getHeightUnit = (units: 'metric' | 'imperial'): string => {
  return units === 'imperial' ? 'ft' : 'cm';
};

// Format weight for display
export const formatWeight = (weightKg: number, units: 'metric' | 'imperial'): string => {
  const weight = convertWeight(weightKg, units);
  const unit = getWeightUnit(units);
  return `${weight} ${unit}`;
};

// Format height for display
export const formatHeight = (heightCm: number, units: 'metric' | 'imperial'): string => {
  if (units === 'imperial') {
    const { unit } = convertHeight(heightCm, units);
    return unit;
  }
  return `${heightCm} cm`;
};

// Convert weight data for charts
export const convertWeightData = (weightData: { week: string; weight: number }[], units: 'metric' | 'imperial') => {
  return weightData.map(item => ({
    ...item,
    weight: convertWeight(item.weight, units)
  }));
};
