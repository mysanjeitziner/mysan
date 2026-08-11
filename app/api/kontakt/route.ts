import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      name,
      vorname,
      plz,
      ort,
      email,
      nachricht,
    } = body

    if (!name || !plz || !ort || !email || !nachricht) {
      return NextResponse.json(
        { error: 'Bitte füllen Sie alle Pflichtfelder aus.' },
        { status: 400 }
      )
    }

    const { error } = await resend.emails.send({
      from: 'Website mySan Jeitziner <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'info@mysan.ch'],
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}${vorname ? ` ${vorname}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #222;">

          <h2 style="color: #1dabff;">
            Neue Kontaktanfrage
          </h2>

          <p>
            Über das Kontaktformular auf der Website wurde eine neue Anfrage
            gesendet.
          </p>

          <hr style="border: 0; border-top: 1px solid #ddd; margin: 25px 0;" />

          <h3>Kontaktdaten</h3>

          <p>
            <strong>Name:</strong> ${escapeHtml(name)}<br />
            <strong>Vorname:</strong> ${escapeHtml(vorname || '')}<br />
            <strong>PLZ:</strong> ${escapeHtml(plz)}<br />
            <strong>Ort:</strong> ${escapeHtml(ort)}<br />
            <strong>E-Mail:</strong> ${escapeHtml(email)}
          </p>

          <h3>Nachricht</h3>

          <div
            style="
              background: #f4f7fa;
              padding: 20px;
              white-space: pre-wrap;
              line-height: 1.6;
            "
          >
            ${escapeHtml(nachricht)}
          </div>

          <hr style="border: 0; border-top: 1px solid #ddd; margin: 25px 0;" />

          <p style="font-size: 12px; color: #888;">
            Diese Nachricht wurde über das Kontaktformular von
            mySan Jeitziner GmbH gesendet.
          </p>

        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)

      return NextResponse.json(
        { error: 'Die Nachricht konnte nicht gesendet werden.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Kontaktformular Fehler:', error)

    return NextResponse.json(
      { error: 'Es ist ein Fehler aufgetreten.' },
      { status: 500 }
    )
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}