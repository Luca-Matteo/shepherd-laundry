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

  // Group cycles by date
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
        return "badge--orange";
      case "completed":
        return "badge--neutral";
      case "cancelled":
        return "badge--danger";
      default:
        return "badge--neutral";
    }
  }

  function statusIcon(status: WashCycle["status"]): string {
    switch (status) {
      case "running":
        return "play";
      case "scheduled":
        return "clock";
      case "completed":
        return "check";
      case "cancelled":
        return "x";
      default:
        return "clock";
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
    // Placeholder — would call OR-Tools backend
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
        <Icon name="zap" size={16} />
        Optimieren
      </button>
      <button class="btn btn--primary">
        <Icon name="plus" size={16} />
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
          <article class="card card--interactive cycle-detail" aria-label="Waschgang: {cycle.name}">
            <div class="cycle-detail__top">
              <div class="cycle-detail__status-icon {cycle.status}">
                <Icon name={statusIcon(cycle.status)} size={18} />
              </div>
              <div class="cycle-detail__info">
                <h3 class="cycle-detail__name">{cycle.name}</h3>
                <span class="cycle-detail__time">{cycle.scheduledTime}</span>
              </div>
              <span class="badge {statusColor(cycle.status)}">{label(statusLabels, cycle.status)}</span>
            </div>

            <div class="cycle-detail__props">
              <div class="cycle-detail__prop">
                <Icon name="thermometer" size={14} />
                <span>{cycle.temperature}°C</span>
              </div>
              <div class="cycle-detail__prop">
                <Icon name="clock" size={14} />
                <span>{cycle.duration} min</span>
              </div>
              <div class="cycle-detail__prop">
                <span>Beladung: {cycle.machineLoad}%</span>
              </div>
              <div class="cycle-detail__prop">
                <span>Farbe: {label(colorLabels, cycle.colorGroup)}</span>
              </div>
            </div>

            <div class="cycle-detail__items">
              <span class="cycle-detail__items-label">Teile:</span>
              {#each cycle.items as itemId}
                <span class="badge badge--neutral">{itemName(itemId)}</span>
              {/each}
            </div>

            {#if cycle.status === "scheduled"}
              <div class="cycle-detail__actions">
                <button class="btn btn--primary btn--sm">
                  <Icon name="play" size={14} />
                  Starten
                </button>
                <button class="btn btn--ghost btn--sm">Bearbeiten</button>
                <button class="btn btn--ghost btn--sm" style="color: var(--color-danger);">Abbrechen</button>
              </div>
            {/if}
          </article>
        {/each}
      </div>
    </section>
  {:else}
    <div class="empty-state card">
      <div class="empty-state__icon">
        <Icon name="schedule" size={48} />
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
    margin-bottom: var(--space-6);
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
    padding: 0.375rem 0.875rem;
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-tertiary);
    background: var(--color-surface-raised);
    box-shadow: inset 0 0 0 1.5px var(--color-border-light);
    border: none;
    cursor: pointer;
    transition:
      background var(--transition-fast),
      box-shadow var(--transition-fast),
      color var(--transition-fast);
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

  .timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .timeline__date {
    font-size: var(--text-base);
    font-weight: var(--weight-bold);
    color: var(--color-text);
    letter-spacing: var(--tracking-tight);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 2px solid var(--color-green-100);
  }

  .timeline__cycles {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .cycle-detail__top {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .cycle-detail__status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .cycle-detail__status-icon.running {
    background: var(--color-green-100);
    color: var(--color-green-700);
  }

  .cycle-detail__status-icon.scheduled {
    background: var(--color-orange-100);
    color: var(--color-orange-700);
  }

  .cycle-detail__status-icon.completed {
    background: var(--color-surface-sunken);
    color: var(--color-text-secondary);
  }

  .cycle-detail__status-icon.cancelled {
    background: var(--color-danger-light);
    color: var(--color-danger);
  }

  .cycle-detail__info {
    flex: 1;
    min-width: 0;
  }

  .cycle-detail__name {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-text);
    margin: 0;
  }

  .cycle-detail__time {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .cycle-detail__props {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-light);
  }

  .cycle-detail__prop {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .cycle-detail__items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-3);
  }

  .cycle-detail__items-label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    font-weight: var(--weight-medium);
  }

  .cycle-detail__actions {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-light);
  }
</style>
