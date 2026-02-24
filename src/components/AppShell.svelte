<!--
  AppShell — responsive layout shell.
  LoveFrom-inspired: navigation that guides without demanding attention.
  • Desktop (>=768px): quiet sidebar, generous spacing.
  • Mobile (<768px): clean header, understated bottom nav.
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
      <Icon name="shepherd" size={18} />
      <div class="sidebar__brand-text">
        <span class="sidebar__name">Shepherd</span>
        <span class="sidebar__tagline">Laundry</span>
      </div>
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
                <Icon name={item.icon} size={18} />
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
      <Icon name="shepherd" size={16} />
      <span class="mobile-header__name">Shepherd</span>
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
    <div class="bottom-nav__bar">
      {#each bottomNav as item (item.href)}
        <a
          href={item.href}
          class="bottom-nav__item"
          class:bottom-nav__item--active={isActive(item.href)}
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          <Icon name={item.icon} size={18} />
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
    border-right: 1px solid var(--color-border-light);
    padding: var(--space-8) 0;
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
    margin-bottom: var(--space-10);
    color: var(--color-text);
  }

  .sidebar__brand-text {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
  }

  .sidebar__name {
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
    line-height: 1;
  }

  .sidebar__tagline {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    font-weight: var(--weight-normal);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    line-height: 1;
  }

  .sidebar__nav {
    flex: 1;
    padding: 0 var(--space-4);
  }

  .sidebar__nav ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .sidebar__link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 0.5rem var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: var(--weight-normal);
    color: var(--color-text-tertiary);
    text-decoration: none;
    transition:
      color var(--transition-fast),
      background var(--transition-fast);
  }

  .sidebar__link:hover {
    color: var(--color-text);
    text-decoration: none;
  }

  .sidebar__link-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
  }

  .sidebar__link--active {
    color: var(--color-text);
    font-weight: var(--weight-medium);
    background: var(--color-surface-sunken);
  }

  .sidebar__link--active:hover {
    background: var(--color-surface-sunken);
  }

  .sidebar__footer {
    padding: var(--space-6) var(--space-6) 0;
    border-top: 1px solid var(--color-border-light);
    margin-top: var(--space-8);
  }

  .sidebar__user {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .sidebar__avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--radius-full);
    background: var(--color-text);
    color: var(--color-text-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
  }

  .sidebar__user-info {
    display: flex;
    flex-direction: column;
  }

  .sidebar__user-name {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
    line-height: 1.2;
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
    padding: var(--space-10) var(--space-12);
    overflow-y: auto;
    background: var(--color-surface);
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
      background: rgba(248, 248, 245, 0.85);
      backdrop-filter: blur(20px) saturate(1.5);
      -webkit-backdrop-filter: blur(20px) saturate(1.5);
      border-bottom: 1px solid var(--color-border-light);
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .mobile-header__brand {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--color-text);
    }

    .mobile-header__name {
      font-weight: var(--weight-semibold);
      font-size: var(--text-sm);
      color: var(--color-text);
      letter-spacing: var(--tracking-tight);
    }

    .mobile-header__avatar {
      width: 1.625rem;
      height: 1.625rem;
      border-radius: var(--radius-full);
      background: var(--color-text);
      color: var(--color-text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.5625rem;
      font-weight: var(--weight-medium);
    }

    .main {
      padding: var(--space-6);
      padding-bottom: calc(var(--bottom-nav-height) + var(--space-8));
    }

    .bottom-nav {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 30;
      background: rgba(248, 248, 245, 0.9);
      backdrop-filter: blur(20px) saturate(1.5);
      -webkit-backdrop-filter: blur(20px) saturate(1.5);
      border-top: 1px solid var(--color-border-light);
      padding-bottom: env(safe-area-inset-bottom, 0);
    }

    .bottom-nav__bar {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: var(--space-2) 0;
    }

    .bottom-nav__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: var(--space-1) var(--space-3);
      color: var(--color-text-tertiary);
      font-size: 0.5625rem;
      text-decoration: none;
      transition: color var(--transition-fast);
      min-width: 3rem;
    }

    .bottom-nav__item:hover {
      color: var(--color-text-secondary);
      text-decoration: none;
    }

    .bottom-nav__item--active {
      color: var(--color-text);
    }

    .bottom-nav__label {
      font-weight: var(--weight-medium);
      letter-spacing: 0.01em;
    }
  }
</style>
