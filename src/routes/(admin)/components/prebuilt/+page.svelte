<script lang="ts">
  import TopPanel from '$lib/components/TopPanel.svelte'
  import CreateComponentSchema from './CreateComponentEntry.svelte'
  import ComponentEntry from './ComponentEntry.svelte'
  import Grid from '$lib/components/Grid.svelte'

  const { data } = $props()
</script>

<TopPanel>
    <h1 class="text-2xl">
        Prebuilt component management
    </h1>
    {#snippet right()}
        <CreateComponentSchema creationForm={data.creationForm}/>
    {/snippet}
</TopPanel>

<Grid>
    {#each data.componentEntries as entry (entry.uid)}
        <ComponentEntry {entry}/>
    {/each}
</Grid>
