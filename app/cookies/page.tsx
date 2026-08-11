import PageHero from '@/components/page-hero'

export default function CookiesPage() {
return ( <main> <PageHero
     eyebrow="Rechtliches"
     title="Cookies"
     description="Informationen über die Verwendung von Cookies auf unserer Website."
   />

  <section className="relative overflow-hidden">
    <div className="absolute left-0 top-0 h-full w-2 bg-[#1dabff]" />

    <div className="mx-auto max-w-4xl px-8 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="prose prose-neutral max-w-none">
        <h2>Was sind Cookies?</h2>

        <p>
          Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert
          werden können, wenn Sie eine Website besuchen. Sie ermöglichen
          unter anderem, bestimmte Funktionen einer Website bereitzustellen
          und die Nutzung der Website zu analysieren.
        </p>

        <h2>Verwendung von Cookies</h2>

        <p>
          Wir verwenden Cookies nur soweit dies für den Betrieb,
          die Sicherheit und die Benutzerfreundlichkeit unserer Website
          erforderlich ist oder soweit eine entsprechende Einwilligung
          vorliegt.
        </p>

        <h2>Notwendige Cookies</h2>

        <p>
          Bestimmte Cookies können erforderlich sein, damit grundlegende
          Funktionen der Website ordnungsgemäss funktionieren.
        </p>

        <h2>Analyse und Drittanbieter</h2>

        <p>
          Falls auf dieser Website künftig Analyse- oder andere
          Drittanbieterdienste eingesetzt werden, können dabei zusätzliche
          Cookies oder ähnliche Technologien verwendet werden. Eine solche
          Verarbeitung erfolgt entsprechend den geltenden gesetzlichen
          Bestimmungen.
        </p>

        <h2>Cookies verwalten</h2>

        <p>
          Sie können Cookies über die Einstellungen Ihres Browsers
          verwalten, blockieren oder bereits gespeicherte Cookies löschen.
          Bitte beachten Sie, dass dadurch bestimmte Funktionen der Website
          möglicherweise eingeschränkt werden können.
        </p>

        <h2>Weitere Informationen</h2>

        <p>
          Weitere Informationen zur Verarbeitung personenbezogener Daten
          finden Sie in unserer
          <a href="/datenschutz"> Datenschutzerklärung</a>.
        </p>
      </div>
    </div>
  </section>
</main>


)
}
