
import { describe, it, expect } from 'vitest';
import { 
  formatEventTime, 
  formatEventDate, 
  formatEventCardDateTime,
  getUserTimezone,
  getCommonTimezones 
} from '../timezone-utils';

describe('timezone-utils', () => {
  describe('formatEventTime', () => {
    it('should format time correctly in Amsterdam timezone', () => {
      const result = formatEventTime('2024-01-15T19:00:00Z', 'Europe/Amsterdam');
      expect(result).toBe('20:00'); // UTC+1 in winter
    });

    it('should handle different timezones', () => {
      const result = formatEventTime('2024-01-15T19:00:00Z', 'America/New_York');
      expect(result).toBe('14:00'); // UTC-5 in winter
    });

    it('should fallback gracefully on error', () => {
      const result = formatEventTime('invalid-date', 'Europe/Amsterdam');
      expect(result).toBe('Time TBD');
    });
  });

  describe('formatEventDate', () => {
    it('should format date correctly', () => {
      const result = formatEventDate('2024-01-15T19:00:00Z', 'Europe/Amsterdam');
      expect(result).toMatch(/Monday, January 15, 2024/);
    });
  });

  describe('formatEventCardDateTime', () => {
    it('should format single day event with time', () => {
      const result = formatEventCardDateTime('2024-01-15T19:00:00Z', null, 'Europe/Amsterdam');
      expect(result).toContain('20:00');
    });

    it('should format multi-day event', () => {
      const result = formatEventCardDateTime('2024-01-15T19:00:00Z', '2024-01-16T20:00:00Z', 'Europe/Amsterdam');
      expect(result).toContain(' - ');
    });
  });

  describe('getUserTimezone', () => {
    it('should return a valid timezone', () => {
      const timezone = getUserTimezone();
      expect(typeof timezone).toBe('string');
      expect(timezone.length).toBeGreaterThan(0);
    });
  });

  describe('getCommonTimezones', () => {
    it('should return an array of timezone options', () => {
      const timezones = getCommonTimezones();
      expect(Array.isArray(timezones)).toBe(true);
      expect(timezones.length).toBeGreaterThan(0);
      expect(timezones[0]).toHaveProperty('value');
      expect(timezones[0]).toHaveProperty('label');
    });
  });
});
