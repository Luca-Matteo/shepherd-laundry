<script lang="ts">
  import Icon from "./Icon.svelte";
  import GroupTag from "./GroupTag.svelte";
  import {
    dryingSessions,
    items as allItems,
    members,
    groups,
    cycleGroups,
    type DryingSession,
    type WashCycle,
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

  function sessionGroups(session: DryingSession) {
    // Reuse cycleGroups by creating a cycle-like shape
    const fakeCycle = { items: session.items } as WashCycle;
    return cycleGroups(fakeCycle, $allItems, $members, $groups);
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
        Trocknende Wäsche verfolgen und Methoden verwalten.
      </p>
    </div>
    <button class="btn btn--primary" on:click={handleNewSession}>
      <Icon name="plus" size={14} />
      Neue Sitzung
    </button>
  </div>
</div>

<!-- Method summary -->
<section class="section" aria-label="Übersicht Trocknungsmethoden">
  <div class="method-stats">
    {#each ["dryer", "indoor", "outdoor", "combo"] as method}
      {@const count = $dryingSessions.filter(
        (d) => d.method === method && d.status === "active",
      ).length}
      <div class="method-stat">
        <span class="method-stat__value">{count}</span>
        <span class="method-stat__label">{methodLabel(method)}</span>
      </div>
    {/each}
  </div>
</section>

<!-- Active sessions -->
<section class="section">
  <h2 class="section__title">Aktive Sitzungen</h2>

  {#if activeSessions.length === 0}
    <div class="empty-state">
      <div class="empty-state__icon">
        <Icon name="wind" size={32} />
      </div>
      <h3 class="empty-state__title">Nichts trocknet</h3>
      <p class="empty-state__text">Starte eine Trocknungssitzung, nachdem ein Waschgang abgeschlossen ist.</p>
    </div>
  {:else}
    <div class="sessions-list">
      {#each activeSessions as session (session.id)}
        <article class="session-entry" aria-label="Trocknungssitzung: {methodLabel(session.method)}">
          <div class="session-entry__top">
            <div class="session-entry__info">
              <h3 class="session-entry__method">{methodLabel(session.method)}</h3>
              <span class="session-entry__time">
                {formatTime(session.startedAt)} — {formatTime(session.estimatedEnd)}
              </span>
            </div>
            <div class="session-entry__right">
              <GroupTag groups={sessionGroups(session)} />
              <span class="session-entry__pct">{progress(session)}%</span>
            </div>
          </div>

          <div class="progress" style="margin: var(--space-3) 0;">
            <div
              class="progress__fill progress__fill--green"
              style="width: {progress(session)}%"
              role="progressbar"
              aria-valuenow={progress(session)}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>

          <div class="session-entry__items">
            {#each session.items as itemId}
              <span class="session-entry__item">{itemName(itemId)}</span>
            {/each}
          </div>

          <div class="session-entry__actions">
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

<!-- Tips -->
<section class="section">
  <h2 class="section__title">Trocknungstipps</h2>
  <div class="tips-list">
    <div class="tip-row">
      <h3 class="tip-row__title">Niedrige Hitze für Synthetik</h3>
      <p class="tip-row__text">
        Synthetische Stoffe bei hohen Temperaturen vermeiden. Lufttrocknung bevorzugen.
      </p>
    </div>
    <div class="tip-row">
      <h3 class="tip-row__title">Draußen trocknen spart Energie</h3>
      <p class="tip-row__text">
        Bei gutem Wetter: kein Energieverbrauch, frischer Duft.
      </p>
    </div>
    <div class="tip-row">
      <h3 class="tip-row__title">Luftzirkulation verbessern</h3>
      <p class="tip-row__text">
        Fenster öffnen oder Ventilator nutzen, um Trocknung zu beschleunigen.
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

  /* Method stats — inline, no cards */
  .method-stats {
    display: flex;
    gap: var(--space-10);
    padding-bottom: var(--space-6);
    border-bottom: 1px solid var(--color-border-light);
  }

  .method-stat {
    display: flex;
    flex-direction: column;
  }

  .method-stat__value {
    font-size: var(--text-2xl);
    font-weight: var(--weight-light);
    color: var(--color-text);
    line-height: 1;
  }

  .method-stat__label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: var(--space-1);
  }

  @media (max-width: 600px) {
    .method-stats {
      gap: var(--space-6);
    }
  }

  /* Sessions list — no cards */
  .sessions-list {
    display: flex;
    flex-direction: column;
  }

  .session-entry {
    padding: var(--space-6) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .session-entry:last-child {
    border-bottom: none;
  }

  .session-entry__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .session-entry__info {
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
  }

  .session-entry__method {
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    margin: 0;
  }

  .session-entry__time {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .session-entry__right {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .session-entry__pct {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }

  .session-entry__items {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-2);
  }

  .session-entry__item {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    padding: 0.125rem 0.5rem;
    background: var(--color-surface-sunken);
    border-radius: var(--radius-full);
  }

  .session-entry__actions {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-4);
  }

  /* Tips — clean rows */
  .tips-list {
    display: flex;
    flex-direction: column;
  }

  .tip-row {
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .tip-row:last-child {
    border-bottom: none;
  }

  .tip-row__title {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
    margin: 0 0 var(--space-1) 0;
  }

  .tip-row__text {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }
</style>
