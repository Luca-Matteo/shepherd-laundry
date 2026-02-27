<!--
  Inline SVG icon component.
  Refined line-weight icons for the shepherd laundry theme.
  All icons: 24x24 viewBox, thin stroke-based rendering.
-->
<script lang="ts">
  export let name: string;
  export let size: number = 24;
  export let label: string = "";
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden={label ? "false" : "true"}
  role={label ? "img" : "presentation"}
  aria-label={label || undefined}
>
  {#if name === "dashboard"}
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="4" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="11" width="7" height="10" rx="1" />
  {:else if name === "schedule"}
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
  {:else if name === "items"}
    <path d="M20.38 3.46L16.01 2 7.99 4.18 3.62 2.73a.5.5 0 00-.62.48v16.06a.5.5 0 00.38.48l4.37 1.52L16.01 19l4.37 1.73a.5.5 0 00.62-.48V3.94a.5.5 0 00-.62-.48z" />
    <line x1="8" y1="4.2" x2="8" y2="21.3" />
    <line x1="16" y1="2" x2="16" y2="19" />
  {:else if name === "drying"}
    <path d="M12 2v6" />
    <path d="M8 4v4" />
    <path d="M16 4v4" />
    <path d="M4 10h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" />
    <path d="M6 14v4a2 2 0 002 2h8a2 2 0 002-2v-4" />
    <line x1="9" y1="17" x2="15" y2="17" />
  {:else if name === "consumables"}
    <path d="M8 2h8l2 5H6l2-5z" />
    <path d="M6 7v13a2 2 0 002 2h8a2 2 0 002-2V7" />
    <path d="M6 14h12" />
    <circle cx="10" cy="18" r="1" fill="currentColor" stroke="none" />
    <circle cx="14" cy="18" r="1" fill="currentColor" stroke="none" />
  {:else if name === "analytics"}
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  {:else if name === "settings"}
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  {:else if name === "plus"}
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  {:else if name === "chevron-right"}
    <polyline points="9 18 15 12 9 6" />
  {:else if name === "chevron-down"}
    <polyline points="6 9 12 15 18 9" />
  {:else if name === "clock"}
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  {:else if name === "droplet"}
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  {:else if name === "zap"}
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  {:else if name === "alert"}
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  {:else if name === "check"}
    <polyline points="20 6 9 17 4 12" />
  {:else if name === "x"}
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  {:else if name === "user"}
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  {:else if name === "users"}
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  {:else if name === "mail"}
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  {:else if name === "play"}
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
  {:else if name === "pause"}
    <circle cx="12" cy="12" r="10" />
    <line x1="10" y1="15" x2="10" y2="9" />
    <line x1="14" y1="15" x2="14" y2="9" />
  {:else if name === "sun"}
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  {:else if name === "wind"}
    <path d="M9.59 4.59A2 2 0 1111 8H2" />
    <path d="M12.59 19.41A2 2 0 1014 16H2" />
    <path d="M17.73 7.73A2.5 2.5 0 1119.5 12H2" />
  {:else if name === "thermometer"}
    <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
  {:else if name === "washing-machine"}
    <rect x="3" y="2" width="18" height="20" rx="2" />
    <circle cx="12" cy="13" r="5" />
    <circle cx="12" cy="13" r="2" />
    <line x1="7" y1="6" x2="7.01" y2="6" stroke-width="2" />
    <line x1="10" y1="6" x2="10.01" y2="6" stroke-width="2" />
  {:else if name === "search"}
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  {:else if name === "shepherd"}
    <!-- Laundry basket filled with towels — colored brand icon matching favicon -->
    <defs>
      <linearGradient id="sh-body" x1="12" y1="10" x2="12" y2="21.5" gradientUnits="userSpaceOnUse">
        <stop stop-color="#CC9A38"/>
        <stop offset="1" stop-color="#A87A28"/>
      </linearGradient>
      <linearGradient id="sh-rim" x1="12" y1="7.5" x2="12" y2="12.5" gradientUnits="userSpaceOnUse">
        <stop stop-color="#DDBA55"/>
        <stop offset="1" stop-color="#C8A040"/>
      </linearGradient>
      <linearGradient id="sh-towels" x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="1" stop-color="#EBE5D8"/>
      </linearGradient>
      <clipPath id="sh-clip">
        <path d="M3 10 L5.5 20 Q6 21.5 8 21.5 L16 21.5 Q18 21.5 18.5 20 L21 10 Z"/>
      </clipPath>
    </defs>
    <!-- Basket body -->
    <path d="M3 10 L5.5 20 Q6 21.5 8 21.5 L16 21.5 Q18 21.5 18.5 20 L21 10 Z" fill="url(#sh-body)" stroke="#8A6820" stroke-width=".6"/>
    <!-- Weave bands -->
    <g clip-path="url(#sh-clip)">
      <rect x="2" y="13.5" width="20" height="1.5" fill="#8A6820" stroke="none" opacity=".18"/>
      <rect x="2" y="17" width="20" height="1.5" fill="#8A6820" stroke="none" opacity=".18"/>
    </g>
    <!-- Rim -->
    <ellipse cx="12" cy="10" rx="9" ry="2.3" fill="url(#sh-rim)" stroke="#8A6820" stroke-width=".6"/>
    <!-- Interior shadow -->
    <ellipse cx="12" cy="11.3" rx="6.5" ry="1.2" fill="#604010" stroke="none" opacity=".08"/>
    <!-- Towels billowing over rim -->
    <path d="M6.5 9.2 Q5.5 4 9.5 3 Q11.5 3.5 10.5 7.5" fill="url(#sh-towels)" stroke="#B8B0A0" stroke-width=".4"/>
    <path d="M10 9 Q10.5 5.5 13 4.5 Q15 5 14 8.5" fill="url(#sh-towels)" stroke="#B8B0A0" stroke-width=".35"/>
    <path d="M13.5 8.5 Q14.5 5 17.5 4.5 Q19 5.5 17 8.5" fill="url(#sh-towels)" stroke="#B8B0A0" stroke-width=".4"/>
  {/if}
</svg>

<style>
  svg {
    flex-shrink: 0;
  }
</style>
