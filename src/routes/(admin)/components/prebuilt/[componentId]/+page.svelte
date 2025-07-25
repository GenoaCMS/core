<script lang="ts">
    import type { AttributeReference, Attribute as AttributeT } from '$lib/script/components/componentEntry/component/types'
    import { formConfig } from '$lib/script/forms'
    import { superForm } from 'sveltekit-superforms'
    import { schemasafe } from 'sveltekit-superforms/adapters'
    import { componentEntrySchema } from '$lib/script/components/componentEntry/component/schemas'
    import { activityTracker } from '$lib/script/activity/client'
    import TopPanel from '$lib/components/TopPanel.svelte'
    import ChangeName from './ChangeName.svelte'
    import Submit from './Submit.svelte'
    import Redo from './Redo.svelte'
    import Undo from './Undo.svelte'
    import Attribute from './Editor/Attribute.svelte'
    import AddAttribute from './AddAttribute.svelte'
    import DeleteComponent from './DeleteComponent.svelte'
    import Sortable from '$lib/components/Sortable.svelte'

    const { data } = $props()
    const componentEntryValidator = schemasafe(componentEntrySchema, { config: { includeErrors: true } })
    const { form, enhance, submit } = superForm(data.updateForm, {
      ...formConfig,
      dataType: 'json',
      validators: componentEntryValidator,
      resetForm: false
    })
    function addAttribute (attribute: AttributeT) {
      form.update($f => {
        $f.attributes[attribute.uid] = attribute
        $f.attributeOrder.push(attribute.uid)
        return $f
      })
    }
    function updateAttribute (attribute: AttributeT) {
      form.update($f => {
        $f.attributes[attribute.uid] = attribute
        return $f
      })
    }
    function deleteAttribute (uid: string) {
      form.update($f => {
        delete $f.attributes[uid]
        $f.attributeOrder = $f.attributeOrder.filter(id => id !== uid)
        return $f
      })
    }
    function reorder (newOrder: Array<AttributeReference>) {
      form.update($f => {
        $f.attributeOrder = newOrder
        return $f
      })
    }
    activityTracker.add({
      type: 'componentEntry',
      timestamp: Date.now(),
      componentId: data.id,
      componentName: $form.name
    })
</script>

<TopPanel>
  <div class="text-2xl">
    Component:
    {$form.name}
  </div>
  {#snippet right()}
    <DeleteComponent name={$form.name} />
    <ChangeName bind:name={$form.name} onrename={submit}/>
    <Undo />
    <Redo />
    <AddAttribute onadd={addAttribute} />
    <Submit />
  {/snippet}
</TopPanel>

<div class="container mx-auto">
  <form id="update-form" method="post" action="?/update" use:enhance class="p-4">
    <Sortable data={$form.attributeOrder} onorder={reorder} isId>
      {#snippet item(attributeUid)}
        {@const attribute = $form.attributes[attributeUid]}
        <Attribute {attribute} onvalue={updateAttribute} ondelete={deleteAttribute} />
      {/snippet}
    </Sortable>
  </form>
</div>
