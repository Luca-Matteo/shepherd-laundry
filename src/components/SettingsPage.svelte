<script lang="ts">
  import Icon from "./Icon.svelte";
  import { members, type FamilyMember } from "../lib/stores";

  let activeTab: "general" | "members" | "machines" | "notifications" =
    "general";

  // Machine settings (mock)
  let machineName = "Samsung WW90";
  let machineCapacity = "9";
  let preferredStartTime = "07:00";
  let preferredEndTime = "22:00";
  let energySaveMode = true;

  function handleInvite() {
    alert("Dialog zum Einladen — versendet eine E-Mail-Einladung.");
  }

  function handleRemoveMember(m: FamilyMember) {
    if (m.role === "admin") {
      alert("Das Admin-Konto kann nicht entfernt werden.");
      return;
    }
    members.update((all) => all.filter((x) => x.id !== m.id));
  }

  function handleSave() {
    alert("Einstellungen gespeichert (Mock — würde an API senden).");
  }
</script>

<div class="page-header">
  <h1 class="page-header__title">Einstellungen</h1>
  <p class="page-header__subtitle">
    Verwalte deinen Haushalt, Geräte und Voreinstellungen.
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
    <section class="card settings-section" aria-label="Allgemeine Einstellungen">
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

      <h2 class="settings-section__title" style="margin-top: var(--space-6);">
        Zeitplan-Einstellungen
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

      <div class="form-group" style="margin-top: var(--space-4);">
        <label class="toggle-row">
          <input type="checkbox" bind:checked={energySaveMode} />
          <span class="toggle-label">
            <span class="toggle-label__text">Energiesparmodus</span>
            <span class="toggle-label__hint">
              Bevorzugt Nebenzeiten und niedrigere Temperaturen wenn möglich.
            </span>
          </span>
        </label>
      </div>

      <div class="settings-section__footer">
        <button class="btn btn--primary" on:click={handleSave}>
          Änderungen speichern
        </button>
      </div>
    </section>
  {/if}

  <!-- Members -->
  {#if activeTab === "members"}
    <section class="card settings-section" aria-label="Familienmitglieder">
      <div class="settings-section__header">
        <h2 class="settings-section__title">Familienmitglieder</h2>
        <button class="btn btn--primary btn--sm" on:click={handleInvite}>
          <Icon name="mail" size={16} />
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
              {member.role}
            </span>
            <button
              class="btn btn--ghost btn--sm"
              on:click={() => handleRemoveMember(member)}
              aria-label="{member.name} entfernen"
              disabled={member.role === "admin"}
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Machines -->
  {#if activeTab === "machines"}
    <section class="card settings-section" aria-label="Geräte-Einstellungen">
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

      <h2 class="settings-section__title" style="margin-top: var(--space-6);">
        Trockner
      </h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="label" for="dryer-name">Trocknername</label>
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
          Änderungen speichern
        </button>
      </div>
    </section>
  {/if}

  <!-- Notifications -->
  {#if activeTab === "notifications"}
    <section class="card settings-section" aria-label="Benachrichtigungseinstellungen">
      <h2 class="settings-section__title">E-Mail-Benachrichtigungen</h2>
      <div class="notification-list">
        {#each [
          { id: "cycle-done", label: "Waschgang abgeschlossen", hint: "Benachrichtigung, wenn ein Waschgang fertig ist.", checked: true },
          { id: "drying-done", label: "Trocknung fertig", hint: "Meldung, wenn die Wäsche getrocknet ist.", checked: true },
          { id: "supply-low", label: "Vorrat wird knapp", hint: "Warnung, wenn Verbrauchsmaterial unter 20% fällt.", checked: true },
          { id: "schedule-reminder", label: "Zeitplan-Erinnerung", hint: "Tägliche Zusammenfassung der bevorstehenden Waschgänge.", checked: false },
          { id: "hygiene-alert", label: "Hygiene-Warnung", hint: "Wäschestücke, die ihr Waschintervall überschritten haben.", checked: true },
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
          Änderungen speichern
        </button>
      </div>
    </section>
  {/if}
</div>

<style>
  .tabs {
    display: flex;
    gap: var(--space-1);
    margin-bottom: var(--space-8);
    overflow-x: auto;
    background: var(--color-surface-sunken);
    border-radius: var(--radius-lg);
    padding: var(--space-1);
  }

  .tab {
    padding: 0.5rem 1rem;
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-tertiary);
    border-radius: var(--radius-md);
    transition:
      color var(--transition-fast),
      background var(--transition-fast),
      box-shadow var(--transition-fast);
    white-space: nowrap;
  }

  .tab:hover {
    color: var(--color-text);
  }

  .tab--active {
    color: var(--color-green-700);
    background: var(--color-surface-raised);
    box-shadow: var(--shadow-sm);
    font-weight: var(--weight-semibold);
  }

  .settings-section__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-4);
  }

  .settings-section__header .settings-section__title {
    margin-bottom: 0;
  }

  .settings-section__title {
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-4);
  }

  .settings-section__footer {
    margin-top: var(--space-6);
    padding-top: var(--space-4);
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
    padding: var(--space-3) 0;
  }

  .toggle-row input[type="checkbox"] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: var(--color-green-600);
    margin-top: 2px;
    flex-shrink: 0;
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
  }

  .notification-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .notification-list .toggle-row {
    border-bottom: 1px solid var(--color-border-light);
  }

  .notification-list .toggle-row:last-child {
    border-bottom: none;
  }

  /* Members list */
  .members-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .member-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    transition: background var(--transition-fast);
  }

  .member-row:hover {
    background: var(--color-surface);
  }

  .member-avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-full);
    color: var(--color-text-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
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
  }

  .member-email {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }
</style>
