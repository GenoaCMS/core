import { config } from '@genoacms/cloudabstraction'
import { type Cookies } from '@sveltejs/kit'
import { CompactSign, jwtVerify } from 'jose'
import { loginWithEmailAndPassword, isEmailAdmins } from './providers.server'

const { cookieName, JWTSecret } = await config.authentication

async function authenticateAndAuthorize (email: string, password: string): Promise<boolean> {
  let areCredentialsValid = false
  try {
    areCredentialsValid = await loginWithEmailAndPassword(email, password)
  } catch (e) {
    return false
  }
  if (!areCredentialsValid) return false
  return await isEmailAdmins(email)
}

async function login (email: string, password: string, cookies: Cookies) {
  const authResult = await authenticateAndAuthorize(email, password)
  if (!authResult) throw new Error('invalid-credentials')
  const payloadText = JSON.stringify({ email }) // TODO: expiration
  const encoder = new TextEncoder()
  const token = await new CompactSign(encoder.encode(payloadText))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(encoder.encode(JWTSecret))
  cookies.set(cookieName, token, { path: '/' })
}

async function verifyAuthCookie (cookies: Cookies) {
  const authCookie = cookies.get(cookieName)
  if (!authCookie) return false
  const result = await jwtVerify(authCookie, new TextEncoder().encode(JWTSecret))
  return result.payload
}

function logout (cookies: Cookies) {
  cookies.delete(cookieName, { path: '/' })
}

export {
  cookieName,
  login,
  verifyAuthCookie,
  logout
}
