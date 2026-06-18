import { initDatabase } from './db.js'

let initPromise = null

/** Ensures MySQL tables exist and seed data is loaded (once per process). */
export function ensureDb() {
  if (!initPromise) {
    initPromise = initDatabase().catch((err) => {
      initPromise = null
      throw err
    })
  }
  return initPromise
}
