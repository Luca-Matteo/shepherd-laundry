<script lang="ts">
  import Icon from "./Icon.svelte";
  import { items, members, type LaundryItem } from "../lib/stores";

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
    return $members.find((m) => m.id === ownerId)?.name ?? "Unknown";
  }

  function statusIcon(status: LaundryItem["status"]): string {
    switch (status) {
      case "clean":
        return "check";
      case "hamper":
        return "items";
      case "washing":
        return "washing-machine";
      case "drying":
        return "wind";
      default:
        return "items";
    }
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
    if (!date) return "Never";
    const d = new Date(date);
    const now = new Date("2026-02-24");
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff}d ago`;
  }

  function handleAddItem() {
    alert("Add item dialog would open here.");
  }
</script>

<div class="page-header">
  <div class="page-header__row">
    <div>
      <h1 class="page-header__title">Laundry Items</h1>
      <p class="page-header__subtitle">
        Track all household laundry items and their status.
      </p>
    </div>
    <button class="btn btn--primary" on:click={handleAddItem}>
      <Icon name="plus" size={16} />
      Add Item
    </button>
  </div>
</div>

<!-- Filters -->
<div class="filter-bar section">
  <div class="filter-bar__group">
    <label class="label" for="filter-status">Status</label>
    <select id="filter-status" class="select" bind:value={filterStatus}>
      <option value="all">All statuses</option>
      <option value="clean">Clean</option>
      <option value="hamper">In hamper</option>
      <option value="washing">Washing</option>
      <option value="drying">Drying</option>
    </select>
  </div>

  <div class="filter-bar__group">
    <label class="label" for="filter-owner">Owner</label>
    <select id="filter-owner" class="select" bind:value={filterOwner}>
      <option value="all">Everyone</option>
      {#each $members as member (member.id)}
        <option value={member.id}>{member.name}</option>
      {/each}
    </select>
  </div>

  <div class="filter-bar__group">
    <label class="label" for="sort-by">Sort by</label>
    <select id="sort-by" class="select" bind:value={sortBy}>
      <option value="priority">Priority</option>
      <option value="name">Name</option>
      <option value="fabric">Fabric type</option>
    </select>
  </div>
</div>

<!-- Items list -->
<div class="items-grid">
  {#each filtered as item (item.id)}
    <article class="card card--interactive item-card" aria-label="{item.name}">
      <div class="item-card__top">
        <div class="item-card__icon" aria-hidden="true">
          <Icon name={statusIcon(item.status)} size={18} />
        </div>
        <div class="item-card__info">
          <h3 class="item-card__name">{item.name}</h3>
          <span class="item-card__owner">{ownerName(item.owner)}</span>
        </div>
      </div>

      <div class="item-card__badges">
        <span class="badge {statusBadge(item.status)}">{item.status}</span>
        {#if item.priority !== "normal" && item.priority !== "low"}
          <span class="badge {priorityBadge(item.priority)}">{item.priority}</span>
        {/if}
        <span class="badge badge--neutral">{item.fabricType}</span>
        <span class="badge badge--neutral">{item.color}</span>
      </div>

      <div class="item-card__meta">
        <div class="item-card__detail">
          <span class="item-card__detail-label">Last washed</span>
          <span class="item-card__detail-value">{daysSince(item.lastWashed)}</span>
        </div>
        <div class="item-card__detail">
          <span class="item-card__detail-label">Wash every</span>
          <span class="item-card__detail-value">{item.hygieneLimit}d</span>
        </div>
      </div>
    </article>
  {:else}
    <div class="empty-state card" style="grid-column: 1 / -1;">
      <div class="empty-state__icon">
        <Icon name="items" size={48} />
      </div>
      <h3 class="empty-state__title">No items found</h3>
      <p class="empty-state__text">Adjust filters or add your first laundry item.</p>
      <button class="btn btn--primary btn--sm" on:click={handleAddItem}>
        <Icon name="plus" size={16} />
        Add Item
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
    min-width: 10rem;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
    gap: var(--space-4);
  }

  .item-card__top {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .item-card__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: var(--color-green-50);
    border-radius: var(--radius-lg);
    color: var(--color-green-600);
    flex-shrink: 0;
  }

  .item-card__info {
    min-width: 0;
  }

  .item-card__name {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-text);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-card__owner {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .item-card__badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    margin-bottom: var(--space-3);
  }

  .item-card__meta {
    display: flex;
    gap: var(--space-4);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-light);
  }

  .item-card__detail-label {
    display: block;
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .item-card__detail-value {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
  }
</style>
