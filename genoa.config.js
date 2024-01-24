import credentials from './serviceAccount.json' assert { type: 'json' }

const testCollection = {
  name: 'test',
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      isA: {
        type: 'boolean'
      }
    }
  }
}

/**
 * @type {import('./src/genoa.config.d.ts').default}
 */
const config = {
  // auth: {
  //     adapter: authAdapter
  // }
  database: {
    adapter: import('@genoacms/adapter-gcp/database'),
    region: 'eu-west3',
    databaseId: '(default)',
    projectId: 'genoacms',
    credentials
  },
  storage: {
    adapter: import('@genoacms/adapter-gcp/storage'),
    projectId: 'genoacms',
    buckets: [
      'genoacms'
    ],
    credentials
  },
  collections: [
    testCollection
  ]
}

export default config
