import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex } from '@noble/hashes/utils.js'

export async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password)
  return bytesToHex(sha256(bytes))
}
