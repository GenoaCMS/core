import { config } from '@genoacms/cloudabstraction'
import type {
  DirectoryContents,
  ObjectReference,
  StorageObject
} from '@genoacms/cloudabstraction/storage'
import { streamToString } from '$lib/script/utils.server'
import { parse as parseFlatted, stringify as stringifyFlatted } from 'flatted'
import {
  getObject,
  uploadObject,
  moveObject,
  deleteObject,
  getPublicURL,
  getSignedURL,
  listDirectory,
  createDirectory,
  moveDirectory,
  deleteDirectory
} from './providers.server'

const getBucketReferences = () => {
  return config.storage.buckets
}

const defaultBucketId = config.storage.defaultBucket

const fullyQualifiedNameToPath = (name: string): string => {
  const lastIndexOfSlash = name.lastIndexOf('/')
  return lastIndexOfSlash === -1 ? name : name.slice(0, lastIndexOfSlash)
}

const fullyQualifiedNameToFilename = (name: string): string => {
  if (name[name.length - 1] === '/') name = name.slice(0, -1)

  const lastIndexOfSlash = name.lastIndexOf('/')
  return lastIndexOfSlash === -1 ? name : name.slice(lastIndexOfSlash + 1)
}

const isDirectoryExisting = (directory: DirectoryContents) => {
  return directory.directories.length > 0 || directory.files.length > 0
}

const listOrCreateDirectory = async (reference: ObjectReference): Promise<DirectoryContents> => {
  const componentList = await listDirectory(reference)
  const isComponentListExisting = isDirectoryExisting(componentList)
  if (!isComponentListExisting) {
    await createDirectory(reference)
  }
  return componentList
}

const getObjectString = async (reference: ObjectReference) => {
  const file = await getObject(reference)
  return await streamToString(file.data)
}
const getObjectJSON = async (reference: ObjectReference) => {
  const text = await getObjectString(reference)

  return JSON.parse(text)
}
const getObjectFlatted = async (reference: ObjectReference) => {
  const text = await getObjectString(reference)
  return parseFlatted(text)
}
const getInternalObjectJSON = (path: string) => getObjectJSON({ bucket: defaultBucketId, name: path })
const getInternalObjectFlatted = (path: string) => getObjectFlatted({ bucket: defaultBucketId, name: path })
const uploadInternalObjectJSON = async (path: string, data: any) => uploadObject({ bucket: defaultBucketId, name: path }, JSON.stringify(data))
const uploadInternalObjectFlatted = async (path: string, data: any) => uploadObject({ bucket: defaultBucketId, name: path }, stringifyFlatted(data))

type ProcessedFile = StorageObject & { filename: string, signedURL: string }

interface ProcessedDirectory {
  directories: Array<ObjectReference>,
  files: Array<ProcessedFile>
}

const processFile = async (bucketId: string, file: StorageObject): Promise<ProcessedFile> => {
  return {
    ...file,
    filename: fullyQualifiedNameToFilename(file.name),
    signedURL: await getSignedURL({
      bucket: bucketId,
      name: file.name
    }, new Date(Date.now() + 1000 * 60 * 60))
  }
}

const processFiles = async (bucketId: string, files: Array<StorageObject>) => {
  const filePromises = files.map(file => processFile(bucketId, file))
  return await Promise.all(filePromises)
}

const processDirectoryContents = async (bucketId: string, contents: DirectoryContents): Promise<ProcessedDirectory> => {
  const directories = contents.directories
  const files = await processFiles(bucketId, contents.files)
  return {
    directories,
    files
  }
}

const deleteInternalObject = async (path: string) => {
  const reference: ObjectReference = {
    bucket: defaultBucketId,
    name: path
  }
  await deleteObject(reference)
}

export {
  getBucketReferences,
  defaultBucketId,
  getObject,
  uploadObject,
  moveObject,
  deleteObject,
  getPublicURL,
  fullyQualifiedNameToPath,
  fullyQualifiedNameToFilename,
  isDirectoryExisting,
  listOrCreateDirectory,
  getObjectJSON,
  getObjectFlatted,
  getInternalObjectJSON,
  getInternalObjectFlatted,
  uploadInternalObjectJSON,
  uploadInternalObjectFlatted,
  processDirectoryContents,
  deleteInternalObject,
  listDirectory,
  createDirectory,
  moveDirectory,
  deleteDirectory
}
