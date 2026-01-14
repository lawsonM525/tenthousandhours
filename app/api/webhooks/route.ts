console.log('webhooks file loaded')
import { NextResponse } from "next/server"
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions"

export async function GET() {
  return new Response("OK")
}

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET
  if (!SIGNING_SECRET) {
    return new Response("Missing SIGNING_SECRET", { status: 500 })
  }

  const { Webhook } = await import("svix")

  const body = await req.text()
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

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
  } catch (e) {
    return new Response("Verification error", { status: 400 })
  }

  const eventType = evt.type

  if (eventType === "user.created") {
    const u = evt.data as any
    const record = await createUser({
      clerkId: u.id,
      email: u.email_addresses?.[0]?.email_address ?? "",
      username: u.username ?? null,
      firstName: u.first_name ?? null,
      lastName: u.last_name ?? null,
      photo: u.image_url ?? null,
    })
    if (record && (record as any)._id) {
      try {
        await clerkClient.users.updateUserMetadata(u.id, {
          publicMetadata: { userId: String((record as any)._id) },
        })
      } catch {}
    }
    return NextResponse.json({ ok: true })
  }

  if (eventType === "user.updated") {
    const u = evt.data as any
    const updated = await updateUser(u.id, {
      firstName: u.first_name ?? null,
      lastName: u.last_name ?? null,
      username: u.username ?? null,
      photo: u.image_url ?? null,
    })
    return NextResponse.json({ ok: true, user: updated })
  }

  if (eventType === "user.deleted") {
    const u = evt.data as any
    const deleted = await deleteUser(u.id)
    return NextResponse.json({ ok: true, user: deleted })
  }

  return NextResponse.json({ ok: true })
}
