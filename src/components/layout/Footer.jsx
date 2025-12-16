export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Kontainer. Self-storage digital.</p>
        <div className="flex gap-4">
          <a href="#privacidade" className="hover:text-foreground">
            Privacidade
          </a>
          <a href="#termos" className="hover:text-foreground">
            Termos
          </a>
        </div>
      </div>
    </footer>
  )
}
