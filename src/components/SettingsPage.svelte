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
    alert("Invite member dialog would open — sends email invitation.");
  }

  function handleRemoveMember(m: FamilyMember) {
    if (m.role === "admin") {
      alert("Cannot remove the admin account.");
      return;
    }
    members.update((all) => all.filter((x) => x.id !== m.id));
  }

  function handleSave() {
    alert("Settings saved (mock — would POST to API).");
  }
</script>

<div class="page-header">
  <h1 class="page-header__title">Settings</h1>
  <p class="page-header__subtitle">
    Manage your household, machines, and preferences.
  </p>
</div>

<!-- Tabs -->
<div class="tabs" role="tablist" aria-label="Settings sections">
  {#each [
    { key: "general", label: "General" },
    { key: "members", label: "Members" },
    { key: "machines", label: "Machines" },
    { key: "notifications", label: "Notifications" },
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
    <section class="card settings-section" aria-label="General settings">
      <h2 class="settings-section__title">Household</h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="label" for="household-name">Household name</label>
          <input
            id="household-name"
            type="text"
            class="input"
            value="The Shepherd Home"
          />
        </div>
        <div class="form-group">
          <label class="label" for="timezone">Timezone</label>
          <select id="timezone" class="select">
            <option>Europe/Berlin</option>
            <option>US/Eastern</option>
            <option>US/Pacific</option>
            <option>Asia/Tokyo</option>
          </select>
        </div>
      </div>

      <h2 class="settings-section__title" style="margin-top: var(--space-6);">
        Schedule Preferences
      </h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="label" for="start-time">Earliest start time</label>
          <input
            id="start-time"
            type="time"
            class="input"
            bind:value={preferredStartTime}
          />
        </div>
        <div class="form-group">
          <label class="label" for="end-time">Latest end time</label>
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
            <span class="toggle-label__text">Energy saving mode</span>
            <span class="toggle-label__hint">
              Prefer off-peak hours and lower temperatures when possible.
            </span>
          </span>
        </label>
      </div>

      <div class="settings-section__footer">
        <button class="btn btn--primary" on:click={handleSave}>
          Save Changes
        </button>
      </div>
    </section>
  {/if}

  <!-- Members -->
  {#if activeTab === "members"}
    <section class="card settings-section" aria-label="Family members">
      <div class="settings-section__header">
        <h2 class="settings-section__title">Family Members</h2>
        <button class="btn btn--primary btn--sm" on:click={handleInvite}>
          <Icon name="mail" size={16} />
          Invite
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
              aria-label="Remove {member.name}"
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
    <section class="card settings-section" aria-label="Machine settings">
      <h2 class="settings-section__title">Washing Machine</h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="label" for="machine-name">Machine name</label>
          <input
            id="machine-name"
            type="text"
            class="input"
            bind:value={machineName}
          />
        </div>
        <div class="form-group">
          <label class="label" for="machine-capacity">Capacity (kg)</label>
          <input
            id="machine-capacity"
            type="number"
            class="input"
            bind:value={machineCapacity}
          />
        </div>
      </div>

      <h2 class="settings-section__title" style="margin-top: var(--space-6);">
        Dryer
      </h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="label" for="dryer-name">Dryer name</label>
          <input
            id="dryer-name"
            type="text"
            class="input"
            value="Samsung DV90"
          />
        </div>
        <div class="form-group">
          <label class="label" for="dryer-capacity">Capacity (kg)</label>
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
          Save Changes
        </button>
      </div>
    </section>
  {/if}

  <!-- Notifications -->
  {#if activeTab === "notifications"}
    <section class="card settings-section" aria-label="Notification settings">
      <h2 class="settings-section__title">Email Notifications</h2>
      <div class="notification-list">
        {#each [
          { id: "cycle-done", label: "Cycle completed", hint: "Get notified when a wash cycle finishes.", checked: true },
          { id: "drying-done", label: "Drying complete", hint: "Alert when items are done drying.", checked: true },
          { id: "supply-low", label: "Supply running low", hint: "Warning when consumables drop below 20%.", checked: true },
          { id: "schedule-reminder", label: "Schedule reminder", hint: "Daily digest of upcoming wash cycles.", checked: false },
          { id: "hygiene-alert", label: "Hygiene alert", hint: "Items that have exceeded their wash interval.", checked: true },
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
          Save Changes
        </button>
      </div>
    </section>
  {/if}
</div>

<style>
  .tabs {
    display: flex;
    gap: var(--space-1);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-6);
    overflow-x: auto;
  }

  .tab {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
    border-bottom: 2px solid transparent;
    transition:
      color var(--transition-fast),
      border-color var(--transition-fast);
    white-space: nowrap;
  }

  .tab:hover {
    color: var(--color-text);
  }

  .tab--active {
    color: var(--color-green-700);
    border-bottom-color: var(--color-green-600);
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
