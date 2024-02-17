import type { Page, SerializedPage } from './types'
import {
  defaultBucketId,
  fullyQualifiedNameToFilename,
  getObjectJSON,
  listOrCreateDirectory,
  uploadObject
} from '$lib/script/storage.server'
import { join } from 'path'
import { getComponentSchemaFile } from '$lib/script/components/componentSchema/component.server'
import {
  componentSchemaToNode,
  deserializeComponentTree,
  serializeComponentTree
} from '$lib/script/components/page/tree'

const pagesPath = join('.genoacms', 'pages/')

const listOrCreatePageList = async () => {
  const pageStructureList = await listOrCreateDirectory({
    bucket: defaultBucketId,
    name: pagesPath
  })
  // const pageStructurePromises = pageStructureList.files
  //   .map(async page => getPageStructure(page.name))
  // const pageStructures = await Promise.all(pageStructurePromises)
  // return pageStructures.filter(schema => schema !== null)
  return pageStructureList.files.map(page => fullyQualifiedNameToFilename(page.name))
}

const createPage = async (values: { name: string, componentName: string }): Promise<Page> => {
  const component = await getComponentSchemaFile(values.componentName)
  if (!component) throw new Error('no-component')
  const componentNode = await componentSchemaToNode(component)

  return {
    name: values.name,
    previewURL: '',
    contents: componentNode,
    lastModified: new Date().toISOString()
  }
}

const uploadPage = (page: SerializedPage) => {
  const pageJson = JSON.stringify(page)
  // TODO: validate page
  return uploadObject({
    bucket: defaultBucketId,
    name: join(pagesPath, page.name)
  }, pageJson)
}

const getPage = async (name: string): Promise<SerializedPage> => {
  return await getObjectJSON({
    bucket: defaultBucketId,
    name: join(pagesPath, name)
  })
}

const serializePage = (page: Page): SerializedPage => {
  return {
    name: page.name,
    previewURL: page.previewURL,
    contents: serializeComponentTree(page.contents),
    lastModified: page.lastModified
  }
}

const deserializePage = async (page: SerializedPage): Promise<Page> => {
  return {
    name: page.name,
    previewURL: page.previewURL,
    contents: await deserializeComponentTree(page.contents),
    lastModified: page.lastModified
  }
}

export {
  listOrCreatePageList,
  createPage,
  uploadPage,
  getPage,
  serializePage,
  deserializePage
}
