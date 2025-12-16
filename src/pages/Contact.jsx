export default function Contact() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Kontakt</h1>
      <p className="text-muted-foreground">
        Interessensformular für SmartView und allgemeine Fragen. Spätere Integration mit Backend (Strapi) und CRM.
      </p>

      <form className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Name</span>
            <input
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ihr Name"
              type="text"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">E-Mail</span>
            <input
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="sie@email.com"
              type="email"
            />
          </label>
        </div>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Nachricht</span>
          <textarea
            className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Beschreiben Sie Ihr Anliegen (z.B. Interesse an SmartView)"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Interesse senden
        </button>
      </form>
    </div>
  )
}
