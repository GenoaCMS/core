<script lang="ts">
    import type { Attribute as AttributeT } from '$lib/script/components/componentEntry/component/types'
    import TopPanel from '$lib/components/TopPanel.svelte'
    import { superForm } from 'sveltekit-superforms'
    import ChangeName from './ChangeName.svelte'
    import { formConfig } from '$lib/script/forms'
    import Submit from './Submit.svelte'
    import Redo from './Redo.svelte'
    import Undo from './Undo.svelte'
    import Attribute from './Editor/Attribute.svelte'
    import { schemasafe } from 'sveltekit-superforms/adapters'
    import { componentEntrySchema } from '$lib/script/components/componentEntry/component/schemas'
    import AddAttribute from './AddAttribute.svelte'

    const { data } = $props()
    const componentEntryValidator = schemasafe(componentEntrySchema, { config: { includeErrors: true } })
    const { form, enhance, submit } = superForm(data.updateForm, {
      ...formConfig,
      dataType: 'json',
      validators: componentEntryValidator,
      resetForm: false
    })
    function updateAttribute (attribute: AttributeT) {
      form.update($f => {
        $f.attributes[attribute.uid] = attribute
        return $f
      })
    }
    function deleteAttribute (uid: string) {
      form.update($f => {
        delete $f.attributes[uid]
        return $f
      })
    }
</script>

<TopPanel>
  <div class="text-2xl">
    Component:
    {$form.name}
  </div>
  {#snippet right()}
    <ChangeName bind:name={$form.name} onrename={submit}/>
    <Undo />
    <Redo />
    <AddAttribute onadd={updateAttribute} />
    <Submit />
  {/snippet}
</TopPanel>

<div class="container mx-auto">
  <form id="update-form" method="post" action="?/update" use:enhance class="p-4">
    {#each Object.values($form.attributes) as attribute (attribute.uid)}
      <Attribute {attribute} onvalue={updateAttribute} ondelete={deleteAttribute} />
    {/each}
  </form>
</div>
