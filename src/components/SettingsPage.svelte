<script lang="ts">
  import Icon from "./Icon.svelte";
  import { roleLabels, label } from "../lib/labels";
  import { members, type FamilyMember } from "../lib/stores";

  let activeTab: "general" | "members" | "machines" | "notifications" =
    "general";

  let machineName = "Samsung WW90";
  let machineCapacity = "9";
  let preferredStartTime = "07:00";
  let preferredEndTime = "22:00";
  let energySaveMode = true;

  function handleInvite() {
    alert("Dialog zum Einladen — versendet eine E-Mail-Einladung.");
  }

  let confirmRemove: FamilyMember | null = null;

  function handleRemoveMember(m: FamilyMember) {
    if (m.role === "admin") return;
    confirmRemove = m;
  }

  function confirmRemoveAction() {
    if (confirmRemove) {
      members.update((all) => all.filter((x) => x.id !== confirmRemove!.id));
      confirmRemove = null;
    }
  }

  function cancelRemove() {
    confirmRemove = null;
  }

  function handleSave() {
    alert("Einstellungen gespeichert (Mock — würde an API senden).");
  }
</script>

<div class="page-header">
  <h1 class="page-header__title">Einstellungen</h1>
  <p class="page-header__subtitle">
    Haushalt, Geräte und Voreinstellungen verwalten.
  </p>
</div>

<!-- Tabs -->
<div class="tabs" role="tablist" aria-label="Einstellungsbereiche">
  {#each [
    { key: "general", label: "Allgemein" },
    { key: "members", label: "Mitglieder" },
    { key: "machines", label: "Geräte" },
    { key: "notifications", label: "Benachrichtigungen" },
  ] as tab (tab.key)}
    <button
      role="tab"
      class="tab"
      class:tab--active={activeTab === tab.key}
      aria-selected={activeTab === tab.key}
      on:click={() => (activeTab = tab.key)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<!-- Tab panels -->
<div class="tab-panel">
  <!-- General -->
  {#if activeTab === "general"}
    <section class="settings-section" aria-label="Allgemeine Einstellungen">
      <h2 class="settings-section__title">Haushalt</h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="label" for="household-name">Haushaltsname</label>
          <input
            id="household-name"
            type="text"
            class="input"
            value="Die Shepherd Familie"
          />
        </div>
        <div class="form-group">
          <label class="label" for="timezone">Zeitzone</label>
          <select id="timezone" class="select">
            <option>Europe/Berlin</option>
            <option>US/Eastern</option>
            <option>US/Pacific</option>
            <option>Asia/Tokyo</option>
          </select>
        </div>
      </div>

      <h2 class="settings-section__title settings-section__title--spaced">
        Zeitplan
      </h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="label" for="start-time">Früheste Startzeit</label>
          <input
            id="start-time"
            type="time"
            class="input"
            bind:value={preferredStartTime}
          />
        </div>
        <div class="form-group">
          <label class="label" for="end-time">Späteste Endzeit</label>
          <input
            id="end-time"
            type="time"
            class="input"
            bind:value={preferredEndTime}
          />
        </div>
      </div>

      <div class="form-group" style="margin-top: var(--space-5);">
        <label class="toggle-row">
          <input type="checkbox" bind:checked={energySaveMode} />
          <span class="toggle-label">
            <span class="toggle-label__text">Energiesparmodus</span>
            <span class="toggle-label__hint">
              Bevorzugt Nebenzeiten und niedrigere Temperaturen.
            </span>
          </span>
        </label>
      </div>

      <div class="settings-section__footer">
        <button class="btn btn--primary" on:click={handleSave}>
          Speichern
        </button>
      </div>
    </section>
  {/if}

  <!-- Members -->
  {#if activeTab === "members"}
    <section class="settings-section" aria-label="Familienmitglieder">
      <div class="settings-section__header">
        <h2 class="settings-section__title">Mitglieder</h2>
        <button class="btn btn--primary btn--sm" on:click={handleInvite}>
          <Icon name="mail" size={14} />
          Einladen
        </button>
      </div>

      <div class="members-list">
        {#each $members as member (member.id)}
          <div class="member-row">
            <div
              class="member-avatar"
              style="background: {member.color};"
            >
              {member.avatar}
            </div>
            <div class="member-info">
              <span class="member-name">{member.name}</span>
              <span class="member-email">{member.email}</span>
            </div>
            <span class="badge {member.role === 'admin' ? 'badge--green' : 'badge--neutral'}">
              {label(roleLabels, member.role)}
            </span>
            <button
              class="btn btn--ghost btn--sm"
              on:click={() => handleRemoveMember(member)}
              aria-label="{member.name} entfernen"
              disabled={member.role === "admin"}
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Machines -->
  {#if activeTab === "machines"}
    <section class="settings-section" aria-label="Geräte-Einstellungen">
      <h2 class="settings-section__title">Waschmaschine</h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="label" for="machine-name">Gerätename</label>
          <input
            id="machine-name"
            type="text"
            class="input"
            bind:value={machineName}
          />
        </div>
        <div class="form-group">
          <label class="label" for="machine-capacity">Kapazität (kg)</label>
          <input
            id="machine-capacity"
            type="number"
            class="input"
            bind:value={machineCapacity}
          />
        </div>
      </div>

      <h2 class="settings-section__title settings-section__title--spaced">
        Trockner
      </h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="label" for="dryer-name">Gerätename</label>
          <input
            id="dryer-name"
            type="text"
            class="input"
            value="Samsung DV90"
          />
        </div>
        <div class="form-group">
          <label class="label" for="dryer-capacity">Kapazität (kg)</label>
          <input
            id="dryer-capacity"
            type="number"
            class="input"
            value="9"
          />
        </div>
      </div>

      <div class="settings-section__footer">
        <button class="btn btn--primary" on:click={handleSave}>
          Speichern
        </button>
      </div>
    </section>
  {/if}

  <!-- Notifications -->
  {#if activeTab === "notifications"}
    <section class="settings-section" aria-label="Benachrichtigungseinstellungen">
      <h2 class="settings-section__title">E-Mail-Benachrichtigungen</h2>
      <div class="notification-list">
        {#each [
          { id: "cycle-done", label: "Waschgang abgeschlossen", hint: "Benachrichtigung, wenn ein Waschgang fertig ist.", checked: true },
          { id: "drying-done", label: "Trocknung fertig", hint: "Meldung, wenn die Wäsche getrocknet ist.", checked: true },
          { id: "supply-low", label: "Vorrat wird knapp", hint: "Warnung bei Verbrauchsmaterial unter 20%.", checked: true },
          { id: "schedule-reminder", label: "Zeitplan-Erinnerung", hint: "Tägliche Zusammenfassung bevorstehender Waschgänge.", checked: false },
          { id: "hygiene-alert", label: "Hygiene-Warnung", hint: "Wäschestücke, die ihr Intervall überschritten haben.", checked: true },
        ] as notif}
          <label class="toggle-row">
            <input type="checkbox" checked={notif.checked} />
            <span class="toggle-label">
              <span class="toggle-label__text">{notif.label}</span>
              <span class="toggle-label__hint">{notif.hint}</span>
            </span>
          </label>
        {/each}
      </div>

      <div class="settings-section__footer">
        <button class="btn btn--primary" on:click={handleSave}>
          Speichern
        </button>
      </div>
    </section>
  {/if}
</div>

<!-- Confirmation dialog -->
{#if confirmRemove}
  <div class="dialog-overlay" on:click={cancelRemove} role="presentation">
    <div
      class="dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-desc"
      on:click|stopPropagation
    >
      <h3 id="dialog-title" class="dialog__title">Mitglied entfernen?</h3>
      <p id="dialog-desc" class="dialog__text">
        <strong>{confirmRemove.name}</strong> wird dauerhaft aus dem Haushalt entfernt. Diese Aktion kann nicht rückgängig gemacht werden.
      </p>
      <div class="dialog__actions">
        <button class="btn btn--secondary" on:click={cancelRemove}>
          Abbrechen
        </button>
        <button class="btn btn--danger" on:click={confirmRemoveAction}>
          Entfernen
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .tabs {
    display: flex;
    gap: 0;
    margin-bottom: var(--space-10);
    border-bottom: 1px solid var(--color-border-light);
  }

  .tab {
    padding: var(--space-4) var(--space-5);
    min-height: 2.75rem;
    font-size: var(--text-sm);
    font-weight: var(--weight-normal);
    color: var(--color-text-tertiary);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition:
      color var(--transition-fast),
      border-color var(--transition-fast);
    white-space: nowrap;
  }

  .tab:active {
    color: var(--color-text-secondary);
  }

  @media (hover: hover) {
    .tab:hover {
      color: var(--color-text-secondary);
    }
  }

  .tab--active {
    color: var(--color-text);
    border-bottom-color: var(--color-text);
    font-weight: var(--weight-medium);
  }

  .settings-section {
    max-width: 36rem;
  }

  .settings-section__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-5);
  }

  .settings-section__header .settings-section__title {
    margin-bottom: 0;
  }

  .settings-section__title {
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    color: var(--color-text-tertiary);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    margin-bottom: var(--space-4);
  }

  .settings-section__title--spaced {
    margin-top: var(--space-8);
  }

  .settings-section__footer {
    margin-top: var(--space-8);
    padding-top: var(--space-5);
    border-top: 1px solid var(--color-border-light);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }

  @media (max-width: 600px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  /* Toggle rows */
  .toggle-row {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    cursor: pointer;
    padding: var(--space-4) 0;
    min-height: 2.75rem;
  }

  .toggle-row input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 3.0625rem;
    height: 1.875rem;
    background: var(--color-surface-muted);
    border-radius: var(--radius-full);
    position: relative;
    flex-shrink: 0;
    margin-top: 0;
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .toggle-row input[type="checkbox"]::after {
    content: "";
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 1.625rem;
    height: 1.625rem;
    border-radius: var(--radius-full);
    background: var(--color-surface-raised);
    box-shadow: var(--shadow-sm);
    transition: transform var(--transition-fast);
  }

  .toggle-row input[type="checkbox"]:checked {
    background: var(--color-accent);
  }

  .toggle-row input[type="checkbox"]:checked::after {
    transform: translateX(1.1875rem);
  }

  .toggle-label {
    display: flex;
    flex-direction: column;
  }

  .toggle-label__text {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
  }

  .toggle-label__hint {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: 2px;
    line-height: var(--leading-relaxed);
  }

  .notification-list {
    display: flex;
    flex-direction: column;
  }

  .notification-list .toggle-row {
    border-bottom: 1px solid var(--color-border-light);
    padding: var(--space-4) 0;
  }

  .notification-list .toggle-row:last-child {
    border-bottom: none;
  }

  /* Members list */
  .members-list {
    display: flex;
    flex-direction: column;
  }

  .member-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .member-row:last-child {
    border-bottom: none;
  }

  .member-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-full);
    color: var(--color-text-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    flex-shrink: 0;
  }

  .member-info {
    flex: 1;
    min-width: 0;
  }

  .member-name {
    display: block;
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
  }

  .member-email {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  /* Confirmation dialog */
  .dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
  }

  .dialog {
    background: var(--color-surface-raised);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    max-width: 22rem;
    width: 100%;
    box-shadow: var(--shadow-lg);
  }

  .dialog__title {
    font-size: var(--text-lg);
    font-weight: var(--weight-semibold);
    color: var(--color-text);
    margin-bottom: var(--space-2);
  }

  .dialog__text {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-normal);
    margin-bottom: var(--space-6);
  }

  .dialog__actions {
    display: flex;
    gap: var(--space-3);
    justify-content: flex-end;
  }

  :global(.btn--danger) {
    background: var(--color-danger);
    color: var(--color-text-inverse);
  }
</style>
