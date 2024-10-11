// labels.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getUniqueColor, createLabels } from './labels';

describe('getUniqueColor', () => {
  let generatedColors: Set<string>;

  beforeEach(() => {
    // Initialize the set before each test
    generatedColors = new Set<string>();
  });

  it('should generate unique colors', () => {
    const color1 = getUniqueColor(0, 5, generatedColors);
    const color2 = getUniqueColor(1, 5, generatedColors);
    expect(color1).not.toBe(color2);
  });

  it('should add generated colors to the set', () => {
    const color = getUniqueColor(0, 5, generatedColors);
    expect(generatedColors.has(color)).toBe(true);
  });
});

describe('createLabels', () => {
  it('should create labels with unique colors', () => {
    const labels = createLabels(7, 3);
    const patientColors = labels.patientInformation.items.map(item => item.color);
    const organizationColors = labels.organizationInformation.items.map(item => item.color);

    const allColors = [...patientColors, ...organizationColors];
    const uniqueColors = new Set(allColors);

    expect(allColors.length).toBe(uniqueColors.size); // Ensures all colors are unique
  });

  it('should create labels with the correct structure', () => {
    const labels = createLabels(7, 3);
    expect(labels.patientInformation.title).toBe('Patient Information');
    expect(labels.organizationInformation.title).toBe('Organization Information');
    expect(labels.patientInformation.items.length).toBe(7);
    expect(labels.organizationInformation.items.length).toBe(3);
  });
});
