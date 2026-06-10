/**
 * SprintFlow Analytics & Velocity Forecasting Engine
 * Computes burndown metrics, scope creep volatility, and Monte Carlo completion probability.
 */

export interface DailySnapshot {
  day: number;
  date: string;
  remainingPoints: number;
  completedPoints: number;
  addedPoints: number;
}

export interface BurndownAnalysis {
  sprintLengthDays: number;
  totalInitialPoints: number;
  idealBurnRate: number;
  actualBurnRate: number;
  projectedEndPoints: number;
  scopeCreepPercent: number;
  trajectory: 'ahead' | 'on_track' | 'at_risk' | 'behind';
  dailyProgress: Array<DailySnapshot & { idealRemaining: number }>;
}

export class SprintAnalyticsEngine {
  /**
   * Computes comprehensive burndown and velocity analysis for a given sprint.
   */
  public static calculateBurndown(
    initialStoryPoints: number,
    sprintLengthDays: number,
    history: DailySnapshot[]
  ): BurndownAnalysis {
    if (sprintLengthDays <= 0) {
      throw new Error("sprintLengthDays must be greater than zero");
    }

    const idealBurnRate = initialStoryPoints / sprintLengthDays;
    let totalScopeAdded = 0;

    const dailyProgress = history.map((snapshot) => {
      totalScopeAdded += snapshot.addedPoints;
      const idealRemaining = Math.max(0, initialStoryPoints - idealBurnRate * snapshot.day);
      return {
        ...snapshot,
        idealRemaining: Math.round(idealRemaining * 10) / 10,
      };
    });

    const currentDay = history.length > 0 ? history[history.length - 1].day : 0;
    const currentRemaining = history.length > 0 
      ? history[history.length - 1].remainingPoints 
      : initialStoryPoints;

    const actualBurnRate = currentDay > 0 
      ? (initialStoryPoints + totalScopeAdded - currentRemaining) / currentDay 
      : 0;

    const daysRemaining = Math.max(0, sprintLengthDays - currentDay);
    const projectedEndPoints = Math.max(0, currentRemaining - actualBurnRate * daysRemaining);
    const scopeCreepPercent = initialStoryPoints > 0 
      ? Math.round((totalScopeAdded / initialStoryPoints) * 100) 
      : 0;

    let trajectory: 'ahead' | 'on_track' | 'at_risk' | 'behind' = 'on_track';
    const idealCurrent = Math.max(0, initialStoryPoints - idealBurnRate * currentDay);
    const deviation = currentRemaining - idealCurrent;

    if (deviation <= -2) {
      trajectory = 'ahead';
    } else if (deviation <= 2) {
      trajectory = 'on_track';
    } else if (deviation <= 8) {
      trajectory = 'at_risk';
    } else {
      trajectory = 'behind';
    }

    return {
      sprintLengthDays,
      totalInitialPoints: initialStoryPoints,
      idealBurnRate: Math.round(idealBurnRate * 100) / 100,
      actualBurnRate: Math.round(actualBurnRate * 100) / 100,
      projectedEndPoints: Math.round(projectedEndPoints * 10) / 10,
      scopeCreepPercent,
      trajectory,
      dailyProgress,
    };
  }

  /**
   * Forecasts the probability of finishing a backlog using Monte Carlo velocity simulation.
   */
  public static forecastCompletion(
    remainingPoints: number,
    historicalVelocities: number[],
    simulations = 5000
  ): { p50Sprints: number; p80Sprints: number; p95Sprints: number } {
    if (historicalVelocities.length === 0) {
      return { p50Sprints: 0, p80Sprints: 0, p95Sprints: 0 };
    }

    const sprintCounts: number[] = [];

    for (let i = 0; i < simulations; i++) {
      let pointsLeft = remainingPoints;
      let sprints = 0;
      while (pointsLeft > 0 && sprints < 100) {
        const randomIndex = Math.floor(Math.random() * historicalVelocities.length);
        const velocity = Math.max(1, historicalVelocities[randomIndex]);
        pointsLeft -= velocity;
        sprints++;
      }
      sprintCounts.push(sprints);
    }

    sprintCounts.sort((a, b) => a - b);

    const p50 = sprintCounts[Math.floor(simulations * 0.5)];
    const p80 = sprintCounts[Math.floor(simulations * 0.8)];
    const p95 = sprintCounts[Math.floor(simulations * 0.95)];

    return { p50Sprints: p50, p80Sprints: p80, p95Sprints: p95 };
  }
}
