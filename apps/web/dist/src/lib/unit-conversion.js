// Unit conversion utilities
export const convertWeight = (weightKg, units) => {
    if (units === 'imperial') {
        return Math.round(weightKg * 2.20462 * 10) / 10; // Convert kg to lbs
    }
    return weightKg; // Already in kg
};
export const convertHeight = (heightCm, units) => {
    if (units === 'imperial') {
        const totalInches = heightCm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return { value: feet, unit: `${feet}'${inches}"` };
    }
    return { value: heightCm, unit: 'cm' };
};
export const getWeightUnit = (units) => {
    return units === 'imperial' ? 'lbs' : 'kg';
};
export const getHeightUnit = (units) => {
    return units === 'imperial' ? 'ft' : 'cm';
};
// Format weight for display
export const formatWeight = (weightKg, units) => {
    const weight = convertWeight(weightKg, units);
    const unit = getWeightUnit(units);
    return `${weight} ${unit}`;
};
// Format height for display
export const formatHeight = (heightCm, units) => {
    if (units === 'imperial') {
        const { unit } = convertHeight(heightCm, units);
        return unit;
    }
    return `${heightCm} cm`;
};
// Convert weight data for charts
export const convertWeightData = (weightData, units) => {
    return weightData.map(item => ({
        ...item,
        weight: convertWeight(item.weight, units)
    }));
};
