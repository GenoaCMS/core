<script lang="ts">
    import ComponentNode from './Editor/ComponentNode.svelte'
    import { alertPending, toastError, toastSuccess } from '$lib/script/alert'
    import { enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'

    const { data } = $props()
    let currentNode = $state(data.node)
    const enhanceUpdate = () => {
      alertPending('Saving')
      return async ({ result }) => {
        if (result.type !== 'success') {
          toastError('Error saving')
          return
        }
        toastSuccess('Saved')
      }
    }
    const enhanceUndo = async () => {
      alertPending('Undoing')
      return async ({ result }) => {
        if (result.type !== 'success') {
          toastError('Undo failed')
          return
        }
        await invalidateAll()
        toastSuccess('Undid')
      }
    }
    const enhanceRedo = () => {
      alertPending('Redoing')
      return async ({ result }) => {
        if (result.type !== 'success') {
          toastError('Redo failed')
          return
        }
        await invalidateAll()
        toastSuccess('Redid')
      }
    }
    function updateAttribute (uid: string, value) {
      currentNode.data[uid].value = value
    }
    $effect(() => {
      currentNode = data.node
    })
</script>

<div class="h-full flex flex-col p-4">
  <div class="flex-grow">
    <ComponentNode node={currentNode} onupdate={updateAttribute}/>
  </div>
</div>

<form id="update-form" action="?/update" method="post" use:enhance={enhanceUpdate} hidden>
    <input type="text" name="componentNode" value={JSON.stringify(currentNode)} />
</form>
<form id="build-form" action="?/updateAndGenerateTree" method="post" use:enhance={enhanceUpdate} hidden>
    <input type="text" name="componentNode" value={JSON.stringify(currentNode)} />
</form>
<form id="undo-form" action="?/undo" method="post" use:enhance={enhanceUndo} hidden>
</form>
<form id="redo-form" action="?/redo" method="post" use:enhance={enhanceRedo} hidden>
</form>
