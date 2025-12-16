import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Registrierung</h1>
        <p className="text-muted-foreground">Registrierung ist erforderlich, bevor die Reservierung startet.</p>
      </div>
      <form className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Vollständiger Name</span>
            <input
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ihr Name"
              type="text"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Telefon</span>
            <input
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="(11) 99999-0000"
              type="tel"
            />
          </label>
        </div>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">E-Mail</span>
          <input
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="sie@email.com"
            type="email"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Passwort</span>
          <input
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
            type="password"
          />
        </label>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Konto erstellen und fortfahren
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Bereits ein Konto?{' '}
          <Link className="text-primary underline-offset-2 hover:underline" to="/login">
            Anmelden
          </Link>
        </p>
      </form>
    </div>
  )
}
