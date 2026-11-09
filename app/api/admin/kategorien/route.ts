
import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth-admin'
import { sql } from '@/lib/neon'

export const runtime = 'nodejs'

async function requireAdmin() {
  const user = await getAdminUser()

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Nicht angemeldet oder keine Berechtigung.' },
        { status: 401 }
      ),
    }
  }

  return { user }
}

// Neue Kategorie erstellen
export async function POST(request: Request) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()

    const name = String(body.name ?? '').trim()
    const slug = String(body.slug ?? '').trim()
    const sortOrder = Number(body.sort_order)
    const active = body.active === true

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name und Slug sind erforderlich.' },
        { status: 400 }
      )
    }

    if (!Number.isFinite(sortOrder)) {
      return NextResponse.json(
        { error: 'Die Reihenfolge muss eine gültige Zahl sein.' },
        { status: 400 }
      )
    }

    await sql`
      INSERT INTO public.categories (
        name,
        slug,
        sort_order,
        active,
        created_at,
        updated_at
      )
      VALUES (
        ${name},
        ${slug},
        ${sortOrder},
        ${active},
        NOW(),
        NOW()
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kategorie erstellen:', error)

    return NextResponse.json(
      {
        error:
          'Die Kategorie konnte nicht erstellt werden. Möglicherweise existiert dieser Slug bereits.',
      },
      { status: 500 }
    )
  }
}

// Kategorie bearbeiten oder aktivieren/deaktivieren
export async function PATCH(request: Request) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()

    const id = String(body.id ?? '')

    if (!id) {
      return NextResponse.json(
        { error: 'Die Kategorie-ID fehlt.' },
        { status: 400 }
      )
    }

    if (
      typeof body.active === 'boolean' &&
      body.name === undefined &&
      body.slug === undefined &&
      body.sort_order === undefined
    ) {
      const result = await sql`
        UPDATE public.categories
        SET active = ${body.active},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING id
      `

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Kategorie nicht gefunden.' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true })
    }

    const name = String(body.name ?? '').trim()
    const slug = String(body.slug ?? '').trim()
    const sortOrder = Number(body.sort_order)

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name und Slug sind erforderlich.' },
        { status: 400 }
      )
    }

    if (!Number.isFinite(sortOrder)) {
      return NextResponse.json(
        { error: 'Die Reihenfolge muss eine gültige Zahl sein.' },
        { status: 400 }
      )
    }

    if (typeof body.active !== 'boolean') {
      return NextResponse.json(
        { error: 'Der Aktiv-Status ist ungültig.' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE public.categories
      SET name = ${name},
          slug = ${slug},
          sort_order = ${sortOrder},
          active = ${body.active},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Kategorie nicht gefunden.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kategorie bearbeiten:', error)

    return NextResponse.json(
      {
        error:
          'Die Kategorie konnte nicht gespeichert werden. Möglicherweise existiert dieser Slug bereits.',
      },
      { status: 500 }
    )
  }
}

// Kategorie löschen
export async function DELETE(request: Request) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  try {
    const body = await request.json()
    const id = String(body.id ?? '')

    if (!id) {
      return NextResponse.json(
        { error: 'Die Kategorie-ID fehlt.' },
        { status: 400 }
      )
    }

    const result = await sql`
      DELETE FROM public.categories
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Kategorie nicht gefunden.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kategorie löschen:', error)

    return NextResponse.json(
      {
        error:
          'Die Kategorie konnte nicht gelöscht werden. Prüfe, ob noch Referenzen dieser Kategorie zugeordnet sind.',
      },
      { status: 500 }
    )
  }
}
