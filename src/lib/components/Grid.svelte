<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children?: Snippet
  }
  const { children, ...restProps }: Props = $props()
</script>

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols- gap-5 p-5" {...restProps}>
  {@render children?.()}
</div>
