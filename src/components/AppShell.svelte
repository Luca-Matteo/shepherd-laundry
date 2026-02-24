<!--
  AppShell — responsive layout shell.
  • Desktop (≥768px): sidebar on the left, content on the right.
  • Mobile (<768px): frosted header, floating bottom nav pill.
  Semantic HTML5, full ARIA landmarks.
-->
<script lang="ts">
  import Icon from "./Icon.svelte";

  interface NavItem {
    href: string;
    icon: string;
    label: string;
  }

  const nav: NavItem[] = [
    { href: "/", icon: "dashboard", label: "Übersicht" },
    { href: "/schedule", icon: "schedule", label: "Waschplan" },
    { href: "/items", icon: "items", label: "Wäsche" },
    { href: "/drying", icon: "drying", label: "Trocknung" },
    { href: "/consumables", icon: "consumables", label: "Vorräte" },
    { href: "/analytics", icon: "analytics", label: "Statistik" },
    { href: "/settings", icon: "settings", label: "Einstellungen" },
  ];

  export let currentPath: string = "/";

  function isActive(href: string): boolean {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  }

  const bottomNav: NavItem[] = [
    nav[0], nav[1], nav[2], nav[4], nav[6],
  ];
</script>

<div class="shell">
  <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

  <!-- ====== Sidebar (desktop) ====== -->
  <aside class="sidebar" aria-label="Hauptnavigation">
    <div class="sidebar__brand">
      <div class="sidebar__logo">
        <Icon name="shepherd" size={26} />
      </div>
      <span class="sidebar__name">Shepherd</span>
    </div>

    <nav class="sidebar__nav">
      <ul role="list">
        {#each nav as item (item.href)}
          <li>
            <a
              href={item.href}
              class="sidebar__link"
              class:sidebar__link--active={isActive(item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <span class="sidebar__link-icon">
                <Icon name={item.icon} size={20} />
              </span>
              <span>{item.label}</span>
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="sidebar__footer">
      <div class="sidebar__user">
        <div class="sidebar__avatar">A</div>
        <div class="sidebar__user-info">
          <span class="sidebar__user-name">Alex</span>
          <span class="sidebar__user-role">Admin</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- ====== Mobile header ====== -->
  <header class="mobile-header" aria-label="App-Kopfzeile">
    <div class="mobile-header__brand">
      <div class="mobile-header__logo">
        <Icon name="shepherd" size={22} />
      </div>
      <span>Shepherd</span>
    </div>
    <button class="mobile-header__avatar" aria-label="Kontomenü">A</button>
  </header>

  <!-- ====== Main content ====== -->
  <main id="main-content" class="main" role="main">
    <div class="main__inner">
      <slot />
    </div>
  </main>

  <!-- ====== Bottom nav (mobile) ====== -->
  <nav class="bottom-nav" aria-label="Hauptnavigation">
    <div class="bottom-nav__pill">
      {#each bottomNav as item (item.href)}
        <a
          href={item.href}
          class="bottom-nav__item"
          class:bottom-nav__item--active={isActive(item.href)}
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          <span class="bottom-nav__icon-wrap">
            <Icon name={item.icon} size={20} />
            {#if isActive(item.href)}
              <span class="bottom-nav__dot"></span>
            {/if}
          </span>
          <span class="bottom-nav__label">{item.label}</span>
        </a>
      {/each}
    </div>
  </nav>
</div>

<style>
  .shell {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    grid-template-rows: 1fr;
    min-height: 100vh;
    min-height: 100dvh;
  }

  /* ---- Sidebar ---- */
  .sidebar {
    display: flex;
    flex-direction: column;
    background: var(--color-surface-raised);
    box-shadow: 2px 0 16px rgba(30, 30, 20, 0.04);
    padding: var(--space-6) 0;
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100dvh;
    overflow-y: auto;
    z-index: 20;
  }

  .sidebar__brand {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 0 var(--space-6);
    margin-bottom: var(--space-8);
  }

  .sidebar__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(135deg, var(--color-green-600), var(--color-green-400));
    border-radius: var(--radius-lg);
    color: var(--color-text-inverse);
    box-shadow: 0 2px 8px rgba(74, 124, 89, 0.2);
  }

  .sidebar__name {
    font-size: var(--text-lg);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
  }

  .sidebar__nav {
    flex: 1;
    padding: 0 var(--space-3);
  }

  .sidebar__nav ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sidebar__link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 0.625rem var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-tertiary);
    text-decoration: none;
    transition:
      background var(--transition-fast),
      color var(--transition-fast);
  }

  .sidebar__link:hover {
    background: var(--color-surface-sunken);
    color: var(--color-text);
    text-decoration: none;
  }

  .sidebar__link-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    flex-shrink: 0;
  }

  .sidebar__link--active {
    background: var(--color-green-50);
    color: var(--color-green-700);
    font-weight: var(--weight-semibold);
    box-shadow: inset 3px 0 0 var(--color-green-500);
  }

  .sidebar__link--active:hover {
    background: var(--color-green-100);
    color: var(--color-green-700);
  }

  .sidebar__footer {
    padding: var(--space-5) var(--space-6);
    border-top: 1px solid var(--color-border-light);
    margin-top: var(--space-6);
  }

  .sidebar__user {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .sidebar__avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, var(--color-green-600), var(--color-green-400));
    color: var(--color-text-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    font-weight: var(--weight-bold);
    box-shadow: 0 2px 6px rgba(74, 124, 89, 0.15);
  }

  .sidebar__user-info {
    display: flex;
    flex-direction: column;
  }

  .sidebar__user-name {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-text);
  }

  .sidebar__user-role {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  /* ---- Mobile header ---- */
  .mobile-header {
    display: none;
  }

  /* ---- Main ---- */
  .main {
    padding: var(--space-10);
    overflow-y: auto;
  }

  .main__inner {
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

  /* ---- Bottom nav ---- */
  .bottom-nav {
    display: none;
  }

  /* ---- Mobile ---- */
  @media (max-width: 767px) {
    .shell {
      grid-template-columns: 1fr;
      grid-template-rows: var(--header-height) 1fr auto;
    }

    .sidebar {
      display: none;
    }

    .mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-5);
      background: rgba(246, 244, 239, 0.75);
      backdrop-filter: blur(16px) saturate(1.8);
      -webkit-backdrop-filter: blur(16px) saturate(1.8);
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .mobile-header__brand {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-weight: var(--weight-bold);
      font-size: var(--text-base);
      color: var(--color-text);
      letter-spacing: var(--tracking-tight);
    }

    .mobile-header__logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      background: linear-gradient(135deg, var(--color-green-600), var(--color-green-400));
      border-radius: var(--radius-sm);
      color: var(--color-text-inverse);
    }

    .mobile-header__avatar {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-green-600), var(--color-green-400));
      color: var(--color-text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.625rem;
      font-weight: var(--weight-bold);
    }

    .main {
      padding: var(--space-5);
      padding-bottom: calc(var(--bottom-nav-height) + var(--space-8));
    }

    .bottom-nav {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 30;
      padding: 0 var(--space-4) env(safe-area-inset-bottom, var(--space-2));
    }

    .bottom-nav__pill {
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: var(--color-surface-raised);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-lg);
      padding: var(--space-1) var(--space-1);
      margin-bottom: var(--space-2);
    }

    .bottom-nav__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-lg);
      color: var(--color-text-tertiary);
      font-size: 0.625rem;
      text-decoration: none;
      transition:
        color var(--transition-fast),
        background var(--transition-fast);
      min-width: 3.25rem;
    }

    .bottom-nav__item:hover {
      color: var(--color-text-secondary);
      text-decoration: none;
    }

    .bottom-nav__item--active {
      color: var(--color-green-700);
      background: var(--color-green-50);
    }

    .bottom-nav__icon-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .bottom-nav__dot {
      display: block;
      width: 4px;
      height: 4px;
      border-radius: var(--radius-full);
      background: var(--color-green-500);
      margin-top: 2px;
    }

    .bottom-nav__label {
      font-weight: var(--weight-semibold);
      letter-spacing: 0.01em;
    }
  }
</style>
