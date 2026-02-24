<script lang="ts">
  import Icon from "./Icon.svelte";
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
          <span class="badge {statusColor(cycle.status)}">{label(statusLabels, cycle.status)}</span>
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
              <span class="attention-row__name">{item.name}</span>
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

  .cycle-row:hover {
    opacity: 0.7;
    text-decoration: none;
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
</style>
