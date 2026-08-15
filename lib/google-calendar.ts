import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "crypto"
import { getDb } from "@/lib/db"
import { GoogleCalendarConnection, GoogleCalendarEvent, GoogleCalendarSummary } from "@/lib/types"

const GOOGLE_AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke"
const GOOGLE_CALENDAR_API_BASE_URL = "https://www.googleapis.com/calendar/v3"
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"
const GOOGLE_CALENDAR_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
]

interface GoogleOAuthStatePayload {
  userId: string
  redirectUri?: string
  createdAt: number
}

interface GoogleTokenResponse {
  access_token: string
  expires_in?: number
  refresh_token?: string
  scope?: string
  token_type?: string
}

interface GoogleUserInfoResponse {
  email?: string
  name?: string
}

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}`)
  }
  return value
}

function getEncryptionKey() {
  const raw = process.env.GOOGLE_CALENDAR_ENCRYPTION_KEY || process.env.CLERK_SECRET_KEY
  if (!raw) {
    throw new Error("Missing GOOGLE_CALENDAR_ENCRYPTION_KEY")
  }

  return createHmac("sha256", raw).update("google-calendar-encryption").digest()
}

function getStateSecret() {
  return process.env.GOOGLE_CALENDAR_STATE_SECRET || getRequiredEnv("CLERK_SECRET_KEY")
}

function encodeState(payload: GoogleOAuthStatePayload) {
  const json = JSON.stringify(payload)
  const body = Buffer.from(json).toString("base64url")
  const signature = createHmac("sha256", getStateSecret()).update(body).digest("base64url")
  return `${body}.${signature}`
}

function decodeState(value: string): GoogleOAuthStatePayload {
  const [body, signature] = value.split(".")
  if (!body || !signature) {
    throw new Error("Invalid OAuth state")
  }

  const expected = createHmac("sha256", getStateSecret()).update(body).digest()
  const actual = Buffer.from(signature, "base64url")
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new Error("Invalid OAuth state signature")
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as GoogleOAuthStatePayload
  const maxAgeMs = 10 * 60 * 1000
  if (Date.now() - payload.createdAt > maxAgeMs) {
    throw new Error("OAuth state expired")
  }

  return payload
}

function encryptSecret(value: string) {
  const key = getEncryptionKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`
}

function decryptSecret(value: string) {
  const [ivPart, tagPart, encryptedPart] = value.split(".")
  if (!ivPart || !tagPart || !encryptedPart) {
    throw new Error("Invalid encrypted secret")
  }

  const key = getEncryptionKey()
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivPart, "base64url"))
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, "base64url")),
    decipher.final(),
  ])
  return decrypted.toString("utf8")
}

async function googleTokenRequest(params: URLSearchParams): Promise<GoogleTokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Google token request failed: ${response.status} ${errorText}`)
  }

  return response.json()
}

async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return {}
  }

  return response.json() as Promise<GoogleUserInfoResponse>
}

export function buildGoogleCalendarAuthUrl(userId: string, redirectUri?: string) {
  const callbackUrl = getRequiredEnv("GOOGLE_CALENDAR_REDIRECT_URI")
  const clientId = getRequiredEnv("GOOGLE_CLIENT_ID")
  const state = encodeState({
    userId,
    redirectUri,
    createdAt: Date.now(),
  })

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    scope: GOOGLE_CALENDAR_SCOPES.join(" "),
    state,
  })

  return `${GOOGLE_AUTH_BASE_URL}?${params.toString()}`
}

export async function exchangeGoogleCodeForTokens(code: string) {
  const params = new URLSearchParams({
    code,
    client_id: getRequiredEnv("GOOGLE_CLIENT_ID"),
    client_secret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
    redirect_uri: getRequiredEnv("GOOGLE_CALENDAR_REDIRECT_URI"),
    grant_type: "authorization_code",
  })

  return googleTokenRequest(params)
}

async function refreshGoogleAccessToken(refreshToken: string) {
  const params = new URLSearchParams({
    client_id: getRequiredEnv("GOOGLE_CLIENT_ID"),
    client_secret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  })

  return googleTokenRequest(params)
}

export async function upsertGoogleCalendarConnection(args: {
  userId: string
  tokens: GoogleTokenResponse
}) {
  const db = await getDb()
  const collection = db.collection<Omit<GoogleCalendarConnection, "_id">>("google_calendar_connections")
  const existing = await collection.findOne({ userId: args.userId })
  const userInfo = await fetchGoogleUserInfo(args.tokens.access_token)
  const now = new Date()
  const scope = (args.tokens.scope || GOOGLE_CALENDAR_SCOPES.join(" ")).split(" ").filter(Boolean)
  const refreshToken = args.tokens.refresh_token || (existing?.refreshTokenEncrypted ? decryptSecret(existing.refreshTokenEncrypted) : undefined)

  await collection.updateOne(
    { userId: args.userId },
    {
      $set: {
        userId: args.userId,
        googleUserEmail: userInfo.email || existing?.googleUserEmail,
        googleUserName: userInfo.name || existing?.googleUserName,
        accessTokenEncrypted: encryptSecret(args.tokens.access_token),
        refreshTokenEncrypted: refreshToken ? encryptSecret(refreshToken) : existing?.refreshTokenEncrypted,
        scope,
        tokenType: args.tokens.token_type || existing?.tokenType,
        expiryDate: args.tokens.expires_in ? new Date(Date.now() + args.tokens.expires_in * 1000) : existing?.expiryDate,
        updatedAt: now,
        createdAt: existing?.createdAt || now,
        selectedCalendarIds: existing?.selectedCalendarIds || [],
      },
    },
    { upsert: true }
  )
}

export async function getGoogleCalendarConnection(userId: string) {
  const db = await getDb()
  return db.collection<GoogleCalendarConnection>("google_calendar_connections").findOne({ userId })
}

export async function disconnectGoogleCalendar(userId: string) {
  const db = await getDb()
  const collection = db.collection<GoogleCalendarConnection>("google_calendar_connections")
  const connection = await collection.findOne({ userId })

  if (connection) {
    const encryptedToken = connection.refreshTokenEncrypted || connection.accessTokenEncrypted
    try {
      const token = decryptSecret(encryptedToken)
      await fetch(GOOGLE_REVOKE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token }).toString(),
      })
    } catch (error) {
      console.error("Failed to revoke Google Calendar token; removing local connection:", error)
    }
  }

  await collection.deleteOne({ userId })
}

export async function getGoogleAccessTokenForUser(userId: string) {
  const db = await getDb()
  const collection = db.collection<GoogleCalendarConnection>("google_calendar_connections")
  const connection = await collection.findOne({ userId })

  if (!connection) {
    throw new Error("Google Calendar is not connected")
  }

  if (connection.expiryDate && connection.expiryDate.getTime() > Date.now() + 60_000) {
    return decryptSecret(connection.accessTokenEncrypted)
  }

  if (!connection.refreshTokenEncrypted) {
    return decryptSecret(connection.accessTokenEncrypted)
  }

  const refreshToken = decryptSecret(connection.refreshTokenEncrypted)
  const refreshed = await refreshGoogleAccessToken(refreshToken)
  const accessToken = refreshed.access_token
  const now = new Date()

  await collection.updateOne(
    { userId },
    {
      $set: {
        accessTokenEncrypted: encryptSecret(accessToken),
        updatedAt: now,
        expiryDate: refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000) : connection.expiryDate,
        tokenType: refreshed.token_type || connection.tokenType,
        scope: refreshed.scope ? refreshed.scope.split(" ").filter(Boolean) : connection.scope,
      },
    }
  )

  return accessToken
}

async function googleApiFetch<T>(accessToken: string, path: string, searchParams?: URLSearchParams) {
  const url = `${GOOGLE_CALENDAR_API_BASE_URL}${path}${searchParams ? `?${searchParams.toString()}` : ""}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Google Calendar API request failed: ${response.status} ${errorText}`)
  }

  return response.json() as Promise<T>
}

export async function listGoogleCalendars(userId: string): Promise<GoogleCalendarSummary[]> {
  const accessToken = await getGoogleAccessTokenForUser(userId)
  const response = await googleApiFetch<{
    items?: Array<{
      id: string
      summary: string
      primary?: boolean
      accessRole?: string
      backgroundColor?: string
    }>
  }>(accessToken, "/users/me/calendarList")

  return (response.items || []).map((calendar) => ({
    id: calendar.id,
    summary: calendar.summary,
    primary: calendar.primary,
    accessRole: calendar.accessRole,
    backgroundColor: calendar.backgroundColor,
  }))
}

export async function listGoogleCalendarEvents(args: {
  userId: string
  timeMin: string
  timeMax: string
  calendarIds?: string[]
}): Promise<GoogleCalendarEvent[]> {
  const connection = await getGoogleCalendarConnection(args.userId)
  const calendars = await listGoogleCalendars(args.userId)
  const calendarLookup = new Map(calendars.map((calendar) => [calendar.id, calendar]))
  const targetCalendarIds =
    args.calendarIds && args.calendarIds.length > 0
      ? args.calendarIds
      : connection?.selectedCalendarIds !== undefined
        ? connection.selectedCalendarIds
        : calendars.filter((calendar) => calendar.primary).map((calendar) => calendar.id)

  const accessToken = await getGoogleAccessTokenForUser(args.userId)

  const results = await Promise.all(
    targetCalendarIds.map(async (calendarId) => {
      const params = new URLSearchParams({
        timeMin: args.timeMin,
        timeMax: args.timeMax,
        singleEvents: "true",
        orderBy: "startTime",
      })

      const response = await googleApiFetch<{
        items?: Array<{
          id: string
          status?: string
          summary?: string
          description?: string
          location?: string
          htmlLink?: string
          start?: { dateTime?: string; date?: string }
          end?: { dateTime?: string; date?: string }
        }>
      }>(accessToken, `/calendars/${encodeURIComponent(calendarId)}/events`, params)

      const calendar = calendarLookup.get(calendarId)
      return (response.items || [])
        .filter((event) => event.start?.dateTime && event.end?.dateTime)
        .map((event) => ({
          id: event.id,
          status: event.status,
          summary: event.summary || "Untitled Event",
          description: event.description,
          location: event.location,
          calendarId,
          calendarSummary: calendar?.summary,
          start: event.start!.dateTime!,
          end: event.end!.dateTime!,
          htmlLink: event.htmlLink,
        }))
    })
  )

  return results.flat().sort((a, b) => a.start.localeCompare(b.start))
}

export function parseGoogleOAuthState(state: string) {
  return decodeState(state)
}

export function resolveGoogleCalendarRedirect(origin: string, redirectPath: string | undefined, fallback: string) {
  if (!redirectPath?.startsWith("/") || redirectPath.startsWith("//")) return fallback
  return new URL(redirectPath, origin).toString()
}

export async function updateSelectedGoogleCalendars(userId: string, calendarIds: string[]) {
  const calendars = await listGoogleCalendars(userId)
  const availableIds = new Set(calendars.map((calendar) => calendar.id))
  const uniqueIds = [...new Set(calendarIds)]

  if (uniqueIds.some((calendarId) => !availableIds.has(calendarId))) {
    throw new Error("One or more selected calendars are unavailable")
  }

  const db = await getDb()
  const result = await db.collection("google_calendar_connections").updateOne(
    { userId },
    { $set: { selectedCalendarIds: uniqueIds, updatedAt: new Date() } }
  )

  if (!result.matchedCount) {
    throw new Error("Google Calendar is not connected")
  }

  return uniqueIds
}
