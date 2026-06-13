import { describe, it, expect } from 'vitest';
import { SprintAnalyticsEngine, DailySnapshot } from '../lib/sprint-analytics';

describe('SprintAnalyticsEngine', () => {
  it('correctly calculates burndown metrics and trajectory', () => {
    const history: DailySnapshot[] = [
      { day: 1, date: '2026-11-20', remainingPoints: 45, completedPoints: 5, addedPoints: 0 },
      { day: 2, date: '2026-11-21', remainingPoints: 38, completedPoints: 7, addedPoints: 0 },
      { day: 3, date: '2026-11-22', remainingPoints: 30, completedPoints: 8, addedPoints: 0 },
      { day: 4, date: '2026-11-23', remainingPoints: 22, completedPoints: 8, addedPoints: 0 },
      { day: 5, date: '2026-11-24', remainingPoints: 15, completedPoints: 7, addedPoints: 0 },
    ];

    const result = SprintAnalyticsEngine.calculateBurndown(50, 10, history);

    expect(result.sprintLengthDays).toBe(10);
    expect(result.totalInitialPoints).toBe(50);
    expect(result.idealBurnRate).toBe(5);
    expect(result.actualBurnRate).toBe(7);
    expect(result.trajectory).toBe('ahead');
    expect(result.scopeCreepPercent).toBe(0);
    expect(result.dailyProgress.length).toBe(5);
  });

  it('detects scope creep and at_risk status', () => {
    const history: DailySnapshot[] = [
      { day: 1, date: '2026-11-20', remainingPoints: 55, completedPoints: 0, addedPoints: 5 },
      { day: 2, date: '2026-11-21', remainingPoints: 58, completedPoints: 2, addedPoints: 5 },
    ];

    const result = SprintAnalyticsEngine.calculateBurndown(50, 10, history);
    expect(result.scopeCreepPercent).toBe(20);
    expect(result.trajectory).toBe('behind');
  });

  it('performs Monte Carlo completion forecasting', () => {
    const historicalVelocities = [20, 25, 22, 28, 24];
    const forecast = SprintAnalyticsEngine.forecastCompletion(100, historicalVelocities, 1000);

    expect(forecast.p50Sprints).toBeGreaterThanOrEqual(4);
    expect(forecast.p50Sprints).toBeLessThanOrEqual(6);
    expect(forecast.p95Sprints).toBeGreaterThanOrEqual(forecast.p50Sprints);
  });
});
