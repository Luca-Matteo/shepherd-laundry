<!--
  AppShell — responsive layout shell.
  • Desktop (≥768px): sidebar on the left, content on the right.
  • Mobile (<768px): header on top, bottom tab bar.
  Uses semantic HTML5 elements and full ARIA landmarks.
-->
<script lang="ts">
  import Icon from "./Icon.svelte";

  interface NavItem {
    href: string;
    icon: string;
    label: string;
  }

  const nav: NavItem[] = [
    { href: "/", icon: "dashboard", label: "Dashboard" },
    { href: "/schedule", icon: "schedule", label: "Schedule" },
    { href: "/items", icon: "items", label: "Items" },
    { href: "/drying", icon: "drying", label: "Drying" },
    { href: "/consumables", icon: "consumables", label: "Supplies" },
    { href: "/analytics", icon: "analytics", label: "Analytics" },
    { href: "/settings", icon: "settings", label: "Settings" },
  ];

  export let currentPath: string = "/";

  function isActive(href: string): boolean {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  }

  // Bottom nav shows a subset to avoid overcrowding
  const bottomNav: NavItem[] = [
    nav[0], // Dashboard
    nav[1], // Schedule
    nav[2], // Items
    nav[4], // Supplies
    nav[6], // Settings
  ];
</script>

<div class="shell">
  <!-- Skip-to-content link -->
  <a class="skip-link" href="#main-content">Skip to content</a>

  <!-- ====== Sidebar (desktop) ====== -->
  <aside class="sidebar" aria-label="Main navigation">
    <div class="sidebar__brand">
      <div class="sidebar__logo">
        <Icon name="shepherd" size={28} />
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
              <Icon name={item.icon} size={20} />
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
  <header class="mobile-header" aria-label="App header">
    <div class="mobile-header__brand">
      <Icon name="shepherd" size={24} />
      <span>Shepherd</span>
    </div>
    <button class="mobile-header__avatar" aria-label="Account menu">
      A
    </button>
  </header>

  <!-- ====== Main content ====== -->
  <main id="main-content" class="main" role="main">
    <div class="main__inner">
      <slot />
    </div>
  </main>

  <!-- ====== Bottom nav (mobile) ====== -->
  <nav class="bottom-nav" aria-label="Main navigation">
    {#each bottomNav as item (item.href)}
      <a
        href={item.href}
        class="bottom-nav__item"
        class:bottom-nav__item--active={isActive(item.href)}
        aria-current={isActive(item.href) ? "page" : undefined}
      >
        <Icon name={item.icon} size={20} />
        <span class="bottom-nav__label">{item.label}</span>
      </a>
    {/each}
  </nav>
</div>

<style>
  /* ============================================
     Shell grid
     ============================================ */
  .shell {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    grid-template-rows: 1fr;
    min-height: 100vh;
    min-height: 100dvh;
  }

  /* ============================================
     Sidebar
     ============================================ */
  .sidebar {
    display: flex;
    flex-direction: column;
    background: var(--color-surface-raised);
    border-right: 1px solid var(--color-border-light);
    padding: var(--space-5) 0;
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
    padding: 0 var(--space-5);
    margin-bottom: var(--space-6);
    color: var(--color-green-700);
  }

  .sidebar__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: var(--color-green-100);
    border-radius: var(--radius-lg);
    color: var(--color-green-700);
  }

  .sidebar__name {
    font-size: var(--text-lg);
    font-weight: var(--weight-bold);
    letter-spacing: -0.01em;
  }

  .sidebar__nav {
    flex: 1;
    padding: 0 var(--space-3);
  }

  .sidebar__nav ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .sidebar__link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
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

  .sidebar__link--active {
    background: var(--color-green-50);
    color: var(--color-green-700);
  }

  .sidebar__link--active:hover {
    background: var(--color-green-100);
    color: var(--color-green-700);
  }

  .sidebar__footer {
    padding: var(--space-4) var(--space-5);
    border-top: 1px solid var(--color-border-light);
    margin-top: var(--space-4);
  }

  .sidebar__user {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .sidebar__avatar {
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-full);
    background: var(--color-green-600);
    color: var(--color-text-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
  }

  .sidebar__user-info {
    display: flex;
    flex-direction: column;
  }

  .sidebar__user-name {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
  }

  .sidebar__user-role {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  /* ============================================
     Mobile header (hidden on desktop)
     ============================================ */
  .mobile-header {
    display: none;
  }

  /* ============================================
     Main content
     ============================================ */
  .main {
    padding: var(--space-8);
    overflow-y: auto;
  }

  .main__inner {
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

  /* ============================================
     Bottom nav (hidden on desktop)
     ============================================ */
  .bottom-nav {
    display: none;
  }

  /* ============================================
     Mobile layout (< 768px)
     ============================================ */
  @media (max-width: 767px) {
    .shell {
      grid-template-columns: 1fr;
      grid-template-rows: var(--header-height) 1fr var(--bottom-nav-height);
    }

    .sidebar {
      display: none;
    }

    .mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-4);
      background: var(--color-surface-raised);
      border-bottom: 1px solid var(--color-border-light);
      position: sticky;
      top: 0;
      z-index: 20;
    }

    .mobile-header__brand {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--color-green-700);
      font-weight: var(--weight-bold);
      font-size: var(--text-base);
    }

    .mobile-header__avatar {
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-full);
      background: var(--color-green-600);
      color: var(--color-text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
    }

    .main {
      padding: var(--space-4);
      padding-bottom: var(--space-8);
    }

    .bottom-nav {
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: var(--color-surface-raised);
      border-top: 1px solid var(--color-border-light);
      position: sticky;
      bottom: 0;
      z-index: 20;
      padding: var(--space-1) 0;
      padding-bottom: env(safe-area-inset-bottom, var(--space-1));
    }

    .bottom-nav__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      color: var(--color-text-tertiary);
      font-size: var(--text-xs);
      text-decoration: none;
      transition:
        color var(--transition-fast),
        background var(--transition-fast);
      min-width: 3.5rem;
    }

    .bottom-nav__item:hover {
      color: var(--color-text-secondary);
      text-decoration: none;
    }

    .bottom-nav__item--active {
      color: var(--color-green-700);
    }

    .bottom-nav__label {
      font-weight: var(--weight-medium);
    }
  }
</style>
