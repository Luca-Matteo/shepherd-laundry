<script lang="ts">
  import Icon from "./Icon.svelte";
  import { items, members, type LaundryItem } from "../lib/stores";
  import { statusLabels, priorityLabels, fabricLabels, colorLabels, label } from "../lib/labels";

  let filterStatus: string = "all";
  let filterOwner: string = "all";
  let sortBy: string = "priority";

  $: filtered = $items
    .filter((i) => filterStatus === "all" || i.status === filterStatus)
    .filter((i) => filterOwner === "all" || i.owner === filterOwner)
    .sort((a, b) => {
      if (sortBy === "priority") {
        const order = { urgent: 0, high: 1, normal: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "fabric") return a.fabricType.localeCompare(b.fabricType);
      return 0;
    });

  function ownerName(ownerId: string): string {
    return $members.find((m) => m.id === ownerId)?.name ?? "Unbekannt";
  }

  function statusBadge(status: LaundryItem["status"]): string {
    switch (status) {
      case "clean":
        return "badge--green";
      case "hamper":
        return "badge--orange";
      case "washing":
        return "badge--green";
      case "drying":
        return "badge--neutral";
      default:
        return "badge--neutral";
    }
  }

  function priorityBadge(priority: LaundryItem["priority"]): string {
    switch (priority) {
      case "urgent":
        return "badge--danger";
      case "high":
        return "badge--orange";
      default:
        return "badge--neutral";
    }
  }

  function daysSince(date: string | null): string {
    if (!date) return "Nie";
    const d = new Date(date);
    const now = new Date("2026-02-24");
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Heute";
    if (diff === 1) return "Gestern";
    return `vor ${diff}T`;
  }

  function handleAddItem() {
    alert("Dialog zum Hinzufügen eines Wäschestücks würde hier erscheinen.");
  }
</script>

<div class="page-header">
  <div class="page-header__row">
    <div>
      <h1 class="page-header__title">Wäsche</h1>
      <p class="page-header__subtitle">
        Alle Wäschestücke und ihren aktuellen Status verfolgen.
      </p>
    </div>
    <button class="btn btn--primary" on:click={handleAddItem}>
      <Icon name="plus" size={14} />
      Hinzufügen
    </button>
  </div>
</div>

<!-- Filters -->
<div class="filter-bar section">
  <div class="filter-bar__group">
    <label class="label" for="filter-status">Status</label>
    <select id="filter-status" class="select" bind:value={filterStatus}>
      <option value="all">Alle Status</option>
      <option value="clean">Sauber</option>
      <option value="hamper">Im Wäschekorb</option>
      <option value="washing">Wäscht</option>
      <option value="drying">Trocknet</option>
    </select>
  </div>

  <div class="filter-bar__group">
    <label class="label" for="filter-owner">Besitzer</label>
    <select id="filter-owner" class="select" bind:value={filterOwner}>
      <option value="all">Alle</option>
      {#each $members as member (member.id)}
        <option value={member.id}>{member.name}</option>
      {/each}
    </select>
  </div>

  <div class="filter-bar__group">
    <label class="label" for="sort-by">Sortieren</label>
    <select id="sort-by" class="select" bind:value={sortBy}>
      <option value="priority">Priorität</option>
      <option value="name">Name</option>
      <option value="fabric">Stoffart</option>
    </select>
  </div>
</div>

<!-- Items list -->
<div class="items-list">
  {#each filtered as item (item.id)}
    <article class="item-row" aria-label="{item.name}">
      <div class="item-row__main">
        <div class="item-row__info">
          <h3 class="item-row__name">{item.name}</h3>
          <span class="item-row__owner">{ownerName(item.owner)}</span>
        </div>
        <div class="item-row__badges">
          <span class="badge {statusBadge(item.status)}">{label(statusLabels, item.status)}</span>
          {#if item.priority !== "normal" && item.priority !== "low"}
            <span class="badge {priorityBadge(item.priority)}">{label(priorityLabels, item.priority)}</span>
          {/if}
        </div>
      </div>
      <div class="item-row__meta">
        <span>{label(fabricLabels, item.fabricType)}</span>
        <span class="item-row__sep"></span>
        <span>{label(colorLabels, item.color)}</span>
        <span class="item-row__sep"></span>
        <span>Gewaschen: {daysSince(item.lastWashed)}</span>
        <span class="item-row__sep"></span>
        <span>Intervall: {item.hygieneLimit}T</span>
      </div>
    </article>
  {:else}
    <div class="empty-state">
      <div class="empty-state__icon">
        <Icon name="items" size={32} />
      </div>
      <h3 class="empty-state__title">Keine Wäsche gefunden</h3>
      <p class="empty-state__text">Passe die Filter an oder füge dein erstes Wäschestück hinzu.</p>
      <button class="btn btn--primary btn--sm" on:click={handleAddItem}>
        <Icon name="plus" size={14} />
        Hinzufügen
      </button>
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

  .filter-bar {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
    align-items: flex-end;
  }

  .filter-bar__group {
    min-width: 9rem;
  }

  .items-list {
    display: flex;
    flex-direction: column;
  }

  .item-row {
    padding: var(--space-5) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .item-row:last-child {
    border-bottom: none;
  }

  .item-row__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .item-row__info {
    min-width: 0;
  }

  .item-row__name {
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    color: var(--color-text);
    margin: 0;
  }

  .item-row__owner {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: 1px;
    display: block;
  }

  .item-row__badges {
    display: flex;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .item-row__meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .item-row__sep {
    width: 3px;
    height: 3px;
    border-radius: var(--radius-full);
    background: var(--color-text-tertiary);
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    .item-row__meta {
      flex-wrap: wrap;
    }
  }
</style>
