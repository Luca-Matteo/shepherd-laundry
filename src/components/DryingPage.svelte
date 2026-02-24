<script lang="ts">
  import Icon from "./Icon.svelte";
  import {
    dryingSessions,
    items as allItems,
    type DryingSession,
  } from "../lib/stores";

  function methodLabel(method: DryingSession["method"]): string {
    switch (method) {
      case "dryer":
        return "Wäschetrockner";
      case "indoor":
        return "Innen aufhängen";
      case "outdoor":
        return "Draußen aufhängen";
      case "combo":
        return "Kombination";
    }
  }

  function methodIcon(method: DryingSession["method"]): string {
    switch (method) {
      case "dryer":
        return "zap";
      case "indoor":
        return "drying";
      case "outdoor":
        return "sun";
      case "combo":
        return "wind";
    }
  }

  function methodColor(method: DryingSession["method"]): string {
    switch (method) {
      case "dryer":
        return "var(--color-orange-600)";
      case "indoor":
        return "var(--color-green-600)";
      case "outdoor":
        return "var(--color-green-500)";
      case "combo":
        return "var(--color-orange-500)";
    }
  }

  function methodBg(method: DryingSession["method"]): string {
    switch (method) {
      case "dryer":
        return "var(--color-orange-50)";
      case "indoor":
        return "var(--color-green-50)";
      case "outdoor":
        return "var(--color-green-50)";
      case "combo":
        return "var(--color-orange-50)";
    }
  }

  function itemName(id: string): string {
    return $allItems.find((i) => i.id === id)?.name ?? id;
  }

  function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function progress(session: DryingSession): number {
    const start = new Date(session.startedAt).getTime();
    const end = new Date(session.estimatedEnd).getTime();
    const now = new Date("2026-02-24T11:00:00").getTime();
    const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
    return Math.round(pct);
  }

  $: activeSessions = $dryingSessions.filter((d) => d.status === "active");
  $: completedSessions = $dryingSessions.filter(
    (d) => d.status === "completed",
  );

  function handleNewSession() {
    alert("Dialog für neue Trocknungssitzung würde hier erscheinen.");
  }
</script>

<div class="page-header">
  <div class="page-header__row">
    <div>
      <h1 class="page-header__title">Trocknung</h1>
      <p class="page-header__subtitle">
        Verfolge trocknende Wäsche und verwalte Trocknungsmethoden.
      </p>
    </div>
    <button class="btn btn--primary" on:click={handleNewSession}>
      <Icon name="plus" size={16} />
      Neue Sitzung
    </button>
  </div>
</div>

<!-- Method summary cards -->
<section class="section" aria-label="Übersicht Trocknungsmethoden">
  <div class="grid grid--stats">
    {#each ["dryer", "indoor", "outdoor", "combo"] as method}
      {@const count = $dryingSessions.filter(
        (d) => d.method === method && d.status === "active",
      ).length}
      <div class="card method-stat">
        <div
          class="method-stat__icon"
          style="background: {methodBg(method)}; color: {methodColor(method)};"
        >
          <Icon name={methodIcon(method)} size={20} />
        </div>
        <div class="method-stat__info">
          <span class="stat__value">{count}</span>
          <span class="stat__label">{methodLabel(method)}</span>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- Active sessions -->
<section class="section">
  <h2 class="section__title">Aktive Sitzungen</h2>

  {#if activeSessions.length === 0}
    <div class="empty-state card">
      <div class="empty-state__icon">
        <Icon name="wind" size={48} />
      </div>
      <h3 class="empty-state__title">Nichts trocknet</h3>
      <p class="empty-state__text">Starte eine Trocknungssitzung, nachdem ein Waschgang abgeschlossen ist.</p>
    </div>
  {:else}
    <div class="sessions-grid">
      {#each activeSessions as session (session.id)}
        <article class="card card--interactive session-card" aria-label="Trocknungssitzung: {methodLabel(session.method)}">
          <div class="session-card__header">
            <div
              class="session-card__icon"
              style="background: {methodBg(session.method)}; color: {methodColor(session.method)};"
            >
              <Icon name={methodIcon(session.method)} size={20} />
            </div>
            <div>
              <h3 class="session-card__method">{methodLabel(session.method)}</h3>
              <span class="session-card__time">
                {formatTime(session.startedAt)} — est. {formatTime(session.estimatedEnd)}
              </span>
            </div>
          </div>

          <div class="session-card__progress">
            <div class="session-card__progress-header">
              <span>Fortschritt</span>
              <span>{progress(session)}%</span>
            </div>
            <div class="progress">
              <div
                class="progress__fill progress__fill--green"
                style="width: {progress(session)}%"
                role="progressbar"
                aria-valuenow={progress(session)}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>

          <div class="session-card__items">
            <span class="session-card__items-label">Teile:</span>
            {#each session.items as itemId}
              <span class="badge badge--neutral">{itemName(itemId)}</span>
            {/each}
          </div>

          <div class="session-card__actions">
            <button class="btn btn--primary btn--sm">
              <Icon name="check" size={14} />
              Fertig
            </button>
            <button class="btn btn--ghost btn--sm">Details</button>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</section>

<!-- Recommendations -->
<section class="section">
  <h2 class="section__title">Trocknungstipps</h2>
  <div class="grid grid--cards">
    <div class="card tip-card">
      <div class="tip-card__icon" style="color: var(--color-orange-600);">
        <Icon name="thermometer" size={20} />
      </div>
      <h3 class="tip-card__title">Niedrige Hitze für Synthetik</h3>
      <p class="tip-card__text">
        Synthetische Stoffe können bei hohen Temperaturen schmelzen oder einlaufen. Verwende niedrige Hitze oder Lufttrocknung.
      </p>
    </div>
    <div class="card tip-card">
      <div class="tip-card__icon" style="color: var(--color-green-600);">
        <Icon name="sun" size={20} />
      </div>
      <h3 class="tip-card__title">Draußen trocknen spart Energie</h3>
      <p class="tip-card__text">
        Bei gutem Wetter verbraucht das Trocknen im Freien keine Energie und verleiht der Wäsche einen frischen Duft.
      </p>
    </div>
    <div class="card tip-card">
      <div class="tip-card__icon" style="color: var(--color-green-700);">
        <Icon name="wind" size={20} />
      </div>
      <h3 class="tip-card__title">Luftzirkulation verbessern</h3>
      <p class="tip-card__text">
        Öffne Fenster oder stelle einen Ventilator neben den Wäscheständer, um die Trocknung zu beschleunigen und Schimmel zu vermeiden.
      </p>
    </div>
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

  .method-stat {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .method-stat__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-lg);
    flex-shrink: 0;
  }

  .method-stat__info {
    display: flex;
    flex-direction: column;
  }

  .sessions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: var(--space-4);
  }

  .session-card__header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .session-card__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-lg);
    flex-shrink: 0;
  }

  .session-card__method {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .session-card__time {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .session-card__progress {
    margin-bottom: var(--space-3);
  }

  .session-card__progress-header {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-1);
  }

  .session-card__items {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .session-card__items-label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    font-weight: var(--weight-medium);
  }

  .session-card__actions {
    display: flex;
    gap: var(--space-2);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-light);
  }

  .tip-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .tip-card__icon {
    margin-bottom: var(--space-1);
  }

  .tip-card__title {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .tip-card__text {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }
</style>
