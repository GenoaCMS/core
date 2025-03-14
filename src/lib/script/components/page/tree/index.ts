import type {
  AttributeData,
  ComponentNode,
  ComponentNodes,
  PageEntry
} from '$lib/script/components/page/entry/types'
import type { ReadableAttributeValue, ReadablePageNode } from '$lib/script/components/page/tree/types'
import type { ObjectReference } from '@genoacms/cloudabstraction/storage'
import type { ComponentNodeReference, LinkAttributeValue } from '$lib/script/components/componentEntry/attribute/types'
import { JSDOM } from 'jsdom'
import dompurify from 'dompurify'
import { parse } from 'marked'
import { getPublicURL } from '$lib/script/storage/storage.server'
import { getPageEntry } from '$lib/script/components/page/page.server'

const parseMarkdown = async (markdown: string) => {
  const window = new JSDOM('').window
  const purify = dompurify(window)
  const html = await parse(markdown)
  return purify.sanitize(html)
}

const linkToURL = async (link: LinkAttributeValue): Promise<string> => {
  if (link.isExternal) {
    return link.url || ''
  }
  if (!link.pageName) return ''
  const destinationPageEntry = await getPageEntry(link.pageName)
  return destinationPageEntry.previewURL
}

const getStorageResourceURL = async (reference: ObjectReference) => {
  let url: string
  try {
    url = await getPublicURL(reference)
  } catch (e) {
    return ''
  }
  return url
}

const componentNodesToReadableNodes = async (component: Array<ComponentNodeReference>, componentNodes: ComponentNodes) => {
  const readableNodePromises: Array<Promise<ReadablePageNode>> = component
    .map(component => componentNodeToReadablePageNode(componentNodes[component], componentNodes))
  const nodes = await Promise.all(readableNodePromises)
  // console.log(JSON.stringify(nodes, null, 2))
  return nodes
}

const attributeDataToNodeValue = async (data: AttributeData, componentNodes: ComponentNodes): Promise<ReadableAttributeValue> => {
  switch (data.type) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'text':
      return data.value as string
    case 'markdown':
      return await parseMarkdown(data.value as string)
    case 'richText':
      return ''
    case 'link':
      return await linkToURL(data.value as LinkAttributeValue)
    case 'storageResource':
      return getStorageResourceURL(data.value as ObjectReference)
    case 'components':
      return await componentNodesToReadableNodes(data.value as Array<ComponentNodeReference>, componentNodes)
  }
}

const componentNodeToReadablePageNode = async (node: ComponentNode,
  componentNodes: ComponentNodes): Promise<ReadablePageNode> => {
  // console.log('name ----------', node.name)
  const readableNode: ReadablePageNode = {
    component: node.name,
    data: {}
  }
  for (const data of Object.values(node.data)) {
    readableNode.data[data.name] = await attributeDataToNodeValue(data, componentNodes)
  }
  return readableNode
}

const pageEntryToReadableTree = async (page: PageEntry): Promise<ReadablePageNode> => {
  const componentNodes = page.contents.nodes
  const rootNode = componentNodes[page.contents.rootNodeUid]

  return await componentNodeToReadablePageNode(rootNode, componentNodes)
}

export {
  pageEntryToReadableTree
}
