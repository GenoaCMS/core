<script lang="ts">
  import type { ResourceValue, Errors } from '../types'
  import type { ObjectReference } from '@genoacms/cloudabstraction/storage'
  import { onDestroy } from 'svelte'
  import { ITC } from '$lib/script/utils'
  import StorageObject from './StorageObject.svelte'
  import EditSelection from './EditSelection.svelte'
  import { Helper } from 'flowbite-svelte'

  type Props = {
    value: ResourceValue,
    errors: Errors,
    onvalue: (value: ResourceValue) => void
  }
  const { value, errors, onvalue }: Props = $props()
  let resource: ResourceValue = $state(value || null)
  const selectionId = crypto.randomUUID()
  const itc = new ITC(selectionId)

  function deleteResource () {
    resource = null
    updateValue()
  }
  function updateValue () {
    onvalue(resource)
  }

  itc.on('selectionInit', async () => {
    const parameters = {
      maxItems: 1
    }
    const selectionInitData = {
      parameters,
      defaultValue: resource ? [$state.snapshot(resource)] : []
    }
    itc.send('selectionInitData', selectionInitData)
    const selection = await itc.once('selectionDone') as Array<ObjectReference>
    itc.send('selectionKill')
    if (selection.length < 1) return
    resource = selection[0]
    updateValue()
  })

  onDestroy(() => {
    itc.close()
  })
</script>

<div class="flex flex-col">
  {#if resource}
    <StorageObject {resource} {deleteResource}/>
  {:else}
    <EditSelection {selectionId} hideDeleteButton/>
  {/if}
  {#if errors}
    <Helper color="red">
      Invalid
    </Helper>
  {/if}
</div>
