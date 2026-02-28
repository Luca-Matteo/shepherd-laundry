<script lang="ts">
  import Icon from "./Icon.svelte";
  import GroupTag from "./GroupTag.svelte";
  import {
    statusLabels, priorityLabels, label,
  } from "../lib/labels";
  import {
    items,
    cycles,
    dryingSessions,
    consumables,
    hamperItems,
    activeCycles,
    lowConsumables,
    urgentItems,
    members,
    groups,
    cycleGroups,
    itemGroups,
    type WashCycle,
    type LaundryItem,
    type Consumable,
  } from "../lib/stores";

  function statusColor(status: WashCycle["status"]): string {
    switch (status) {
      case "running": return "badge--green";
      case "scheduled": return "badge--neutral";
      case "completed": return "badge--neutral";
      case "cancelled": return "badge--danger";
      default: return "badge--neutral";
    }
  }

  function priorityColor(priority: LaundryItem["priority"]): string {
    switch (priority) {
      case "urgent": return "badge--danger";
      case "high": return "badge--orange";
      default: return "badge--neutral";
    }
  }

  function consumablePercent(c: Consumable): number {
    return Math.round((c.currentAmount / c.maxAmount) * 100);
  }

  function consumableBarClass(c: Consumable): string {
    const pct = c.currentAmount / c.maxAmount;
    if (pct < 0.2) return "progress__fill--danger";
    if (pct < 0.4) return "progress__fill--orange";
    return "progress__fill--green";
  }

  function ownerName(ownerId: string): string {
    const m = $members.find((m) => m.id === ownerId);
    return m?.name ?? "Unbekannt";
  }

  function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Guten Morgen";
    if (h < 18) return "Guten Nachmittag";
    return "Guten Abend";
  }

  /* ---- Analytics data (inline) ---- */
  let showAnalytics = false;

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
</script>

<div class="page-header">
  <h1 class="page-header__title">{getGreeting()}, Alex</h1>
  <p class="page-header__subtitle">
    Hier ist der aktuelle Stand deiner Wäsche.
  </p>
</div>

<!-- Stats -->
<section class="stats-row section" aria-label="Schnellstatistik">
  <div class="stat-item">
    <span class="stat-item__value">{$hamperItems.length}</span>
    <span class="stat-item__label">Im Korb</span>
  </div>
  <div class="stat-item">
    <span class="stat-item__value">{$activeCycles.length}</span>
    <span class="stat-item__label">Waschgänge</span>
  </div>
  <div class="stat-item">
    <span class="stat-item__value">
      {$dryingSessions.filter((d) => d.status === "active").length}
    </span>
    <span class="stat-item__label">Trocknet</span>
  </div>
  <div class="stat-item" class:stat-item--alert={$lowConsumables.length > 0}>
    <span class="stat-item__value">{$lowConsumables.length}</span>
    <span class="stat-item__label">Knapp</span>
  </div>
</section>

<!-- Two-column -->
<div class="dashboard-cols">
  <section class="section">
    <div class="section-header">
      <h2 class="section__title">Nächste Waschgänge</h2>
      <a href="/schedule" class="btn btn--ghost btn--sm">
        Alle ansehen
      </a>
    </div>
    <div class="cycle-list">
      {#each $activeCycles as cycle (cycle.id)}
        <a href="/schedule" class="cycle-row">
          <div class="cycle-row__left">
            <span class="cycle-row__name">{cycle.name}</span>
            <span class="cycle-row__meta">
              {cycle.scheduledDate} · {cycle.scheduledTime} · {cycle.temperature}°C · {cycle.duration} min
            </span>
          </div>
          <div class="cycle-row__right">
            <GroupTag groups={cycleGroups(cycle, $items, $members, $groups)} />
            <span class="badge {statusColor(cycle.status)}">{label(statusLabels, cycle.status)}</span>
          </div>
        </a>
      {:else}
        <div class="empty-state">
          <p class="empty-state__text">Keine bevorstehenden Waschgänge.</p>
          <a href="/schedule" class="btn btn--primary btn--sm">
            <Icon name="plus" size={14} /> Waschgang erstellen
          </a>
        </div>
      {/each}
    </div>
  </section>

  <div>
    <section class="section">
      <div class="section-header">
        <h2 class="section__title">Erfordert Aufmerksamkeit</h2>
      </div>
      <div class="attention-list">
        {#each $urgentItems as item (item.id)}
          <div class="attention-row">
            <div class="attention-row__left">
              <div class="attention-row__name-line">
                <span class="attention-row__name">{item.name}</span>
                <GroupTag groups={itemGroups(item, $members, $groups)} small={true} />
              </div>
              <span class="attention-row__owner">{ownerName(item.owner)}</span>
            </div>
            <span class="badge {priorityColor(item.priority)}">{label(priorityLabels, item.priority)}</span>
          </div>
        {:else}
          <p class="section-empty">Aktuell nichts Dringendes.</p>
        {/each}
      </div>
    </section>

    {#if $lowConsumables.length > 0}
      <section class="section">
        <div class="section-header">
          <h2 class="section__title">Knappe Vorräte</h2>
        </div>
        {#each $lowConsumables as con (con.id)}
          <div class="supply-row">
            <div class="supply-row__top">
              <span class="supply-row__name">{con.name}</span>
              <span class="supply-row__pct">{consumablePercent(con)}%</span>
            </div>
            <div class="progress">
              <div
                class="progress__fill {consumableBarClass(con)}"
                style="width: {consumablePercent(con)}%"
                role="progressbar"
                aria-valuenow={consumablePercent(con)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="{con.name} verbleibend"
              ></div>
            </div>
          </div>
        {/each}
      </section>
    {/if}
  </div>
</div>

<!-- Analytics section — collapsible -->
<section class="section analytics-section" aria-label="Statistik">
  <button
    class="analytics-toggle"
    on:click={() => (showAnalytics = !showAnalytics)}
    aria-expanded={showAnalytics}
  >
    <h2 class="section__title" style="margin-bottom: 0;">Statistik</h2>
    <span class="analytics-toggle__icon" class:analytics-toggle__icon--open={showAnalytics}>
      <Icon name="chevron-down" size={16} />
    </span>
  </button>

  {#if showAnalytics}
    <div class="analytics-content">
      <!-- Key metrics -->
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

      <!-- Charts -->
      <div class="analytics-cols">
        <div>
          <h3 class="section__title">Diese Woche</h3>
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
        </div>

        <div>
          <h3 class="section__title">Effizienz</h3>
          <div class="efficiency">
            <div class="efficiency__ring" aria-label="Beladungseffizienz: {monthlyStats.avgLoadEfficiency}%">
              <svg viewBox="0 0 120 120" class="efficiency__svg">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border-light)" stroke-width="6" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="var(--color-text)" stroke-width="6"
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
        </div>
      </div>

      <!-- Breakdowns -->
      <div class="analytics-cols">
        <div>
          <h3 class="section__title">Stoffverteilung</h3>
          <div class="breakdown-list">
            {#each fabricBreakdown as fb}
              <div class="breakdown-row">
                <span class="breakdown-row__label">{fb.fabric}</span>
                <div class="breakdown-row__bar-wrap">
                  <div class="breakdown-row__bar" style="width: {fb.percent}%;"></div>
                </div>
                <span class="breakdown-row__pct">{fb.percent}%</span>
              </div>
            {/each}
          </div>
        </div>

        <div>
          <h3 class="section__title">Farbverteilung</h3>
          <div class="breakdown-list">
            {#each colorBreakdown as cb}
              <div class="breakdown-row">
                <span class="breakdown-row__label">{cb.group}</span>
                <div class="breakdown-row__bar-wrap">
                  <div class="breakdown-row__bar" style="width: {cb.percent}%;"></div>
                </div>
                <span class="breakdown-row__pct">{cb.percent}%</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  /* Stats row — large numbers, no cards */
  .stats-row {
    display: flex;
    gap: var(--space-10);
    padding-bottom: var(--space-8);
    border-bottom: 1px solid var(--color-border-light);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
  }

  .stat-item__value {
    font-size: var(--text-3xl);
    font-weight: var(--weight-light);
    color: var(--color-text);
    line-height: 1;
    letter-spacing: var(--tracking-tight);
  }

  .stat-item__label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: var(--space-2);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .stat-item--alert .stat-item__value {
    color: var(--color-danger);
  }

  @media (max-width: 600px) {
    .stats-row {
      gap: var(--space-6);
    }
    .stat-item__value {
      font-size: var(--text-2xl);
    }
  }

  /* Dashboard columns */
  .dashboard-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
  }

  @media (max-width: 900px) {
    .dashboard-cols { grid-template-columns: 1fr; }
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-4);
  }

  .section-header .section__title { margin-bottom: 0; }

  /* Cycle rows — clean list, no cards */
  .cycle-list {
    display: flex;
    flex-direction: column;
  }

  .cycle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-border-light);
    text-decoration: none;
    transition: opacity var(--transition-fast);
  }

  .cycle-row:last-child {
    border-bottom: none;
  }

  .cycle-row:active {
    opacity: 0.7;
    text-decoration: none;
  }

  @media (hover: hover) {
    .cycle-row:hover {
      opacity: 0.7;
      text-decoration: none;
    }
  }

  .cycle-row__left {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .cycle-row__name {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
  }

  .cycle-row__meta {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: 2px;
  }

  /* Attention list */
  .attention-list {
    display: flex;
    flex-direction: column;
  }

  .attention-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .attention-row:last-child {
    border-bottom: none;
  }

  .attention-row__left {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .cycle-row__right {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .attention-row__name-line {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .attention-row__name {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
  }

  .attention-row__owner {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: 1px;
  }

  .section-empty {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
    padding: var(--space-4) 0;
  }

  /* Supply rows */
  .supply-row {
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .supply-row:last-child {
    border-bottom: none;
  }

  .supply-row__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-2);
  }

  .supply-row__name {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
  }

  .supply-row__pct {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  /* ---- Analytics section ---- */
  .analytics-section {
    border-top: 1px solid var(--color-border-light);
    padding-top: var(--space-8);
  }

  .analytics-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    min-height: 2.75rem;
  }

  .analytics-toggle:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  .analytics-toggle__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-tertiary);
    transition: transform var(--transition-base);
  }

  .analytics-toggle__icon--open {
    transform: rotate(180deg);
  }

  .analytics-content {
    margin-top: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-10);
  }

  /* Metrics row */
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

  /* Analytics columns */
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

  /* Efficiency ring */
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
