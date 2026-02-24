<script lang="ts">
  import Icon from "./Icon.svelte";
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
      case "scheduled": return "badge--orange";
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
    return m?.name ?? "Unknown";
  }
</script>

<div class="page-header">
  <h1 class="page-header__title">Übersicht</h1>
  <p class="page-header__subtitle">
    Guten Morgen — hier ist deine Wäscheübersicht.
  </p>
</div>

<!-- Stats row -->
<section class="grid grid--stats section" aria-label="Schnellstatistik">
  <div class="card stat-card">
    <div class="stat-card__icon stat-card__icon--green">
      <Icon name="items" size={20} />
    </div>
    <div class="stat__value">{$hamperItems.length}</div>
    <div class="stat__label">Im Wäschekorb</div>
  </div>
  <div class="card stat-card">
    <div class="stat-card__icon stat-card__icon--orange">
      <Icon name="washing-machine" size={20} />
    </div>
    <div class="stat__value">{$activeCycles.length}</div>
    <div class="stat__label">Aktive Waschgänge</div>
  </div>
  <div class="card stat-card">
    <div class="stat-card__icon stat-card__icon--green">
      <Icon name="wind" size={20} />
    </div>
    <div class="stat__value">
      {$dryingSessions.filter((d) => d.status === "active").length}
    </div>
    <div class="stat__label">Trocknet gerade</div>
  </div>
  <div class="card stat-card">
    <div class="stat-card__icon" class:stat-card__icon--danger={$lowConsumables.length > 0} class:stat-card__icon--neutral={$lowConsumables.length === 0}>
      <Icon name="alert" size={20} />
    </div>
    <div class="stat__value">{$lowConsumables.length}</div>
    <div class="stat__label">
      {$lowConsumables.length === 1 ? "Vorrat knapp" : "Vorräte knapp"}
    </div>
  </div>
</section>

<!-- Two-column -->
<div class="dashboard-cols">
  <section class="section">
    <div class="section-header">
      <h2 class="section__title">Nächste Waschgänge</h2>
      <a href="/schedule" class="btn btn--ghost btn--sm">
        Alle anzeigen <Icon name="chevron-right" size={14} />
      </a>
    </div>
    <div class="cycle-list">
      {#each $activeCycles as cycle (cycle.id)}
        <div class="card card--interactive cycle-card">
          <div class="cycle-card__header">
            <div class="cycle-card__icon">
              <Icon name="washing-machine" size={20} />
            </div>
            <div class="cycle-card__info">
              <span class="cycle-card__name">{cycle.name}</span>
              <span class="cycle-card__time">
                {cycle.scheduledDate} at {cycle.scheduledTime}
              </span>
            </div>
            <span class="badge {statusColor(cycle.status)}">{cycle.status}</span>
          </div>
          <div class="cycle-card__meta">
            <span class="cycle-card__detail">
              <Icon name="thermometer" size={14} /> {cycle.temperature}°C
            </span>
            <span class="cycle-card__detail">
              <Icon name="clock" size={14} /> {cycle.duration} min
            </span>
            <span class="cycle-card__detail">Load: {cycle.machineLoad}%</span>
          </div>
        </div>
      {:else}
        <div class="empty-state">
          <p class="empty-state__text">Keine bevorstehenden Waschgänge geplant.</p>
          <a href="/schedule" class="btn btn--primary btn--sm">
            <Icon name="plus" size={16} /> Waschgang erstellen
          </a>
        </div>
      {/each}
    </div>
  </section>

  <section class="section">
    <div class="section-header">
      <h2 class="section__title">Erfordert Aufmerksamkeit</h2>
      <a href="/items" class="btn btn--ghost btn--sm">
        Alle anzeigen <Icon name="chevron-right" size={14} />
      </a>
    </div>
    <div class="attention-list">
      {#each $urgentItems as item (item.id)}
        <div class="card card--interactive attention-card">
          <div class="attention-card__row">
            <div>
              <span class="attention-card__name">{item.name}</span>
              <span class="attention-card__owner">{ownerName(item.owner)}</span>
            </div>
            <span class="badge {priorityColor(item.priority)}">{item.priority}</span>
          </div>
        </div>
      {:else}
        <div class="empty-state">
          <p class="empty-state__text">Aktuell nichts Dringendes.</p>
        </div>
      {/each}
    </div>

    {#if $lowConsumables.length > 0}
      <div class="section-header" style="margin-top: var(--space-8);">
        <h2 class="section__title">Knappe Vorräte</h2>
        <a href="/consumables" class="btn btn--ghost btn--sm">
          Alle anzeigen <Icon name="chevron-right" size={14} />
        </a>
      </div>
      {#each $lowConsumables as con (con.id)}
        <div class="card supply-peek">
          <div class="supply-peek__row">
            <span class="supply-peek__name">{con.name}</span>
            <span class="supply-peek__pct">{consumablePercent(con)}%</span>
          </div>
          <div class="progress">
            <div
              class="progress__fill {consumableBarClass(con)}"
              style="width: {consumablePercent(con)}%"
              role="progressbar"
              aria-valuenow={consumablePercent(con)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="{con.name} remaining"
            ></div>
          </div>
        </div>
      {/each}
    {/if}
  </section>
</div>

<style>
  .dashboard-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }

  @media (max-width: 900px) {
    .dashboard-cols { grid-template-columns: 1fr; }
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .stat-card__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-lg);
  }

  .stat-card__icon--green {
    background: var(--color-green-50);
    color: var(--color-green-600);
  }

  .stat-card__icon--orange {
    background: var(--color-orange-50);
    color: var(--color-orange-600);
  }

  .stat-card__icon--danger {
    background: var(--color-danger-light);
    color: var(--color-danger);
  }

  .stat-card__icon--neutral {
    background: var(--color-surface-sunken);
    color: var(--color-text-tertiary);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-5);
  }

  .section-header .section__title { margin-bottom: 0; }

  .cycle-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .cycle-card__header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .cycle-card__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--color-green-50);
    border-radius: var(--radius-lg);
    color: var(--color-green-600);
    flex-shrink: 0;
  }

  .cycle-card__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .cycle-card__name {
    font-weight: var(--weight-semibold);
    font-size: var(--text-sm);
    color: var(--color-text);
  }

  .cycle-card__time {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: 1px;
  }

  .cycle-card__meta {
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border-light);
  }

  .cycle-card__detail {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .attention-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .attention-card__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .attention-card__name {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    display: block;
  }

  .attention-card__owner {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: 1px;
  }

  .supply-peek { margin-top: var(--space-3); }

  .supply-peek__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-2);
  }

  .supply-peek__name {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
  }

  .supply-peek__pct {
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    color: var(--color-text-secondary);
  }
</style>
