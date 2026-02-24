<script lang="ts">
  import Icon from "./Icon.svelte";

  // Mock analytics data (would come from API)
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
    waterUsed: 2520, // liters
    energyUsed: 63, // kWh
    avgLoadEfficiency: 72, // percent
    mostWashedFabric: "Baumwolle",
    busiestDay: "Samstag",
    avgCyclesPerWeek: 10.5,
  };

  const fabricBreakdown = [
    { fabric: "Baumwolle", percent: 45, color: "var(--color-green-600)" },
    { fabric: "Synthetik", percent: 22, color: "var(--color-orange-600)" },
    { fabric: "Mischgewebe", percent: 18, color: "var(--color-green-400)" },
    { fabric: "Wolle", percent: 8, color: "var(--color-orange-400)" },
    { fabric: "Feinwäsche", percent: 5, color: "var(--color-text-tertiary)" },
    { fabric: "Leinen", percent: 2, color: "var(--color-border)" },
  ];

  const colorBreakdown = [
    { group: "Weiß", percent: 35, color: "var(--color-border)" },
    { group: "Dunkel", percent: 30, color: "var(--color-text)" },
    { group: "Bunt", percent: 25, color: "var(--color-orange-500)" },
    { group: "Hell", percent: 10, color: "var(--color-green-100)" },
  ];

  let period = "month";
</script>

<div class="page-header">
  <div class="page-header__row">
    <div>
      <h1 class="page-header__title">Statistik</h1>
      <p class="page-header__subtitle">
        Verfolge deine Waschgewohnheiten, Ressourcenverbrauch und Effizienz.
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

<!-- Key metrics -->
<section class="section" aria-label="Wichtige Kennzahlen">
  <div class="grid grid--stats">
    <div class="card stat">
      <div class="stat__value">{monthlyStats.totalWashes}</div>
      <div class="stat__label">Waschgänge gesamt</div>
      <div class="stat__trend stat__trend--up">+12% gg. Vormonat</div>
    </div>
    <div class="card stat">
      <div class="stat__value">{monthlyStats.totalItems}</div>
      <div class="stat__label">Teile gewaschen</div>
    </div>
    <div class="card stat">
      <div class="stat__value">{monthlyStats.waterUsed}L</div>
      <div class="stat__label">Wasserverbrauch</div>
      <div class="stat__trend stat__trend--down">-5% gg. Vormonat</div>
    </div>
    <div class="card stat">
      <div class="stat__value">{monthlyStats.energyUsed} kWh</div>
      <div class="stat__label">Energieverbrauch</div>
      <div class="stat__trend stat__trend--down">-8% gg. Vormonat</div>
    </div>
  </div>
</section>

<!-- Charts row -->
<div class="analytics-cols">
  <!-- Weekly distribution bar chart -->
  <section class="section">
    <h2 class="section__title">Waschgänge diese Woche</h2>
    <div class="card">
      <div class="bar-chart" role="img" aria-label="Balkendiagramm: Waschgänge pro Tag diese Woche">
        {#each weeklyWashes as day}
          <div class="bar-chart__col">
            <div class="bar-chart__bar-wrap">
              <div
                class="bar-chart__bar"
                style="height: {(day.count / maxWashes) * 100}%"
                aria-label="{day.day}: {day.count} washes"
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
    </div>
  </section>

  <!-- Efficiency -->
  <section class="section">
    <h2 class="section__title">Effizienz</h2>
    <div class="card">
      <div class="efficiency-ring" aria-label="Beladungseffizienz: {monthlyStats.avgLoadEfficiency}%">
        <svg viewBox="0 0 120 120" class="ring-svg">
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--color-green-400)" />
              <stop offset="100%" stop-color="var(--color-green-700)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-surface-sunken)" stroke-width="8" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="url(#ring-grad)"
            stroke-width="8"
            stroke-linecap="round"
            stroke-dasharray="{(monthlyStats.avgLoadEfficiency / 100) * 326.7} 326.7"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div class="ring-label">
          <span class="ring-value">{monthlyStats.avgLoadEfficiency}%</span>
          <span class="ring-text">Ø Beladung</span>
        </div>
      </div>
      <div class="efficiency-details">
        <div class="efficiency-detail">
          <span class="efficiency-detail__label">Stärkster Tag</span>
          <span class="efficiency-detail__value">{monthlyStats.busiestDay}</span>
        </div>
        <div class="efficiency-detail">
          <span class="efficiency-detail__label">Ø/Woche</span>
          <span class="efficiency-detail__value">{monthlyStats.avgCyclesPerWeek}</span>
        </div>
        <div class="efficiency-detail">
          <span class="efficiency-detail__label">Top-Stoff</span>
          <span class="efficiency-detail__value">{monthlyStats.mostWashedFabric}</span>
        </div>
      </div>
    </div>
  </section>
</div>

<!-- Breakdown rows -->
<div class="analytics-cols">
  <section class="section">
    <h2 class="section__title">Stoffverteilung</h2>
    <div class="card">
      <div class="breakdown-list">
        {#each fabricBreakdown as fb}
          <div class="breakdown-row">
            <span class="breakdown-row__label">{fb.fabric}</span>
            <div class="breakdown-row__bar-wrap">
              <div
                class="breakdown-row__bar"
                style="width: {fb.percent}%; background: {fb.color};"
              ></div>
            </div>
            <span class="breakdown-row__pct">{fb.percent}%</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="section">
    <h2 class="section__title">Farbverteilung</h2>
    <div class="card">
      <div class="breakdown-list">
        {#each colorBreakdown as cb}
          <div class="breakdown-row">
            <span class="breakdown-row__label">
              <span
                class="color-dot"
                style="background: {cb.color}; {cb.group === 'Weiß' ? 'border: 1px solid var(--color-border);' : ''}"
              ></span>
              {cb.group}
            </span>
            <div class="breakdown-row__bar-wrap">
              <div
                class="breakdown-row__bar"
                style="width: {cb.percent}%; background: {cb.color}; {cb.group === 'Weiß' ? 'border: 1px solid var(--color-border);' : ''}"
              ></div>
            </div>
            <span class="breakdown-row__pct">{cb.percent}%</span>
          </div>
        {/each}
      </div>
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
    padding: 0.375rem 0.875rem;
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-tertiary);
    background: var(--color-surface-raised);
    box-shadow: inset 0 0 0 1.5px var(--color-border-light);
    border: none;
    cursor: pointer;
    transition: background var(--transition-fast), box-shadow var(--transition-fast), color var(--transition-fast);
  }

  .filter-chip:hover {
    box-shadow: inset 0 0 0 1.5px var(--color-green-400);
    color: var(--color-text);
  }

  .filter-chip--active {
    background: var(--color-green-50);
    box-shadow: inset 0 0 0 1.5px var(--color-green-500);
    color: var(--color-green-700);
    font-weight: var(--weight-semibold);
  }

  .analytics-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }

  @media (max-width: 900px) {
    .analytics-cols {
      grid-template-columns: 1fr;
    }
  }

  /* Bar chart */
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
    width: 70%;
    max-width: 2.5rem;
    background: linear-gradient(180deg, var(--color-green-400), var(--color-green-600));
    border-radius: var(--radius-md) var(--radius-md) var(--radius-sm) var(--radius-sm);
    min-height: 4px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    transition: height var(--transition-slow);
  }

  .bar-chart__value {
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    color: var(--color-text-inverse);
    padding-top: var(--space-1);
  }

  .bar-chart__label {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    margin-top: var(--space-2);
  }

  /* Efficiency ring */
  .efficiency-ring {
    position: relative;
    width: 7.5rem;
    height: 7.5rem;
    margin: 0 auto var(--space-4);
  }

  .ring-svg {
    width: 100%;
    height: 100%;
  }

  .ring-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .ring-value {
    display: block;
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    color: var(--color-text);
    line-height: 1;
  }

  .ring-text {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .efficiency-details {
    display: flex;
    justify-content: space-around;
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-light);
  }

  .efficiency-detail {
    text-align: center;
  }

  .efficiency-detail__label {
    display: block;
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .efficiency-detail__value {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-text);
  }

  /* Breakdown bars */
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
    width: 5rem;
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .color-dot {
    display: inline-block;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .breakdown-row__bar-wrap {
    flex: 1;
    height: 0.5rem;
    background: var(--color-surface-sunken);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .breakdown-row__bar {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
  }

  .breakdown-row__pct {
    width: 2.5rem;
    text-align: right;
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    font-weight: var(--weight-medium);
  }
</style>
