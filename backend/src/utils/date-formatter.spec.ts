import { describe, it, expect } from 'vitest';
import { mapDateToDateString } from './date-formatter';

describe('mapDateToDateString', () => {
  it('should format a given date to YYYY-MM-DD', () => {
    // Given
    const date = new Date('2025-11-09T15:45:30Z');

    // When
    const result = mapDateToDateString(date);

    // Then
    expect(result).toBe('2025-11-09');
  });
});
