<script lang="ts">
  import Icon from "./Icon.svelte";
  import { categoryLabels, label } from "../lib/labels";
  import { consumables, type Consumable } from "../lib/stores";

  function percent(c: Consumable): number {
    return Math.round((c.currentAmount / c.maxAmount) * 100);
  }

  function barClass(c: Consumable): string {
    const pct = c.currentAmount / c.maxAmount;
    if (pct < 0.2) return "progress__fill--danger";
    if (pct < 0.4) return "progress__fill--orange";
    return "progress__fill--green";
  }

  function washesRemaining(c: Consumable): number {
    if (c.depletionRate === 0) return Infinity;
    return Math.floor(c.currentAmount / c.depletionRate);
  }

  function daysRemaining(c: Consumable): number {
    return washesRemaining(c);
  }

  function handleRefill(c: Consumable) {
    consumables.update((all) =>
      all.map((item) =>
        item.id === c.id
          ? { ...item, currentAmount: item.maxAmount, lastRefilled: "2026-02-24" }
          : item,
      ),
    );
  }

  let searchQuery: string = "";

  $: normalizedQuery = searchQuery.toLowerCase().trim();

  $: filteredConsumables = $consumables.filter(
    (c) => !normalizedQuery || c.name.toLowerCase().includes(normalizedQuery) || c.category.toLowerCase().includes(normalizedQuery),
  );

  function handleAdd() {
    alert("Dialog zum Hinzufügen eines Verbrauchsmaterials würde hier erscheinen.");
  }
</script>

<div class="page-header">
  <div class="page-header__row">
    <div>
      <h1 class="page-header__title">Vorräte</h1>
      <p class="page-header__subtitle">
        Waschmittel und Verbrauchsmaterial verfolgen.
      </p>
    </div>
    <button class="btn btn--primary" on:click={handleAdd}>
      <Icon name="plus" size={14} />
      Hinzufügen
    </button>
  </div>
</div>

<!-- Summary -->
<section class="section" aria-label="Übersicht Vorratsstand">
  <div class="summary-stats">
    <div class="summary-stat">
      <span class="summary-stat__value">{$consumables.length}</span>
      <span class="summary-stat__label">Verfolgt</span>
    </div>
    <div class="summary-stat">
      <span class="summary-stat__value">
        {$consumables.filter((c) => percent(c) < 30).length}
      </span>
      <span class="summary-stat__label">Wird knapp</span>
    </div>
    <div class="summary-stat" class:summary-stat--alert={$consumables.filter((c) => percent(c) < 10).length > 0}>
      <span class="summary-stat__value">
        {$consumables.filter((c) => percent(c) < 10).length}
      </span>
      <span class="summary-stat__label">Kritisch</span>
    </div>
  </div>
</section>

<!-- Search -->
<div class="search-bar">
  <Icon name="search" size={16} />
  <input
    type="search"
    class="search-bar__input"
    placeholder="Vorräte suchen…"
    bind:value={searchQuery}
    aria-label="Vorräte durchsuchen"
  />
</div>

<!-- Consumable list -->
<section class="section">
  <h2 class="section__title">Alle Vorräte</h2>
  <div class="consumable-list">
    {#each filteredConsumables as con (con.id)}
      <article class="consumable-row" aria-label="{con.name}">
        <div class="consumable-row__body">
          {#if con.image}
            <div class="consumable-row__image">
              <img src={con.image} alt={con.name} />
            </div>
          {/if}
          <div class="consumable-row__content">
            <div class="consumable-row__top">
              <div class="consumable-row__info">
                <h3 class="consumable-row__name">{con.name}</h3>
                <span class="consumable-row__category">{label(categoryLabels, con.category)}</span>
              </div>
              <div class="consumable-row__right">
                <span class="consumable-row__pct">{percent(con)}%</span>
                <button
                  class="btn btn--secondary btn--sm"
                  on:click={() => handleRefill(con)}
                >
                  Auffüllen
                </button>
              </div>
            </div>

            <div class="progress" style="margin: var(--space-3) 0;">
              <div
                class="progress__fill {barClass(con)}"
                style="width: {percent(con)}%"
                role="progressbar"
                aria-valuenow={percent(con)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="{con.name} level"
              ></div>
            </div>

            <div class="consumable-row__meta">
              <span>{con.currentAmount}{con.unit} / {con.maxAmount}{con.unit}</span>
              <span class="consumable-row__sep"></span>
              <span>~{washesRemaining(con)} Waschgänge</span>
              <span class="consumable-row__sep"></span>
              <span>~{daysRemaining(con)} Tage</span>
              <span class="consumable-row__sep"></span>
              <span>Aufgefüllt: {con.lastRefilled}</span>
            </div>
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  .page-header__row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 0 var(--space-4);
    min-height: 2.75rem;
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    margin-bottom: var(--space-5);
    color: var(--color-text-tertiary);
    transition: border-color var(--transition-fast);
  }

  .search-bar:focus-within {
    border-color: var(--color-accent);
    color: var(--color-text-secondary);
  }

  .search-bar__input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: var(--text-sm);
    font-family: var(--font-sans);
    color: var(--color-text);
    outline: none;
    min-height: 2.75rem;
  }

  .search-bar__input::placeholder {
    color: var(--color-text-tertiary);
  }

  .summary-stats {
    display: flex;
    gap: var(--space-10);
    padding-bottom: var(--space-6);
    border-bottom: 1px solid var(--color-border-light);
  }

  .summary-stat {
    display: flex;
    flex-direction: column;
  }

  .summary-stat__value {
    font-size: var(--text-2xl);
    font-weight: var(--weight-light);
    color: var(--color-text);
    line-height: 1;
  }

  .summary-stat__label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: var(--space-1);
  }

  .summary-stat--alert .summary-stat__value {
    color: var(--color-danger);
  }

  .consumable-list {
    display: flex;
    flex-direction: column;
  }

  .consumable-row {
    padding: var(--space-6) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .consumable-row:last-child {
    border-bottom: none;
  }

  .consumable-row__body {
    display: flex;
    align-items: center;
    gap: var(--space-5);
  }

  .consumable-row__image {
    flex-shrink: 0;
    width: 3.5rem;
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .consumable-row__image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .consumable-row__content {
    flex: 1;
    min-width: 0;
  }

  .consumable-row__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .consumable-row__info {
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
    min-width: 0;
  }

  .consumable-row__name {
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    color: var(--color-text);
    margin: 0;
  }

  .consumable-row__category {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .consumable-row__right {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .consumable-row__pct {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }

  .consumable-row__meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .consumable-row__sep {
    width: 3px;
    height: 3px;
    border-radius: var(--radius-full);
    background: var(--color-text-tertiary);
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    .consumable-row__meta {
      flex-wrap: wrap;
    }
    .summary-stats {
      gap: var(--space-6);
    }
  }
</style>
