import credentials from './serviceAccount.json' assert { type: 'json' }
import authCredentials from './authCredentials.js'
import { collections } from '../collections.js'

/**
 * @type {import('@genoacms/cloudabstraction').genoaConfig}
 */
const config = {
  authentication: {
    adapter: import('@genoacms/authentication-adapter-array'),
    credentials: authCredentials,
    cookieName: '__session',
    JWTSecret: 'genoacms123' // In real world deployment, pass from environment variable
  },
  authorization: {
    adapter: import('@genoacms/adapter-gcp/authorization'),
    projectId: 'genoacms',
    credentials
  },
  database: {
    adapter: import('@genoacms/adapter-gcp/database'),
    region: 'eu-west3',
    databaseId: '(default)',
    projectId: 'genoacms',
    credentials,
    collections
  },
  deployment: {
    adapter: import('@genoacms/adapter-gcp/deployment'),
    projectId: 'genoacms',
    region: 'europe-west3',
    credentials
  },
  storage: {
    adapter: import('@genoacms/adapter-gcp/storage'),
    projectId: 'genoacms',
    defaultBucket: 'genoacms.test',
    buckets: [
      'genoa-public',
      'genoacms.test'
    ],
    credentials
  }
}

export default config
