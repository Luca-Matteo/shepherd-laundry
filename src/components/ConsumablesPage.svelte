<script lang="ts">
  import Icon from "./Icon.svelte";
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
    // Assume ~1 wash per day on average
    return washesRemaining(c);
  }

  function categoryIcon(cat: Consumable["category"]): string {
    switch (cat) {
      case "detergent":
        return "droplet";
      case "softener":
        return "wind";
      case "bleach":
        return "zap";
      case "stain-remover":
        return "alert";
      default:
        return "consumables";
    }
  }

  function categoryColor(cat: Consumable["category"]): string {
    switch (cat) {
      case "detergent":
        return "var(--color-green-600)";
      case "softener":
        return "var(--color-green-500)";
      case "bleach":
        return "var(--color-orange-600)";
      case "stain-remover":
        return "var(--color-orange-500)";
      default:
        return "var(--color-text-secondary)";
    }
  }

  function categoryBg(cat: Consumable["category"]): string {
    switch (cat) {
      case "detergent":
        return "var(--color-green-50)";
      case "softener":
        return "var(--color-green-50)";
      case "bleach":
        return "var(--color-orange-50)";
      case "stain-remover":
        return "var(--color-orange-50)";
      default:
        return "var(--color-surface-sunken)";
    }
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

  function handleAdd() {
    alert("Add consumable dialog would open here.");
  }
</script>

<div class="page-header">
  <div class="page-header__row">
    <div>
      <h1 class="page-header__title">Supplies</h1>
      <p class="page-header__subtitle">
        Track detergent and consumables. Get alerts before they run out.
      </p>
    </div>
    <button class="btn btn--primary" on:click={handleAdd}>
      <Icon name="plus" size={16} />
      Add Supply
    </button>
  </div>
</div>

<!-- Summary strip -->
<section class="section" aria-label="Supply levels overview">
  <div class="grid grid--stats">
    <div class="card stat">
      <div class="stat__value">{$consumables.length}</div>
      <div class="stat__label">Tracked supplies</div>
    </div>
    <div class="card stat">
      <div class="stat__value">
        {$consumables.filter((c) => percent(c) < 30).length}
      </div>
      <div class="stat__label">Running low</div>
    </div>
    <div class="card stat">
      <div class="stat__value">
        {$consumables.filter((c) => percent(c) < 10).length}
      </div>
      <div class="stat__label">Critical</div>
    </div>
  </div>
</section>

<!-- Consumable cards -->
<section class="section">
  <h2 class="section__title">All Supplies</h2>
  <div class="consumable-grid">
    {#each $consumables as con (con.id)}
      <article class="card card--interactive consumable-card" aria-label="{con.name}">
        <div class="consumable-card__header">
          <div
            class="consumable-card__icon"
            style="background: {categoryBg(con.category)}; color: {categoryColor(con.category)};"
          >
            <Icon name={categoryIcon(con.category)} size={20} />
          </div>
          <div class="consumable-card__info">
            <h3 class="consumable-card__name">{con.name}</h3>
            <span class="consumable-card__category badge badge--neutral">{con.category}</span>
          </div>
        </div>

        <!-- Level bar -->
        <div class="consumable-card__level">
          <div class="consumable-card__level-header">
            <span>
              {con.currentAmount}{con.unit} / {con.maxAmount}{con.unit}
            </span>
            <span class="consumable-card__pct">{percent(con)}%</span>
          </div>
          <div class="progress">
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
        </div>

        <!-- Predictions -->
        <div class="consumable-card__predictions">
          <div class="consumable-card__pred">
            <Icon name="washing-machine" size={14} />
            <span>~{washesRemaining(con)} washes left</span>
          </div>
          <div class="consumable-card__pred">
            <Icon name="clock" size={14} />
            <span>~{daysRemaining(con)} days left</span>
          </div>
        </div>

        <div class="consumable-card__footer">
          <span class="consumable-card__refilled">
            Refilled: {con.lastRefilled}
          </span>
          <button
            class="btn btn--secondary btn--sm"
            on:click={() => handleRefill(con)}
          >
            Refill
          </button>
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

  .consumable-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    gap: var(--space-4);
  }

  .consumable-card__header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .consumable-card__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-lg);
    flex-shrink: 0;
  }

  .consumable-card__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  .consumable-card__name {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .consumable-card__level {
    margin-bottom: var(--space-3);
  }

  .consumable-card__level-header {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-1);
  }

  .consumable-card__pct {
    font-weight: var(--weight-semibold);
  }

  .consumable-card__predictions {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin-bottom: var(--space-3);
  }

  .consumable-card__pred {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .consumable-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-light);
  }

  .consumable-card__refilled {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }
</style>
