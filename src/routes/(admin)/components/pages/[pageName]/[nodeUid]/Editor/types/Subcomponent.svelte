<script lang="ts">
  import type { ComponentNode as ComponentNodeT } from '$lib/script/components/page/entry/types'
  import { Card } from 'flowbite-svelte'
  import { confirmationModal } from '$lib/script/alert'
  import { dragHandle } from 'svelte-dnd-action'

  interface Props {
    node: ComponentNodeT,
    ondelete: (uid: string) => void
  }
  const { node, ondelete }: Props = $props()

  async function deleteNode () {
    const confirmation = await confirmationModal(`Do you want to delete component ${node.name}?`)
    if (confirmation.isConfirmed) {
      ondelete(node.uid)
    }
  }
</script>

<Card padding="sm" size="none">
  <div class="flex items-center gap-6">
    <div class="me-auto">
      {node.name} <span class="text-xs">#{node.uid.substring(0, 5)}</span>
    </div>
    <div>
      <a href={node.uid} aria-label="Edit">
        <i class="bi bi-pencil-square text-2xl m-auto"></i>
      </a>
    </div>
    <div>
      <button aria-label="Dragger" type="button" use:dragHandle>
        <i class="bi bi-arrow-down-up text-2xl m-auto"></i>
      </button>
    </div>
    <div>
      <button aria-label="Delete" type="button" onclick={deleteNode}>
        <i class="bi bi-trash text-2xl m-auto text-red-700"></i>
      </button>
    </div>

  </div>
</Card>
