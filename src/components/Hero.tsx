import { Icon } from '@/components/ui';

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                John Doe
              </h1>
              <p className="text-xl text-muted-foreground">
                Senior Software Engineer
              </p>
            </div>
            <div className="max-w-[600px] text-muted-foreground md:text-xl">
              <p>
                I build accessible, inclusive products and digital experiences
                for the web. Specializing in React, TypeScript, and modern
                frontend architecture.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <a href="#contact" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Contact Me
              </a>
              <a href="#projects" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                View Projects
              </a>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="github-logo" size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="linkedin-logo" size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="twitter" size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="mailto:john@example.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="mail" size={20} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[450px] w-[300px] overflow-hidden rounded-lg md:h-[550px] md:w-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" 
                alt="John Doe, Software Engineer" 
                className="object-cover w-full h-full" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}