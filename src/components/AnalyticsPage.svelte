<script lang="ts">
  import Icon from "./Icon.svelte";

  const weeklyWashes = [
    { day: "Mo", count: 2 },
    { day: "Di", count: 1 },
    { day: "Mi", count: 3 },
    { day: "Do", count: 0 },
    { day: "Fr", count: 2 },
    { day: "Sa", count: 4 },
    { day: "So", count: 1 },
  ];

  const maxWashes = Math.max(...weeklyWashes.map((w) => w.count), 1);

  const monthlyStats = {
    totalWashes: 42,
    totalItems: 186,
    waterUsed: 2520,
    energyUsed: 63,
    avgLoadEfficiency: 72,
    mostWashedFabric: "Baumwolle",
    busiestDay: "Samstag",
    avgCyclesPerWeek: 10.5,
  };

  const fabricBreakdown = [
    { fabric: "Baumwolle", percent: 45 },
    { fabric: "Synthetik", percent: 22 },
    { fabric: "Mischgewebe", percent: 18 },
    { fabric: "Wolle", percent: 8 },
    { fabric: "Feinwäsche", percent: 5 },
    { fabric: "Leinen", percent: 2 },
  ];

  const colorBreakdown = [
    { group: "Weiß", percent: 35 },
    { group: "Dunkel", percent: 30 },
    { group: "Bunt", percent: 25 },
    { group: "Hell", percent: 10 },
  ];

  let period = "month";
</script>

<div class="page-header">
  <div class="page-header__row">
    <div>
      <h1 class="page-header__title">Statistik</h1>
      <p class="page-header__subtitle">
        Waschgewohnheiten, Ressourcenverbrauch und Effizienz.
      </p>
    </div>
    <div class="period-toggle">
      <fieldset class="filter-group" role="radiogroup" aria-label="Zeitraum">
        <legend class="visually-hidden">Zeitraum</legend>
        {#each [
          { value: "week", label: "Woche" },
          { value: "month", label: "Monat" },
          { value: "year", label: "Jahr" },
        ] as p}
          <label class="filter-chip" class:filter-chip--active={period === p.value}>
            <input type="radio" name="period" value={p.value} bind:group={period} class="visually-hidden" />
            {p.label}
          </label>
        {/each}
      </fieldset>
    </div>
  </div>
</div>

<!-- Key metrics — large numbers, no cards -->
<section class="section" aria-label="Wichtige Kennzahlen">
  <div class="metrics-row">
    <div class="metric">
      <span class="metric__value">{monthlyStats.totalWashes}</span>
      <span class="metric__label">Waschgänge</span>
      <span class="metric__trend metric__trend--up">+12%</span>
    </div>
    <div class="metric">
      <span class="metric__value">{monthlyStats.totalItems}</span>
      <span class="metric__label">Teile gewaschen</span>
    </div>
    <div class="metric">
      <span class="metric__value">{monthlyStats.waterUsed}<span class="metric__unit">L</span></span>
      <span class="metric__label">Wasser</span>
      <span class="metric__trend metric__trend--down">-5%</span>
    </div>
    <div class="metric">
      <span class="metric__value">{monthlyStats.energyUsed}<span class="metric__unit">kWh</span></span>
      <span class="metric__label">Energie</span>
      <span class="metric__trend metric__trend--down">-8%</span>
    </div>
  </div>
</section>

<!-- Charts -->
<div class="analytics-cols">
  <!-- Weekly distribution -->
  <section class="section">
    <h2 class="section__title">Diese Woche</h2>
    <div class="bar-chart" role="img" aria-label="Waschgänge pro Tag">
      {#each weeklyWashes as day}
        <div class="bar-chart__col">
          <div class="bar-chart__bar-wrap">
            <div
              class="bar-chart__bar"
              style="height: {day.count > 0 ? (day.count / maxWashes) * 100 : 0}%"
            >
              {#if day.count > 0}
                <span class="bar-chart__value">{day.count}</span>
              {/if}
            </div>
          </div>
          <span class="bar-chart__label">{day.day}</span>
        </div>
      {/each}
    </div>
  </section>

  <!-- Efficiency -->
  <section class="section">
    <h2 class="section__title">Effizienz</h2>
    <div class="efficiency">
      <div class="efficiency__ring" aria-label="Beladungseffizienz: {monthlyStats.avgLoadEfficiency}%">
        <svg viewBox="0 0 120 120" class="efficiency__svg">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border-light)" stroke-width="6" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--color-text)"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="{(monthlyStats.avgLoadEfficiency / 100) * 326.7} 326.7"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div class="efficiency__ring-label">
          <span class="efficiency__ring-value">{monthlyStats.avgLoadEfficiency}%</span>
          <span class="efficiency__ring-text">Beladung</span>
        </div>
      </div>
      <div class="efficiency__details">
        <div class="efficiency__detail">
          <span class="efficiency__detail-label">Stärkster Tag</span>
          <span class="efficiency__detail-value">{monthlyStats.busiestDay}</span>
        </div>
        <div class="efficiency__detail">
          <span class="efficiency__detail-label">Ø pro Woche</span>
          <span class="efficiency__detail-value">{monthlyStats.avgCyclesPerWeek}</span>
        </div>
        <div class="efficiency__detail">
          <span class="efficiency__detail-label">Top-Stoff</span>
          <span class="efficiency__detail-value">{monthlyStats.mostWashedFabric}</span>
        </div>
      </div>
    </div>
  </section>
</div>

<!-- Breakdowns -->
<div class="analytics-cols">
  <section class="section">
    <h2 class="section__title">Stoffverteilung</h2>
    <div class="breakdown-list">
      {#each fabricBreakdown as fb}
        <div class="breakdown-row">
          <span class="breakdown-row__label">{fb.fabric}</span>
          <div class="breakdown-row__bar-wrap">
            <div
              class="breakdown-row__bar"
              style="width: {fb.percent}%;"
            ></div>
          </div>
          <span class="breakdown-row__pct">{fb.percent}%</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="section">
    <h2 class="section__title">Farbverteilung</h2>
    <div class="breakdown-list">
      {#each colorBreakdown as cb}
        <div class="breakdown-row">
          <span class="breakdown-row__label">{cb.group}</span>
          <div class="breakdown-row__bar-wrap">
            <div
              class="breakdown-row__bar"
              style="width: {cb.percent}%;"
            ></div>
          </div>
          <span class="breakdown-row__pct">{cb.percent}%</span>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .page-header__row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    gap: var(--space-2);
    border: none;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.3125rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: var(--weight-normal);
    color: var(--color-text-tertiary);
    background: transparent;
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition:
      background var(--transition-fast),
      border-color var(--transition-fast),
      color var(--transition-fast);
  }

  .filter-chip:hover {
    border-color: var(--color-text-tertiary);
    color: var(--color-text-secondary);
  }

  .filter-chip--active {
    background: var(--color-text);
    border-color: var(--color-text);
    color: var(--color-text-inverse);
    font-weight: var(--weight-medium);
  }

  /* Metrics row — open, no cards */
  .metrics-row {
    display: flex;
    gap: var(--space-10);
    padding-bottom: var(--space-8);
    border-bottom: 1px solid var(--color-border-light);
    flex-wrap: wrap;
  }

  .metric {
    display: flex;
    flex-direction: column;
  }

  .metric__value {
    font-size: var(--text-3xl);
    font-weight: var(--weight-light);
    color: var(--color-text);
    line-height: 1;
    letter-spacing: var(--tracking-tight);
  }

  .metric__unit {
    font-size: var(--text-lg);
    font-weight: var(--weight-light);
    color: var(--color-text-secondary);
    margin-left: 1px;
  }

  .metric__label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: var(--space-2);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .metric__trend {
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    margin-top: var(--space-1);
  }

  .metric__trend--up {
    color: var(--color-success);
  }

  .metric__trend--down {
    color: var(--color-danger);
  }

  .analytics-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
  }

  @media (max-width: 900px) {
    .analytics-cols {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .metrics-row {
      gap: var(--space-6);
    }
    .metric__value {
      font-size: var(--text-2xl);
    }
  }

  /* Bar chart — monochrome */
  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: var(--space-3);
    height: 10rem;
    padding-top: var(--space-4);
  }

  .bar-chart__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .bar-chart__bar-wrap {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .bar-chart__bar {
    width: 60%;
    max-width: 2rem;
    background: var(--color-text);
    border-radius: var(--radius-sm) var(--radius-sm) 2px 2px;
    min-height: 2px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    transition: height var(--transition-slow);
  }

  .bar-chart__value {
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    color: var(--color-text-inverse);
    padding-top: var(--space-1);
  }

  .bar-chart__label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: var(--space-2);
  }

  /* Efficiency ring — monochrome */
  .efficiency {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .efficiency__ring {
    position: relative;
    width: 7rem;
    height: 7rem;
    margin-bottom: var(--space-6);
  }

  .efficiency__svg {
    width: 100%;
    height: 100%;
  }

  .efficiency__ring-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .efficiency__ring-value {
    display: block;
    font-size: var(--text-xl);
    font-weight: var(--weight-light);
    color: var(--color-text);
    line-height: 1;
  }

  .efficiency__ring-text {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .efficiency__details {
    display: flex;
    gap: var(--space-8);
  }

  .efficiency__detail {
    text-align: center;
  }

  .efficiency__detail-label {
    display: block;
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .efficiency__detail-value {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
    margin-top: var(--space-1);
    display: block;
  }

  /* Breakdown bars — monochrome */
  .breakdown-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .breakdown-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .breakdown-row__label {
    width: 5.5rem;
    font-size: var(--text-sm);
    font-weight: var(--weight-normal);
    color: var(--color-text);
    flex-shrink: 0;
  }

  .breakdown-row__bar-wrap {
    flex: 1;
    height: 3px;
    background: var(--color-surface-sunken);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .breakdown-row__bar {
    height: 100%;
    border-radius: var(--radius-full);
    background: var(--color-text);
    transition: width var(--transition-slow);
  }

  .breakdown-row__pct {
    width: 2.5rem;
    text-align: right;
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }
</style>
