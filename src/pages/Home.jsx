import { Link } from 'react-router-dom'
import { buttonClasses } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Kontainer • Self Storage
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Sicher einlagern, online reservieren und alles zentral verwalten.
          </h1>
          <p className="text-lg text-muted-foreground">
            Digitale Plattform für Entdeckung, Vergleich und Reservierung von Containern (Standard, Secure+, SmartView) mit mobile-first UX.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/kontainers" className={buttonClasses()}>
              Container ansehen
            </Link>
            <Link to="/register" className={buttonClasses('outline')}>
              Konto erstellen
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Modelle', value: 'Standard • Secure+ • SmartView' },
              { label: 'Buchung', value: '4-stufiger Stepper + Login' },
              { label: 'Differenzial', value: '3D-Visualisierung der Kapazität' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">Disponibilidade rápida</p>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-900">
              24/7
            </span>
          </div>
          <div className="space-y-3">
            {['Größe wählen', 'Modelle vergleichen', 'Mit Login reservieren', 'Kapazität in 3D ansehen'].map(
              (step, index) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ),
            )}
          </div>
          <div className="mt-6 rounded-lg border border-dashed p-4">
            <p className="text-sm font-semibold">SmartView (Konzept)</p>
            <p className="text-sm text-muted-foreground">
              Interne Kamera als Demo im MVP. Live-Snapshot für v3 geplant.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          { title: 'Sicherheit', desc: 'Secure+ Modelle mit digitalem Zugang und Monitoring.' },
          { title: 'Transparenz', desc: 'Kapazitätsmodal in 2.5D/3D reduziert Unsicherheit.' },
          { title: 'Mobile-first', desc: 'Optimierte Flows mit Lade- und Erfolgsfeedback.' },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-base font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
