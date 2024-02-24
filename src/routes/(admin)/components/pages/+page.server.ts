import {
  uploadPageEntry
} from '$lib/script/components/page/page.server'
import { fail, redirect } from '@sveltejs/kit'
import { createPageEntry } from '$lib/script/components/page/entry'
import { isString } from '$lib/script/utils'

export const actions = {
  createPage: async ({ request }) => {
    const data = await request.formData()
    const name = data.get('name')
    const componentName = data.get('componentName')
    if (!isString(name) || !isString(componentName)) return fail(400, { reason: 'no-page-name' })
    const page = await createPageEntry({
      name,
      componentName
    })
    // TODO: validate page
    await uploadPageEntry(page)
    return redirect(307, `pages/${name}`)
  }
}
