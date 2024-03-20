import Ajv from 'ajv'
import type { JSONSchemaType } from 'ajv'

export const ajv = new Ajv()

ajv.addFormat('reference', {
  type: 'string',
  validate: (reference: string) => {
    return true
  }
})
ajv.addFormat('markdown', {
  type: 'string',
  validate: (markdown: string) => {
    return true
  }
})
ajv.addFormat('storageResources', {
  type: 'array',
  items: {
    type: 'string'
  },
  validate: (resources: Array<string>) => {
    return true
  }
})

export function validateDocumentData (schema: JSONSchemaType<any>, documentData: object) {
  return ajv.validate(schema, documentData)
}
