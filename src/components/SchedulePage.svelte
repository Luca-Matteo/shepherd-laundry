<script lang="ts">
  import Icon from "./Icon.svelte";
  import {
    cycles,
    items as allItems,
    members,
    type WashCycle,
  } from "../lib/stores";
  import { statusLabels, colorLabels, fabricLabels, label } from "../lib/labels";

  let filterStatus: string = "all";

  $: filteredCycles =
    filterStatus === "all"
      ? $cycles
      : $cycles.filter((c) => c.status === filterStatus);

  $: groupedByDate = filteredCycles.reduce(
    (acc, cycle) => {
      if (!acc[cycle.scheduledDate]) acc[cycle.scheduledDate] = [];
      acc[cycle.scheduledDate].push(cycle);
      return acc;
    },
    {} as Record<string, WashCycle[]>,
  );

  $: sortedDates = Object.keys(groupedByDate).sort();

  function statusColor(status: WashCycle["status"]): string {
    switch (status) {
      case "running":
        return "badge--green";
      case "scheduled":
        return "badge--neutral";
      case "completed":
        return "badge--neutral";
      case "cancelled":
        return "badge--danger";
      default:
        return "badge--neutral";
    }
  }

  function itemName(itemId: string): string {
    const item = $allItems.find((i) => i.id === itemId);
    return item?.name ?? itemId;
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.getTime() === today.getTime()) return "Heute";
    if (d.getTime() === tomorrow.getTime()) return "Morgen";

    return d.toLocaleDateString("de-DE", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function handleOptimize() {
    alert(
      "Optimierung ruft den Backend-Solver auf, um Waschgänge optimal zu planen.",
    );
  }
</script>

<div class="page-header">
  <div class="page-header__row">
    <div>
      <h1 class="page-header__title">Waschplan</h1>
      <p class="page-header__subtitle">
        Verwalte und optimiere deine Waschgänge.
      </p>
    </div>
    <div class="page-header__actions">
      <button class="btn btn--secondary" on:click={handleOptimize}>
        <Icon name="zap" size={14} />
        Optimieren
      </button>
      <button class="btn btn--primary">
        <Icon name="plus" size={14} />
        Neuer Waschgang
      </button>
    </div>
  </div>
</div>

<!-- Filters -->
<div class="filters section">
  <fieldset class="filter-group" role="radiogroup" aria-label="Nach Status filtern">
    <legend class="visually-hidden">Nach Status filtern</legend>
    {#each [
      { value: "all", label: "Alle" },
      { value: "scheduled", label: "Geplant" },
      { value: "running", label: "Läuft" },
      { value: "completed", label: "Fertig" },
      { value: "cancelled", label: "Abgebrochen" },
    ] as status}
      <label class="filter-chip" class:filter-chip--active={filterStatus === status.value}>
        <input
          type="radio"
          name="status-filter"
          value={status.value}
          bind:group={filterStatus}
          class="visually-hidden"
        />
        {status.label}
      </label>
    {/each}
  </fieldset>
</div>

<!-- Timeline -->
<div class="timeline">
  {#each sortedDates as date (date)}
    <section class="timeline__day">
      <h2 class="timeline__date">{formatDate(date)}</h2>
      <div class="timeline__cycles">
        {#each groupedByDate[date] as cycle (cycle.id)}
          <article class="cycle-entry" aria-label="Waschgang: {cycle.name}">
            <div class="cycle-entry__top">
              <div class="cycle-entry__info">
                <h3 class="cycle-entry__name">{cycle.name}</h3>
                <span class="cycle-entry__time">{cycle.scheduledTime}</span>
              </div>
              <span class="badge {statusColor(cycle.status)}">{label(statusLabels, cycle.status)}</span>
            </div>

            <div class="cycle-entry__details">
              <span>{cycle.temperature}°C</span>
              <span class="cycle-entry__sep"></span>
              <span>{cycle.duration} min</span>
              <span class="cycle-entry__sep"></span>
              <span>{cycle.machineLoad}% Beladung</span>
              <span class="cycle-entry__sep"></span>
              <span>{label(colorLabels, cycle.colorGroup)}</span>
            </div>

            <div class="cycle-entry__items">
              {#each cycle.items as itemId}
                <span class="cycle-entry__item">{itemName(itemId)}</span>
              {/each}
            </div>

            {#if cycle.status === "scheduled"}
              <div class="cycle-entry__actions">
                <button class="btn btn--primary btn--sm">Starten</button>
                <button class="btn btn--ghost btn--sm">Bearbeiten</button>
                <button class="btn btn--ghost btn--sm cycle-entry__cancel">Abbrechen</button>
              </div>
            {/if}
          </article>
        {/each}
      </div>
    </section>
  {:else}
    <div class="empty-state">
      <div class="empty-state__icon">
        <Icon name="schedule" size={32} />
      </div>
      <h3 class="empty-state__title">Keine Waschgänge gefunden</h3>
      <p class="empty-state__text">Passe den Filter an oder erstelle einen neuen Waschgang.</p>
    </div>
  {/each}
</div>

<style>
  .page-header__row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .page-header__actions {
    display: flex;
    gap: var(--space-2);
  }

  .filters {
    margin-bottom: var(--space-8);
  }

  .filter-group {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
    border: none;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 0.875rem;
    min-height: 2.75rem;
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

  .filter-chip:active {
    border-color: var(--color-text-tertiary);
    color: var(--color-text-secondary);
  }

  @media (hover: hover) {
    .filter-chip:hover {
      border-color: var(--color-text-tertiary);
      color: var(--color-text-secondary);
    }
  }

  .filter-chip--active {
    background: var(--color-text);
    border-color: var(--color-text);
    color: var(--color-text-inverse);
    font-weight: var(--weight-medium);
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-10);
  }

  .timeline__date {
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    color: var(--color-text-tertiary);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    margin-bottom: var(--space-4);
  }

  .timeline__cycles {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .cycle-entry {
    padding: var(--space-6) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .cycle-entry:last-child {
    border-bottom: none;
  }

  .cycle-entry__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .cycle-entry__info {
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
    min-width: 0;
  }

  .cycle-entry__name {
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    color: var(--color-text);
    margin: 0;
  }

  .cycle-entry__time {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .cycle-entry__details {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-3);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .cycle-entry__sep {
    width: 3px;
    height: 3px;
    border-radius: var(--radius-full);
    background: var(--color-text-tertiary);
    flex-shrink: 0;
  }

  .cycle-entry__items {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-3);
  }

  .cycle-entry__item {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    padding: 0.125rem 0.5rem;
    background: var(--color-surface-sunken);
    border-radius: var(--radius-full);
  }

  .cycle-entry__actions {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-4);
  }

  .cycle-entry__cancel {
    color: var(--color-danger);
  }
</style>
