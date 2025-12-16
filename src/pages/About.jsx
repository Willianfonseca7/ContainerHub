export default function About() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Über uns</h1>
      <p className="text-muted-foreground">
        Akademisches MVP mit Architektur für ein reales Produkt. Öffentliche Seite fokussiert Akquise (Marketing + Katalog), die Nutzer-App ist für die Retention-Phase nach der Reservierung geplant.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: 'Vision', desc: 'Digitale Plattform für Containervermietung mit nahtloser Experience.' },
          { title: 'Differenziale', desc: 'Kapazitätssimulation, SmartView-Modelle, mobile-first Flows.' },
          { title: 'Roadmap', desc: 'v1 Site + Katalog, v2 komplette Reservierung, v3 SmartView live.' },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-base font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
