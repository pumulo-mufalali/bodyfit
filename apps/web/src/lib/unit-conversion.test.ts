import { describe, it, expect } from 'vitest';
import {
  convertWeight,
  convertHeight,
  getWeightUnit,
  getHeightUnit,
  formatWeight,
  formatHeight,
  convertWeightData,
} from './unit-conversion';

describe('unit-conversion utilities', () => {
  describe('convertWeight', () => {
    it('should convert kg to lbs', () => {
      const result = convertWeight(100, 'imperial');
      expect(result).toBeCloseTo(220.5, 1);
    });

    it('should return kg unchanged for metric', () => {
      const result = convertWeight(100, 'metric');
      expect(result).toBe(100);
    });

    it('should handle zero weight', () => {
      expect(convertWeight(0, 'metric')).toBe(0);
      expect(convertWeight(0, 'imperial')).toBe(0);
    });
  });

  describe('convertHeight', () => {
    it('should convert cm to feet and inches', () => {
      const result = convertHeight(175, 'imperial');
      expect(result.value).toBe(5);
      expect(result.unit).toBe("5'9\"");
    });

    it('should return cm unchanged for metric', () => {
      const result = convertHeight(175, 'metric');
      expect(result.value).toBe(175);
      expect(result.unit).toBe('cm');
    });

    it('should handle edge cases', () => {
      const result = convertHeight(152, 'imperial');
      expect(result.value).toBe(5);
      expect(result.unit).toContain("5'");
    });
  });

  describe('getWeightUnit', () => {
    it('should return lbs for imperial', () => {
      expect(getWeightUnit('imperial')).toBe('lbs');
    });

    it('should return kg for metric', () => {
      expect(getWeightUnit('metric')).toBe('kg');
    });
  });

  describe('getHeightUnit', () => {
    it('should return ft for imperial', () => {
      expect(getHeightUnit('imperial')).toBe('ft');
    });

    it('should return cm for metric', () => {
      expect(getHeightUnit('metric')).toBe('cm');
    });
  });

  describe('formatWeight', () => {
    it('should format metric weight', () => {
      const result = formatWeight(100, 'metric');
      expect(result).toBe('100 kg');
    });

    it('should format imperial weight', () => {
      const result = formatWeight(100, 'imperial');
      expect(result).toContain('lbs');
      expect(result).toContain('220.5');
    });
  });

  describe('formatHeight', () => {
    it('should format metric height', () => {
      const result = formatHeight(175, 'metric');
      expect(result).toBe('175 cm');
    });

    it('should format imperial height', () => {
      const result = formatHeight(175, 'imperial');
      expect(result).toContain("'");
      expect(result).toContain('"');
    });
  });

  describe('convertWeightData', () => {
    it('should convert weight data array to imperial', () => {
      const data = [
        { week: 'W1', weight: 100 },
        { week: 'W2', weight: 99 },
      ];
      
      const result = convertWeightData(data, 'imperial');
      
      expect(result[0].weight).toBeCloseTo(220.5, 1);
      expect(result[1].weight).toBeCloseTo(218.3, 1);
    });

    it('should leave metric data unchanged', () => {
      const data = [
        { week: 'W1', weight: 100 },
        { week: 'W2', weight: 99 },
      ];
      
      const result = convertWeightData(data, 'metric');
      
      expect(result[0].weight).toBe(100);
      expect(result[1].weight).toBe(99);
    });

    it('should preserve week labels', () => {
      const data = [
        { week: 'W1', weight: 100 },
      ];
      
      const result = convertWeightData(data, 'metric');
      
      expect(result[0].week).toBe('W1');
    });
  });
});

