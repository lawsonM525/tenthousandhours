import { NextResponse } from "next/server"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { getPostHogClient } from "@/lib/posthog-server"
import { createUser, deleteUser } from "@/lib/actions/user.actions"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return new Response("OK")
}

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET
  if (!SIGNING_SECRET) return new Response("Missing SIGNING_SECRET", { status: 500 })

  const { Webhook } = await import("svix")

  const body = await req.text()
  const svix_id = req.headers.get("svix-id")
  const svix_timestamp = req.headers.get("svix-timestamp")
  const svix_signature = req.headers.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 })
  }

  const wh = new Webhook(SIGNING_SECRET)

  let evt: WebhookEvent
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch {
    return new Response("Verification error", { status: 400 })
  }

  const eventType = evt.type

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, primary_email_address_id, first_name, last_name, username, image_url } = evt.data
    const primaryEmail = email_addresses?.find((email) => email.id === primary_email_address_id)
      ?? email_addresses?.[0]

    if (!primaryEmail?.email_address) {
      return new Response("Clerk user has no email address", { status: 400 })
    }

    await createUser({
      clerkId: id,
      email: primaryEmail.email_address,
      username,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    })
  }

  if (eventType === "user.deleted" && evt.data.id) {
    await deleteUser(evt.data.id)
  }

  // Track user lifecycle events in PostHog
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, username } = evt.data

    const posthog = getPostHogClient()

    // Identify the user in PostHog
    posthog.identify({
      distinctId: id,
      properties: {
        email: email_addresses?.[0]?.email_address,
        first_name: first_name,
        last_name: last_name,
        username: username,
        created_at: new Date().toISOString(),
      }
    })

    // Capture signup event
    posthog.capture({
      distinctId: id,
      event: 'user_signed_up',
      properties: {
        signup_source: 'clerk',
        has_email: !!email_addresses?.length,
        has_username: !!username,
      }
    })
  }

  return NextResponse.json({ ok: true })
}
