interface ActivityRecordBase {
  timestamp: number
}
interface StorageActivityRecord extends ActivityRecordBase {
  type: 'storage',
  bucket: string,
  path: string
}
interface CollectionsActivityRecord extends ActivityRecordBase {
  type: 'collections',
  collection: string,
  document: string
}
interface ComponentEntryActivityRecord extends ActivityRecordBase{
  type: 'componentEntry',
  componentId: string
}
interface ComponentCodeActivityRecord extends ActivityRecordBase {
  type: 'componentCode',
  componentId: string
}
interface PageActivityRecord extends ActivityRecordBase {
  type: 'page',
  pageId: string
}
type ActivityRecord = StorageActivityRecord
| CollectionsActivityRecord
| ComponentEntryActivityRecord
| ComponentCodeActivityRecord
| PageActivityRecord

export type {
  StorageActivityRecord,
  CollectionsActivityRecord,
  ComponentEntryActivityRecord,
  ComponentCodeActivityRecord,
  PageActivityRecord,
  ActivityRecord
}
