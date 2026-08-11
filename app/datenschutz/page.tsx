import PageHero from '@/components/page-hero'

export default function DatenschutzPage() {
return ( <main> <PageHero
     eyebrow="Rechtliches"
     title="Datenschutz"
     description="Informationen zum Umgang mit Ihren personenbezogenen Daten."
   />


  <section className="relative overflow-hidden">
    <div className="absolute left-0 top-0 h-full w-2 bg-[#1dabff]" />

    <div className="mx-auto max-w-4xl px-8 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="prose prose-neutral max-w-none">
        <h2>1. Allgemeine Hinweise</h2>

        <p>
          Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese
          Datenschutzerklärung informiert Sie darüber, welche
          personenbezogenen Daten beim Besuch unserer Website erhoben,
          verarbeitet und verwendet werden.
        </p>

        <h2>2. Verantwortliche Stelle</h2>

        <p>
          Mysan Jeitziner<br />
          Sanitär und Heizung<br />
          Wallis, Schweiz
        </p>

        <h2>3. Erhebung und Verarbeitung personenbezogener Daten</h2>

        <p>
          Beim Besuch unserer Website können technische Daten wie
          IP-Adresse, Datum und Uhrzeit des Zugriffs, verwendeter Browser
          sowie aufgerufene Seiten verarbeitet werden. Diese Daten dienen
          insbesondere der technischen Bereitstellung und Sicherheit
          unserer Website.
        </p>

        <h2>4. Kontaktaufnahme</h2>

        <p>
          Wenn Sie uns über das Kontaktformular, per E-Mail oder auf
          anderem Weg kontaktieren, verarbeiten wir die von Ihnen
          übermittelten Angaben zur Bearbeitung Ihrer Anfrage.
        </p>

        <h2>5. Cookies</h2>

        <p>
          Unsere Website kann Cookies und ähnliche Technologien verwenden.
          Weitere Informationen finden Sie auf unserer Seite
          <a href="/cookies"> Cookies</a>.
        </p>

        <h2>6. Ihre Rechte</h2>

        <p>
          Im Rahmen der geltenden gesetzlichen Bestimmungen haben Sie
          insbesondere das Recht auf Auskunft, Berichtigung, Löschung und
          Einschränkung der Verarbeitung Ihrer personenbezogenen Daten.
        </p>

        <h2>7. Änderungen</h2>

        <p>
          Wir können diese Datenschutzerklärung bei Bedarf anpassen. Es
          gilt jeweils die auf dieser Website veröffentlichte aktuelle
          Fassung.
        </p>
      </div>
    </div>
  </section>
</main>


)
}
