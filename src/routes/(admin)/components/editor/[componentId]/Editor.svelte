<script lang="ts">
  import type { ComponentCodeChange } from '$lib/script/components/editor/types'
  import { superForm, type SuperForm } from 'sveltekit-superforms'
  import { formConfig } from '$lib/script/forms'
  import MonacoEditor from '$lib/components/MonacoEditor.svelte'

  interface Props {
    changeForm: SuperForm<ComponentCodeChange>,
    language: 'javascript'
  }
  const { changeForm, language }: Props = $props()
  const { form, enhance, submit } = superForm(changeForm, { ...formConfig, dataType: 'json' })
  let code = $state($form.uncommitedCode as string || '')
  let updateTimeout: ReturnType<typeof setTimeout>

  function updateFormCode (code: string) {
    form.update(
      ($form) => {
        $form.uncommitedCode = code
        return $form
      },
      { taint: false }
    )
    console.log($form.uncommitedCode)
    submit()
  }
  function scheduleCodeUpdate (code: string) {
    clearTimeout(updateTimeout)
    updateTimeout = setTimeout(() => updateFormCode(code), 1000)
  }

  $effect(() => {
    scheduleCodeUpdate(code)
  })
</script>

<div class="flex w-full h-[93%]">
  <MonacoEditor {language} bind:value={code}/>
</div>

<form action="?/change" method="post" use:enhance hidden>
  <input type="text" name="uid" value={$form.uid}>
  <input type="text" name="uncommitedCode" value={$form.uncommitedCode} class="whitespace-pre">
</form>
