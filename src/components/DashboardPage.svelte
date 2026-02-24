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
      case "running":
        return "badge--green";
      case "scheduled":
        return "badge--orange";
      case "completed":
        return "badge--neutral";
      case "cancelled":
        return "badge--danger";
      default:
        return "badge--neutral";
    }
  }

  function priorityColor(priority: LaundryItem["priority"]): string {
    switch (priority) {
      case "urgent":
        return "badge--danger";
      case "high":
        return "badge--orange";
      default:
        return "badge--neutral";
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
  <h1 class="page-header__title">Dashboard</h1>
  <p class="page-header__subtitle">
    Good morning — here's your laundry overview.
  </p>
</div>

<!-- Stats row -->
<section class="grid grid--stats section" aria-label="Quick statistics">
  <div class="card stat">
    <div class="stat__value">{$hamperItems.length}</div>
    <div class="stat__label">In hamper</div>
  </div>
  <div class="card stat">
    <div class="stat__value">{$activeCycles.length}</div>
    <div class="stat__label">Active cycles</div>
  </div>
  <div class="card stat">
    <div class="stat__value">
      {$dryingSessions.filter((d) => d.status === "active").length}
    </div>
    <div class="stat__label">Drying now</div>
  </div>
  <div class="card stat">
    <div class="stat__value">{$lowConsumables.length}</div>
    <div class="stat__label">
      {$lowConsumables.length === 1 ? "Supply low" : "Supplies low"}
    </div>
  </div>
</section>

<!-- Two-column: upcoming cycles + urgent items -->
<div class="dashboard-cols">
  <!-- Upcoming cycles -->
  <section class="section">
    <div class="section-header">
      <h2 class="section__title">Upcoming Cycles</h2>
      <a href="/schedule" class="btn btn--ghost btn--sm">
        View all
        <Icon name="chevron-right" size={14} />
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
            <span class="badge {statusColor(cycle.status)}">
              {cycle.status}
            </span>
          </div>
          <div class="cycle-card__meta">
            <span class="cycle-card__detail">
              <Icon name="thermometer" size={14} />
              {cycle.temperature}°C
            </span>
            <span class="cycle-card__detail">
              <Icon name="clock" size={14} />
              {cycle.duration} min
            </span>
            <span class="cycle-card__detail">
              Load: {cycle.machineLoad}%
            </span>
          </div>
        </div>
      {:else}
        <div class="empty-state">
          <p class="empty-state__text">No upcoming cycles scheduled.</p>
          <a href="/schedule" class="btn btn--primary btn--sm">
            <Icon name="plus" size={16} />
            Create cycle
          </a>
        </div>
      {/each}
    </div>
  </section>

  <!-- Attention needed -->
  <section class="section">
    <div class="section-header">
      <h2 class="section__title">Needs Attention</h2>
      <a href="/items" class="btn btn--ghost btn--sm">
        View all
        <Icon name="chevron-right" size={14} />
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
            <span class="badge {priorityColor(item.priority)}">
              {item.priority}
            </span>
          </div>
        </div>
      {:else}
        <div class="empty-state">
          <p class="empty-state__text">Nothing urgent right now.</p>
        </div>
      {/each}
    </div>

    <!-- Low supplies quick peek -->
    {#if $lowConsumables.length > 0}
      <div class="section-header" style="margin-top: var(--space-6);">
        <h2 class="section__title">Low Supplies</h2>
        <a href="/consumables" class="btn btn--ghost btn--sm">
          View all
          <Icon name="chevron-right" size={14} />
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
    gap: var(--space-6);
  }

  @media (max-width: 900px) {
    .dashboard-cols {
      grid-template-columns: 1fr;
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-4);
  }

  .section-header .section__title {
    margin-bottom: 0;
  }

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
    width: 2.25rem;
    height: 2.25rem;
    background: var(--color-green-50);
    border-radius: var(--radius-md);
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
    font-weight: var(--weight-medium);
    font-size: var(--text-sm);
    color: var(--color-text);
  }

  .cycle-card__time {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .cycle-card__meta {
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-3);
    padding-top: var(--space-3);
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
    gap: var(--space-2);
  }

  .attention-card__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .attention-card__name {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    display: block;
  }

  .attention-card__owner {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .supply-peek {
    margin-top: var(--space-2);
  }

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
    color: var(--color-text-secondary);
  }
</style>
