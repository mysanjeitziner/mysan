import LegalPage from '@/components/legal-page'

export default function ImpressumPage() {
  return (
    <LegalPage
      label="Rechtliches"
      title="Impressum"
    >

      <h2>Angaben zum Unternehmen</h2>

      <p>
        <strong>mySan Jeitziner</strong>
        <br />
        Sanitär und Heizung
        <br />
        Wallis, Schweiz
      </p>

      <h2>Kontakt</h2>

      <p>
        Telefon: [Telefonnummer]
        <br />
        E-Mail: [E-Mail-Adresse]
        <br />
        Website: [Webadresse]
      </p>

      <h2>Vertretungsberechtigte Person</h2>

      <p>
        [Name der verantwortlichen Person]
      </p>

      <h2>Unternehmensangaben</h2>

      <p>
        UID / CHE-Nummer: [CHE-Nummer]
      </p>

      <h2>Haftungsausschluss</h2>

      <p>
        Die Inhalte dieser Website wurden mit grösstmöglicher
        Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
        und Aktualität der Inhalte kann jedoch keine Gewähr
        übernommen werden.
      </p>

      <p>
        Für Inhalte externer Websites, auf die durch Links
        verwiesen wird, übernehmen wir keine Verantwortung.
      </p>

    </LegalPage>
  )
}