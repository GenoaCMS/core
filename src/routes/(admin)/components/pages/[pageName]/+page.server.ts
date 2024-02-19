import { deserializePage, getPage, uploadPage } from '$lib/script/components/page/page.server'
import { fail } from '@sveltejs/kit'
import { listOrCreatePreBuiltComponentList } from '$lib/script/components/componentSchema/component.server'
import { componentSchemaToNode } from '$lib/script/components/page/tree'

export const load = async ({ params }) => {
  const { pageName } = params
  const serializedPage = await getPage(pageName)
  const page = await deserializePage(serializedPage)
  const componentSchemas = await listOrCreatePreBuiltComponentList()
  return {
    page,
    componentSchemas
  }
}

export const actions = {
  updatePage: async ({
    request,
    params
  }) => {
    const { pageName } = params
    const data = await request.formData()
    const diffText = data.get('diff')
    if (!diffText || typeof diffText !== 'string') return fail(400, { reason: 'no-diff' })
    const diff = JSON.parse(diffText)
    const page = await getPage(pageName)

    await uploadPage({
      ...page,
      ...diff,
      lastModified: new Date().toISOString()
    })
  },
  componentSchemaToNode: async ({ request }) => {
    const data = await request.formData()
    const schema = data.get('schema')
    if (!schema || typeof schema !== 'string') return fail(400, { reason: 'no-schema' })
    const schemaObject = JSON.parse(schema)
    // TODO: validate schema
    const node = await componentSchemaToNode(schemaObject)
    return {
      node
    }
  }
}
