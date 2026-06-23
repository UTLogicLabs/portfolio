export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} UTLogicLabs</span>
        <span>Built with React Router + Cloudflare Workers</span>
      </div>
    </footer>
  );
}
