import {
  listOrCreatePreBuiltComponentList
} from '$lib/script/components/componentSchema/component.server'
import {
  listOrCreatePageList,
  createPage,
  uploadPage
} from '$lib/script/components/page/page.server'
import { fail, redirect } from '@sveltejs/kit'

export const load = async () => {
  const pages = await listOrCreatePageList()
  const components = await listOrCreatePreBuiltComponentList()
  return {
    pages,
    components
  }
}

export const actions = {
  createPage: async ({ request }) => {
    const data = await request.formData()
    const name = data.get('name')
    const contents = data.get('contents')
    if (!name || typeof name !== 'string' ||
      !contents || typeof contents !== 'string') return fail(400, { reason: 'no-page-name' })
    const page = createPage({
      name,
      contents
    })
    // TODO: validate page
    await uploadPage(page)
    return redirect(307, `pages/${name}`)
  }
}
