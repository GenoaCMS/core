<script lang="ts">
    import type { ObjectReference } from '@genoacms/cloudabstraction/storage'
    import type { Snippet } from 'svelte'
    import { page } from '$app/state'
    import selection from '$lib/script/storage/SelectionRune.svelte'

    type Props = {
      name: string,
      children: Snippet,
      isDirectory?: boolean
    }
    export const { name, children, isDirectory = false }: Props = $props()
    const reference: ObjectReference = $derived({
      bucket: page.params.bucketId,
      name
    })
    const canSelect: boolean = $derived(!isDirectory || selection.allowDirectories)
    const isSelected = $derived(selection.isSelected(reference))

    function select () {
      selection.select(reference)
    }
</script>

<div class="w-auto h-auto relative z-[1]">
  {@render children()}
  {#if canSelect}
    <button onclick={select} aria-label="select-{name}" class="absolute top-0 start-0 p-2">
      <i
        class="bi text-2xl transition-all"
        class:bi-square={!isSelected}
        class:bi-check-square={isSelected}
      ></i>
    </button>
  {/if}
</div>
