
import { describe, it, expect } from 'vitest';
import { 
  formatEventDateTime, 
  getUserTimezone,
  getCommonTimezones,
  formatEventTime,
  formatEventDate,
  formatEventCardDateTime
} from '../timezone-utils';

describe('timezone-utils', () => {
  describe('formatEventDateTime', () => {
    it('should format datetime correctly in Amsterdam timezone', () => {
      const result = formatEventDateTime({
        start_date: '2024-01-15',
        start_time: '19:00:00',
        timezone: 'Europe/Amsterdam'
      });
      expect(result.time).toBe('19:00');
      expect(result.date).toContain('15 Jan');
    });

    it('should handle different timezones', () => {
      const result = formatEventDateTime({
        start_date: '2024-01-15',
        start_time: '19:00:00',
        timezone: 'America/New_York'
      });
      expect(result.time).toBe('19:00');
    });

    it('should fallback gracefully on error', () => {
      const result = formatEventDateTime({
        start_date: 'invalid-date',
        start_time: '19:00:00',
        timezone: 'Europe/Amsterdam'
      });
      expect(result.date).toBe('Date error');
    });
  });

  describe('formatEventTime', () => {
    it('should format time correctly', () => {
      const result = formatEventTime('2024-01-15', '19:00:00', 'Europe/Amsterdam');
      expect(result).toBe('19:00');
    });
  });

  describe('formatEventDate', () => {
    it('should format date correctly', () => {
      const result = formatEventDate('2024-01-15', 'Europe/Amsterdam');
      expect(result).toMatch(/Mon, Jan 15, 2024/);
    });
  });

  describe('formatEventCardDateTime', () => {
    it('should format single day event with time', () => {
      const result = formatEventCardDateTime('2024-01-15', '19:00:00', undefined, 'Europe/Amsterdam');
      expect(result).toContain('19:00');
    });

    it('should format multi-day event', () => {
      const result = formatEventCardDateTime('2024-01-15', '19:00:00', '2024-01-16', 'Europe/Amsterdam');
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
