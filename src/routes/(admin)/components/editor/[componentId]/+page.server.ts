import type { Actions } from './$types'
import { error, redirect, type Load } from '@sveltejs/kit'

import { message, superValidate } from 'sveltekit-superforms'
import { schemasafe } from 'sveltekit-superforms/adapters'
import { formats } from '$lib/script/database/validators'
import { deleteComponent, getComponent, getComponentDefiniton, updateComponentDefinition } from '$lib/script/components/editor'
import { componentCodeChangeSchema, componentDeletionSchema } from '$lib/script/components/editor/schemas'

const deletionValidator = schemasafe(componentDeletionSchema, { config: { formats } })
const changeValidator = schemasafe(componentCodeChangeSchema, { config: { formats } })

export const load: Load = async ({ params }) => {
  const componentId = params.componentId
  if (!componentId || typeof componentId !== 'string') return error(404)
  const component = await getComponent(componentId)
  const componentDefinition = await getComponentDefiniton(component.uid)
  const deletionForm = await superValidate({ uid: component.uid }, deletionValidator)
  const changeForm = await superValidate({ uid: component.uid, uncommitedCode: componentDefinition.uncommitedCode }, changeValidator)
  return {
    component,
    componentDefinition,
    deletionForm,
    changeForm
  }
}

export const actions = {
  delete: async function ({ request }) {
    const form = await superValidate(request, deletionValidator)

    if (!form.valid) return message(form, { status: 'fail', text: 'Failed to delete a component' })
    const component = await getComponent(form.data.uid)
    if (form.data.name !== component.name) return message(form, { status: 'fail', text: `Confirmation phase "${form.data.name}" doesn't match "${component.name}"` })
    await deleteComponent(component)
    return redirect(307, '.')
  },
  change: async function ({ request }) {
    const form = await superValidate(request, changeValidator)
    if (!form.valid) return error(400)
    await updateComponentDefinition(form.data.uid, { uncommitedCode: form.data.uncommitedCode })
  }
} satisfies Actions
