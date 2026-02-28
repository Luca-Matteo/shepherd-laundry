<script lang="ts">
  import type { HouseholdGroup } from "../lib/stores";

  export let groups: HouseholdGroup[] = [];
  export let small: boolean = false;
</script>

{#if groups.length > 0}
  <span class="group-tags" aria-label={groups.map((g) => g.name).join(", ")}>
    {#each groups as group (group.id)}
      <span class="group-tag" class:group-tag--sm={small}>{group.initials}</span>
    {/each}
  </span>
{/if}
